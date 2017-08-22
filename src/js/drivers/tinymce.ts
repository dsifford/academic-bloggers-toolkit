import EditorDriver, { BibOptions, RelativeCitationPositions } from './base';

interface SelectionCache {
    fresh: boolean;
    selection: string;
    bookmark: {
        id: string;
    };
}

export default class TinyMCEDriver extends EditorDriver {
    private editor: TinyMCE.Editor;
    private selectionCache: SelectionCache = {
        fresh: false,
        selection: '',
        bookmark: { id: '' },
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
                if (
                    top.tinyMCE === undefined ||
                    !top.tinyMCE.editors.content ||
                    !top.tinyMCE.editors.content.initialized
                ) {
                    attempts += 1;
                    if (attempts === 10) {
                        clearInterval(interval);
                        return reject(
                            new Error(
                                `TinyMCE editor doesn't appear to be available in this scope`,
                            ),
                        );
                    }
                    return;
                }
                this.editor = top.tinyMCE.editors.content;
                clearInterval(interval);
                this.bindEvents();
                return resolve();
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

    getRelativeCitationPositions(validIds: string[]) {
        const doc = this.editor.getDoc();
        const bm = this.editor.selection.getBookmark();
        const bookmarkIds = [`${bm.id}_start`, `${bm.id}_end`];
        validIds = [...validIds, ...bookmarkIds];

        const nodes = [
            ...doc.querySelectorAll(`
            *:not(.mce-offscreen-selection) >
                .${EditorDriver.citationClass}:not(${EditorDriver.citationClass}_broken),
                #${bm.id}_start,
                #${bm.id}_end
        `),
        ];
        const citations = nodes.filter(citation => validIds.includes(citation.id));
        const invalidCitations = nodes.filter(citation => !validIds.includes(citation.id));

        const startIndex = citations.findIndex(el => el.id === `${bm.id}_start`);
        const endIndex = citations.findIndex(el => el.id === `${bm.id}_end`);

        const before = citations
            .slice(0, startIndex)
            .filter(citation => !bookmarkIds.includes(citation.id))
            .map((citation, i) => <[string, number]>[citation.id, i]);
        const after = citations
            .slice(endIndex + 1)
            .filter(citation => !bookmarkIds.includes(citation.id))
            .map((citation, i) => <[string, number]>[citation.id, startIndex + i]);

        for (const invalid of invalidCitations) {
            invalid.classList.add(`${EditorDriver.citationClass}_broken`);
            invalid.innerHTML = `${EditorDriver.brokenPrefix} ${invalid.innerHTML}`;
        }

        this.editor.selection.moveToBookmark(bm);

        return <RelativeCitationPositions>{
            currentIndex: startIndex,
            locations: [before, after],
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
        this.editor.on('show', () => {
            dispatchEvent(new CustomEvent(EditorDriver.events.AVAILABLE));
        });
        this.editor.on('hide', () =>
            dispatchEvent(new CustomEvent(EditorDriver.events.UNAVAILABLE)),
        );
        this.editor.addShortcut('meta+alt+r', 'Add Reference', () =>
            dispatchEvent(new CustomEvent(EditorDriver.events.ADD_REFERENCE)),
        );
        this.editor.addShortcut('meta+alt+p', 'Pin Reference List', () =>
            dispatchEvent(new CustomEvent(EditorDriver.events.TOGGLE_PINNED)),
        );
        this.editor.on('focusout', () => {
            this.selectionCache = {
                fresh: true,
                selection: this.selection,
                bookmark: this.editor.selection.getBookmark(),
            };
        });
        this.editor.on('focusin', () => {
            this.selectionCache = { ...this.selectionCache, fresh: false };
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
            : this.editor.selection.getBookmark();

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
            : this.editor.selection.getBookmark();

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
        const doc = this.editor.getDoc();
        const existingNote = doc.getElementById(EditorDriver.footnoteId);
        const bm: { id: string } = this.selectionCache.fresh
            ? this.selectionCache.bookmark
            : this.editor.selection.getBookmark();

        if (existingNote) {
            existingNote.remove();
        }

        for (const [index, innerHTML, elementID] of clusters) {
            const citation: HTMLSpanElement | null = doc.getElementById(elementID);
            const sortedItems: Citeproc.SortedItems = citationByIndex[index].sortedItems!;
            const reflist: string = JSON.stringify(sortedItems.map(c => c[1].id));

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
        this.clearAllBookmarks();
    }

    private parseFootnoteCitations(
        clusters: Citeproc.CitationCluster[],
        citationByIndex: Citeproc.CitationByIndex,
    ) {
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
            const sortedItems: Citeproc.SortedItems = citationByIndex[index].sortedItems!;
            const reflist: string = JSON.stringify(sortedItems.map(c => c[1].id));

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

        const bm = this.editor.selection.getBookmark();

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

    private clearAllBookmarks() {
        for (const bm of this.editor
            .getDoc()
            .body.querySelectorAll('span[data-mce-type="bookmark"]')) {
            bm.remove();
        }
    }
}
