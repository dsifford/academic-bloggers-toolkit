import EditorDriver from './base';

interface SelectionCache {
    bookmark: {
        rng: Range;
    };
    fresh: boolean;
    selection: string;
}

export default class TinyMCEDriver extends EditorDriver {
    /**
     * The TinyMCE editor instance
     */
    private editor: TinyMCE.Editor;

    /**
     * `MutationObserver` which watches and reacts to removals of individual
     * citation nodes.
     */
    private editorCitationObserver = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const removedNode of Array.from(mutation.removedNodes)) {
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

    /**
     * Small helper that caches the most previous selection content and
     * bookmark when the editor loses focus.
     */
    private selectionCache: SelectionCache = {
        /**
         * True if focus is currently outside of the editor. Otherwise a
         * non-cached selection should be used
         */
        fresh: false,
        /** Content currently selected (HTML) */
        selection: '',
        bookmark: { rng: document.createRange() },
    };

    get citationIds() {
        const citations = this.editor
            .getDoc()
            .querySelectorAll(`*:not(.mce-offscreen-selection) > .${EditorDriver.citationClass}`);
        return [...citations].map(c => c.id);
    }

    get citationsByIndex(): Citeproc.CitationByIndex {
        const doc = this.editor.getDoc();
        const nodes = [
            ...doc.querySelectorAll(`
                *:not(.mce-offscreen-selection) >
                    .${EditorDriver.citationClass}
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

    get relativeCitationPositions() {
        const doc = this.editor.getDoc();
        const bm = this.selectionCache.fresh
            ? this.selectionCache.bookmark
            : this.editor.selection.getBookmark(1);
        const { rng: { startContainer } } = bm;
        const citationNodes = [
            ...doc.querySelectorAll(`
                *:not(.mce-offscreen-selection) >
                    .${EditorDriver.citationClass}
            `),
        ];

        return citationNodes.reduce(
            (prev, citation, i) => {
                if (!citation.parentNode) {
                    throw new Error('parentNode not defined for citation');
                }

                const position = startContainer.compareDocumentPosition(citation);

                switch (position) {
                    case Node.DOCUMENT_POSITION_PRECEDING:
                        prev.itemsPreceding = [...prev.itemsPreceding, [citation.id, i]];
                        break;
                    case Node.DOCUMENT_POSITION_FOLLOWING:
                        prev.itemsFollowing = [...prev.itemsFollowing, [citation.id, i + 1]];
                        break;
                    default:
                        citation.parentElement!.removeChild(citation);
                        this.editor.selection.moveToBookmark(this.selectionCache.bookmark);
                }
                return prev;
            },
            {
                itemsPreceding: <Citeproc.Locator>[],
                itemsFollowing: <Citeproc.Locator>[],
            },
        );
    }

    get selection() {
        return this.selectionCache.fresh
            ? this.selectionCache.selection
            : this.editor.selection.getContent({ format: 'html' });
    }

    alert(message: string) {
        this.editor.windowManager.alert(message);
    }

    composeCitations(
        clusters: Citeproc.CitationResult[],
        citationByIndex: Citeproc.CitationByIndex,
        kind: Citeproc.CitationKind,
    ) {
        this.editor.focus();
        const doc = this.editor.getDoc();
        const oldElements = doc.querySelectorAll(`
            #${EditorDriver.footnoteId},
            #${EditorDriver.bibliographyId}
        `);

        for (const old of Array.from(oldElements)) {
            if (old.parentElement) {
                old.parentElement.removeChild(old);
            }
        }

        for (const [index, content, id] of clusters) {
            const citation = doc.getElementById(id);
            const innerHTML = kind === 'note' ? `[${index + 1}]` : content;
            const reflist = JSON.stringify(citationByIndex[index].citationItems.map(c => c.id));

            if (citation) {
                citation.innerHTML = innerHTML;
                citation.dataset.reflist = reflist;
                citation.dataset.footnote = kind === 'note' ? content : undefined;
            } else {
                this.editor.insertContent(
                    EditorDriver.createInlineElement({
                        classNames: ['noselect', 'mceNonEditable'],
                        footnote: kind === 'note' ? content : undefined,
                        id,
                        innerHTML,
                        kind,
                        reflist,
                    }).outerHTML,
                );
            }
        }

        return kind === 'note' ? this.composeFootnotes() : void 0;
    }

    async init() {
        return new Promise<void>((resolve, reject) => {
            let attempts = 0;
            let interval = setInterval(() => {
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
                    if (
                        top.tinyMCE.editors &&
                        top.tinyMCE.editors.content &&
                        top.tinyMCE.editors.content.initialized
                    ) {
                        this.editor = top.tinyMCE.editors.content;
                        this.bindEvents();
                        return resolve();
                    }
                    interval = setInterval(() => {
                        if (
                            top.tinyMCE.editors.content &&
                            top.tinyMCE.editors.content.initialized
                        ) {
                            clearInterval(interval);
                            this.editor = top.tinyMCE.editors.content;
                            this.bindEvents();
                            return resolve();
                        }
                    }, 200);
                }
            }, 500);
        });
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

    reset() {
        const elements = this.editor
            .getDoc()
            .querySelectorAll(`#${EditorDriver.bibliographyId}, .${EditorDriver.citationClass}`);
        for (const element of Array.from(elements)) {
            if (element.parentElement) {
                element.parentElement.removeChild(element);
            }
        }
        // Required to allow tinymce to consume changes
        this.editor.insertContent('');
    }

    setBibliography(
        options: ABT.BibOptions,
        bibliography: ABT.Bibliography | boolean,
        staticBib: boolean = false,
    ) {
        return staticBib
            ? this.setStaticBibliography(bibliography)
            : this.setStandardBibliography(options, bibliography);
    }

    setLoadingState(loading?: boolean) {
        this.editor.setProgressState(loading || false);
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

    private composeFootnotes() {
        const doc = this.editor.getDoc();
        const orderedFootnotes = [
            ...doc.querySelectorAll(`.${EditorDriver.citationClass}`).entries(),
        ].reduce((prev, [idx, item]) => {
            item.innerHTML = `[${idx + 1}]`;
            const footnote = item.getAttribute('data-footnote');
            return footnote ? [...prev, footnote] : prev;
        }, []);

        if (orderedFootnotes.length === 0) {
            return;
        }

        const bookmark = this.editor.selection.getBookmark();

        const note = EditorDriver.createFootnoteSection(orderedFootnotes, [
            'noselect',
            'mceNonEditable',
        ]);

        const body = this.editor.getBody();
        this.editor.selection.setCursorLocation(body, body.childNodes.length);
        this.editor.insertContent(note.outerHTML);
        this.editor.selection.moveToBookmark(bookmark);
    }

    private setStandardBibliography(
        options: ABT.BibOptions,
        bibliography: ABT.Bibliography | boolean,
    ) {
        if (typeof bibliography === 'boolean' || bibliography.length === 0) return;

        const bib = EditorDriver.createBibliographyElement(options, bibliography, [
            'noselect',
            'mceNonEditable',
        ]);
        const bookmark = this.editor.selection.getBookmark();

        const body = this.editor.getBody();
        this.editor.selection.setCursorLocation(body, body.childNodes.length);
        this.editor.insertContent(bib.outerHTML);
        this.editor.selection.moveToBookmark(bookmark);
    }

    private setStaticBibliography(bibliography: ABT.Bibliography | boolean) {
        const items: ABT.Bibliography = typeof bibliography === 'boolean' ? [] : bibliography;
        const staticBib = EditorDriver.createBibliographyElement({}, items, [
            `${EditorDriver.staticBibClass}`,
            'noselect',
            'mceNonEditable',
        ]);
        if (this.selectionCache.fresh) {
            this.editor.selection.moveToBookmark(this.selectionCache.bookmark);
        }
        this.editor.insertContent(staticBib.outerHTML);
    }
}
