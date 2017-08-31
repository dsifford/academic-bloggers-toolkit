import EditorDriver, { BibOptions, RelativeCitationPositions } from './base';

interface SelectionCache {
    fresh: boolean;
    selection: string;
    bookmark: {
        rng: Range;
    };
}

export default class TinyMCEDriver extends EditorDriver {
    private editor: TinyMCE.Editor;
    private editorCitationObserver = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const removedNode of mutation.removedNodes) {
                if (removedNode.nodeName !== 'SPAN') {
                    continue;
                }
                const classList = removedNode.attributes.getNamedItem('class');

                if (!classList) {
                    continue;
                }

                if (classList.value.split(' ').includes(EditorDriver.citationClass)) {
                    dispatchEvent(new CustomEvent(EditorDriver.events.CITATION_DELETED));
                }
            }
        }
    });
    private selectionCache: SelectionCache = {
        fresh: false,
        selection: '',
        bookmark: { rng: new Range() },
    };

    get citationIds() {
        const citations = this.editor
            .getDoc()
            .querySelectorAll(`*:not(.mce-offscreen-selection) > .${EditorDriver.citationClass}`);
        return [...citations].map(c => c.id);
    }

    get selection() {
        return this.selectionCache.fresh
            ? this.selectionCache.selection
            : this.editor.selection.getContent({ format: 'html' });
    }

    init() {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const interval = setInterval(() => {
                if (top.tinyMCE === undefined) {
                    attempts += 1;
                    if (attempts === 10) {
                        clearInterval(interval);
                        return reject(
                            new Error(
                                `TinyMCE editor doesn't appear to be available in this scope`,
                            ),
                        );
                    }
                } else {
                    clearInterval(interval);
                    if (top.tinyMCE.editors && top.tinyMCE.editors.content) {
                        this.editor = top.tinyMCE.editors.content;
                        this.bindEvents();
                        return resolve();
                    }
                    top.tinyMCE.EditorManager.on('AddEditor', (e: any) => {
                        if (e.editor.id === 'content') {
                            this.editor = top.tinyMCE.editors.content;
                            this.bindEvents();
                            this.editor.once('PostRender', () => {
                                return resolve();
                            });
                        }
                    });
                }
            }, 500);
        });
    }

    setLoadingState(loading?: boolean) {
        this.editor.setProgressState(loading || false);
    }

    alert(message: string) {
        this.editor.windowManager.alert(message);
    }

    reset() {
        const elements = this.editor
            .getDoc()
            .querySelectorAll(`#${EditorDriver.bibliographyId}, .${EditorDriver.citationClass}`);
        for (const element of elements) {
            element.parentNode!.removeChild(element);
        }
    }

    removeItems(itemIds: string[]) {
        const doc = this.editor.getDoc();
        for (const id of itemIds) {
            const item = doc.getElementById(id);
            if (item && item.parentElement) {
                item.parentElement.removeChild(item);
            }
        }
    }

    get citationsByIndex(): Citeproc.CitationByIndex {
        const doc = this.editor.getDoc();
        const nodes = [
            ...doc.querySelectorAll(`
                *:not(.mce-offscreen-selection) >
                    .${EditorDriver.citationClass}:not(.${EditorDriver.citationClass}_broken)
            `),
        ];
        const isFootnoteType = doc.querySelector(`#${EditorDriver.footnoteId}`) !== null;

        return nodes.reduce(
            (prev, citation, index) => {
                const reflist = citation.getAttribute('data-reflist');

                if (!reflist) {
                    return prev;
                }

                const refs: string[] = JSON.parse(reflist);

                return [
                    ...prev,
                    {
                        citationID: citation.id,
                        citationItems: refs.map(ref => ({
                            id: ref,
                        })),
                        properties: {
                            index,
                            noteIndex: isFootnoteType ? 1 : 0,
                        },
                    },
                ];
            },
            <Citeproc.CitationByIndex>[],
        );
    }

    getRelativeCitationPositions(validIds: string[]) {
        const doc = this.editor.getDoc();
        const bm = this.selectionCache.fresh
            ? this.selectionCache.bookmark
            : this.editor.selection.getBookmark(1);
        const { rng: { startContainer } } = bm;
        const nodes = [
            ...doc.querySelectorAll(`
                *:not(.mce-offscreen-selection) >
                    .${EditorDriver.citationClass}:not(.${EditorDriver.citationClass}_broken)
            `),
        ];

        const citations = nodes.filter(citation => validIds.includes(citation.id));
        const invalidCitations = nodes.filter(citation => !validIds.includes(citation.id));

        let currentIndex: number = 0;
        const locations: Citeproc.CitationLocations = citations.reduce(
            (prev, citation, i) => {
                if (!citation.parentNode) {
                    throw new Error('parentNode not defined for citation');
                }

                const position = startContainer.compareDocumentPosition(citation);

                switch (position) {
                    case Node.DOCUMENT_POSITION_PRECEDING:
                        prev[0] = [...prev[0], [citation.id, i]];
                        break;
                    case Node.DOCUMENT_POSITION_FOLLOWING:
                        if (currentIndex === 0) {
                            currentIndex = i;
                        }
                        prev[1] = [...prev[1], [citation.id, i + 1]];
                }
                return prev;
            },
            <Citeproc.CitationLocations>[[], []],
        );

        for (const invalid of invalidCitations) {
            invalid.classList.add(`${EditorDriver.citationClass}_broken`);
            invalid.innerHTML = `${EditorDriver.brokenPrefix} ${invalid.innerHTML}`;
        }

        this.editor.selection.moveToBookmark(bm);

        return <RelativeCitationPositions>{
            currentIndex,
            locations,
        };
    }

    composeCitations(
        clusters: Citeproc.CitationCluster[],
        citationByIndex: Citeproc.CitationByIndex,
        kind: Citeproc.CitationKind,
    ) {
        return kind === 'note'
            ? this.parseFootnoteCitations(clusters, citationByIndex)
            : this.parseInTextCitations(clusters, citationByIndex);
    }

    setBibliography(
        options: BibOptions,
        bibliography: ABT.Bibliography | boolean,
        staticBib: boolean = false,
    ) {
        return staticBib
            ? this.setStaticBibliography(bibliography)
            : this.setStandardBibliography(options, bibliography);
    }

    protected bindEvents() {
        this.editor.on('focusin', () => {
            this.selectionCache = { ...this.selectionCache, fresh: false };
        });
        this.editor.on('focusout', () => {
            this.selectionCache = {
                fresh: true,
                selection: this.selection,
                bookmark: this.editor.selection.getBookmark(1),
            };
        });
        this.editor.on('hide', () => {
            dispatchEvent(new CustomEvent(EditorDriver.events.UNAVAILABLE));
        });
        this.editor.on('show', () => {
            dispatchEvent(new CustomEvent(EditorDriver.events.AVAILABLE));
        });
        this.editor.on('Undo', () => {
            dispatchEvent(new CustomEvent(EditorDriver.events.UNDO));
        });
        this.editor.addShortcut('meta+alt+r', 'Add Reference', () =>
            dispatchEvent(new CustomEvent(EditorDriver.events.ADD_REFERENCE)),
        );
        this.editor.addShortcut('meta+alt+p', 'Pin Reference List', () =>
            dispatchEvent(new CustomEvent(EditorDriver.events.TOGGLE_PINNED)),
        );
        this.editorCitationObserver.observe(this.editor.getBody(), {
            childList: true,
            subtree: true,
        });
    }

    private setStandardBibliography(options: BibOptions, bibliography: ABT.Bibliography | boolean) {
        const doc = this.editor.getDoc();

        const existingBib = doc.getElementById(EditorDriver.bibliographyId);
        if (existingBib && existingBib.parentElement) {
            existingBib.remove();
        }

        if (typeof bibliography === 'boolean' || bibliography.length === 0) return;

        const bm = this.selectionCache.fresh
            ? this.selectionCache.bookmark
            : this.editor.selection.getBookmark(1);

        const bib = EditorDriver.createBibliographyElement(options, bibliography, [
            'noselect',
            'mceNonEditable',
        ]);

        this.editor.getBody().appendChild(bib);

        // Remove unnecessary &nbsp; from editor
        while (
            bib.previousElementSibling &&
            bib.previousElementSibling.childNodes.length === 1 &&
            bib.previousElementSibling.childNodes[0].nodeName === 'BR'
        ) {
            bib.previousElementSibling.remove();
        }
        this.editor.setContent(this.editor.getBody().innerHTML);
        this.editor.selection.moveToBookmark(bm);
    }

    private setStaticBibliography(bibliography: ABT.Bibliography | boolean) {
        const items: ABT.Bibliography = typeof bibliography === 'boolean' ? [] : bibliography;
        const staticBib = EditorDriver.createBibliographyElement({}, items, [
            `${EditorDriver.staticBibClass}`,
            'noselect',
            'mceNonEditable',
        ]);

        const bm = this.selectionCache.fresh
            ? this.selectionCache.bookmark
            : this.editor.selection.getBookmark(1);

        if (typeof bibliography === 'boolean') {
            const warningElement = document.createElement('h2');
            warningElement.style.color = 'red';
            warningElement.innerText =
                'Warning: No bibliography format exists for your citation type.';
            for (const child of staticBib.childNodes) {
                child.parentElement!.removeChild(child);
            }
            staticBib.appendChild(warningElement);
        }
        this.editor.selection.moveToBookmark(bm);
        this.editor.insertContent(staticBib.outerHTML);
    }

    private parseInTextCitations(
        clusters: Citeproc.CitationCluster[],
        citationByIndex: Citeproc.CitationByIndex,
    ) {
        this.editor.focus();
        const doc = this.editor.getDoc();
        const existingNote = doc.getElementById(EditorDriver.footnoteId);
        const bm = this.selectionCache.fresh
            ? this.selectionCache.bookmark
            : this.editor.selection.getBookmark(1);

        if (existingNote) {
            existingNote.remove();
        }

        for (const [index, innerHTML, elementID] of clusters) {
            const citation: HTMLSpanElement | null = doc.getElementById(elementID);
            const reflist = JSON.stringify(citationByIndex[index].citationItems.map(c => c.id));

            if (!citation) {
                this.editor.selection.moveToBookmark(bm);
                this.editor.selection.setContent(
                    EditorDriver.createInlineElement({
                        kind: 'in-text',
                        id: elementID,
                        classNames: ['noselect', 'mceNonEditable'],
                        reflist,
                        innerHTML,
                    }).outerHTML,
                );
                continue;
            }
            citation.innerHTML = innerHTML;
            citation.dataset['reflist'] = reflist;
        }
    }

    private parseFootnoteCitations(
        clusters: Citeproc.CitationCluster[],
        citationByIndex: Citeproc.CitationByIndex,
    ) {
        this.editor.focus();
        const doc = this.editor.getDoc();
        const oldElements = doc.querySelectorAll(
            `#${EditorDriver.footnoteId}, #${EditorDriver.bibliographyId}`,
        );
        for (const old of oldElements) {
            old.remove();
        }

        if (clusters.length === 0) return;

        for (const [index, footnote, elementID] of clusters) {
            const innerHTML = `[${index + 1}]`;
            const citation = doc.getElementById(elementID);
            const reflist: string = JSON.stringify(
                citationByIndex[index].citationItems.map(c => c.id),
            );

            if (!citation) {
                this.editor.selection.setContent(
                    EditorDriver.createInlineElement({
                        kind: 'note',
                        id: elementID,
                        classNames: ['noselect', 'mceNonEditable'],
                        footnote,
                        reflist,
                        innerHTML,
                    }).outerHTML,
                );
                continue;
            }
            citation.innerText = innerHTML;
            citation.dataset['reflist'] = reflist;
            citation.dataset['footnote'] = footnote;
        }

        let orderedFootnotes: string[] = [];
        for (const [index, footnote] of doc
            .querySelectorAll(`.${EditorDriver.citationClass}`)
            .entries()) {
            footnote.textContent = `[${index + 1}]`;
            orderedFootnotes = [...orderedFootnotes, footnote.getAttribute('data-footnote')!];
        }

        const bm = this.selectionCache.fresh
            ? this.selectionCache.bookmark
            : this.editor.selection.getBookmark(1);

        const note = EditorDriver.createFootnoteSection(orderedFootnotes, [
            'noselect',
            'mceNonEditable',
        ]);

        this.editor.getBody().appendChild(note);

        while (
            note.previousElementSibling &&
            note.previousElementSibling.childNodes.length === 1 &&
            note.previousElementSibling.childNodes[0].nodeName === 'BR'
        ) {
            note.previousElementSibling.remove();
        }
        this.editor.setContent(this.editor.getBody().innerHTML);
        this.editor.selection.moveToBookmark(bm);
    }
}
