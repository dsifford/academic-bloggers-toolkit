import EditorDriver, { BibOptions, RelativeCitationPositions } from './base';

export default class TinyMCEDriver extends EditorDriver {
    private editor: TinyMCE.Editor;

    public get citationIds() {
        const citations = this.editor.getDoc().querySelectorAll(
            `*:not(.mce-offscreen-selection) > .${this.citationClass}`
        );
        return [...citations].map(c => c.id);
    }

    public get selection() {
        return this.editor.selection.getContent({ format: 'html' });
    }

    public init() {
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
                            new Error(`TinyMCE editor doesn't appear to be available in this scope`)
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

    public setLoadingState(loading?: boolean) {
        this.editor.setProgressState(loading || false);
    }

    public alert(message: string) {
        this.editor.windowManager.alert(message);
    }

    public reset() {
        const elements = this.editor
            .getDoc()
            .querySelectorAll(`#${this.bibliographyId}, .${this.citationClass}`);
        for (const element of elements) {
            element.parentNode!.removeChild(element);
        }
    }

    public removeItems(itemIds: string[]) {
        const doc = this.editor.getDoc();
        for (const id of itemIds) {
            const item = doc.getElementById(id);
            if (!item) {
                throw new Error(`Item with id ${id} could not be found.`);
            }
            if (item && item.parentElement) {
                item.parentElement.removeChild(item);
            }
        }
    }

    public getRelativeCitationPositions(validIds: string[]) {
        const doc = this.editor.getDoc();
        const bm = this.editor.selection.getBookmark();
        const bookmarkIds = [`${bm.id}_start`, `${bm.id}_end`];
        validIds = [...validIds, ...bookmarkIds];

        const nodes = [
            ...doc.querySelectorAll(`
            *:not(.mce-offscreen-selection) >
                .${this.citationClass}:not(${this.citationClass}_broken),
                #${bm.id}_start,
                #${bm.id}_end
        `),
        ];
        const citations = nodes.filter(citation => validIds.indexOf(citation.id) > -1);
        const invalidCitations = nodes.filter(citation => validIds.indexOf(citation.id) === -1);

        const startIndex = citations.findIndex(el => el.id === `${bm.id}_start`);
        const endIndex = citations.findIndex(el => el.id === `${bm.id}_end`);

        const before = citations
            .slice(0, startIndex)
            .filter(citation => bookmarkIds.indexOf(citation.id) === -1)
            .map((citation, i) => <[string, number]>[citation.id, i]);
        const after = citations
            .slice(endIndex + 1)
            .filter(citation => bookmarkIds.indexOf(citation.id) === -1)
            .map((citation, i) => <[string, number]>[citation.id, startIndex + i]);

        for (const invalid of invalidCitations) {
            invalid.classList.add(`${this.citationClass}_broken`);
            invalid.innerHTML = `${this.brokenPrefix} ${invalid.innerHTML}`;
        }

        this.editor.selection.moveToBookmark(bm);

        return <RelativeCitationPositions>{
            currentIndex: startIndex,
            locations: [before, after],
        };
    }

    public composeCitations(
        clusters: Citeproc.CitationCluster[],
        citationByIndex: Citeproc.CitationByIndex,
        kind: Citeproc.CitationKind
    ) {
        return kind === 'note'
            ? this.parseFootnoteCitations(clusters, citationByIndex)
            : this.parseInTextCitations(clusters, citationByIndex);
    }

    public setBibliography(
        options: BibOptions,
        bibliography: ABT.Bibliography | boolean,
        staticBib: boolean = false
    ) {
        return staticBib
            ? this.setStaticBibliography(bibliography)
            : this.setStandardBibliography(options, bibliography);
    }

    protected bindEvents() {
        this.editor.on('show', () => dispatchEvent(new CustomEvent(EditorDriver.events.AVAILABLE)));
        this.editor.on('hide', () =>
            dispatchEvent(new CustomEvent(EditorDriver.events.UNAVAILABLE))
        );
    }

    private setStandardBibliography(options: BibOptions, bibliography: ABT.Bibliography | boolean) {
        const doc = this.editor.getDoc();
        const existingBib = doc.getElementById(this.bibliographyId);
        if (existingBib && existingBib.parentElement) {
            existingBib.parentElement!.removeChild(existingBib);
        }

        if (typeof bibliography === 'boolean') return;

        const bm = this.editor.selection.getBookmark();

        const bib = this.editor.dom.create<HTMLDivElement>('div', {
            class: `${this.bibliographyId} noselect mceNonEditable`,
            id: this.bibliographyId,
        });

        const container = this.editor.dom.create<HTMLDivElement>('div', {
            class: `${this.bibliographyId}__container`,
            id: `${this.bibliographyId}__container`,
        });

        if (options.heading) {
            const heading = this.editor.dom.create<HTMLHeadingElement>(options.headingLevel, {
                class: `${this.bibliographyId}__heading`,
            });
            heading.innerText = options.heading;
            if (options.style === 'toggle')
                heading.classList.add(`${this.bibliographyId}__heading_toggle`);
            bib.appendChild(heading);
        }

        bib.appendChild(container);

        for (const meta of bibliography) {
            const item = this.editor.dom.create<HTMLDivElement>(
                'div',
                {
                    id: meta.id,
                },
                meta.html
            );
            container.appendChild(item);
        }

        if (container.children.length > 0) {
            this.editor.getBody().appendChild(bib);
        }

        // Remove unnecessary &nbsp; from editor
        while (
            bib.previousElementSibling &&
            bib.previousElementSibling.childNodes.length === 1 &&
            bib.previousElementSibling.childNodes[0].nodeName === 'BR'
        ) {
            const p = bib.previousElementSibling;
            if (p.parentNode) p.parentNode.removeChild(p);
        }
        this.editor.setContent(this.editor.getBody().innerHTML);
        this.editor.selection.moveToBookmark(bm);
    }

    private setStaticBibliography(bibliography: ABT.Bibliography | boolean) {
        const bib = this.editor.dom.create<HTMLDivElement>(
            'div',
            {
                class: `${this.staticBibClass} noselect mceNonEditable`,
            },
            typeof bibliography === 'boolean'
                ? `<h2 style="color: red;">Error: No bibliography format exists for your citation type.</h2>`
                : undefined
        );
        bib.style.margin = '0 0 28px';

        if (typeof bibliography !== 'boolean') {
            for (const meta of bibliography) {
                const item = this.editor.dom.create<HTMLDivElement>(
                    'div',
                    {
                        id: meta.id,
                    },
                    meta.html
                );
                bib.appendChild(item);
            }
        }
        this.editor.insertContent(bib.outerHTML);
    }

    private parseInTextCitations(
        clusters: Citeproc.CitationCluster[],
        citationByIndex: Citeproc.CitationByIndex
    ) {
        const doc = this.editor.getDoc();
        const existingNote = doc.getElementById(this.footnoteId);
        if (existingNote && existingNote.parentElement) {
            existingNote.parentElement.removeChild(existingNote);
        }

        for (const [index, inlineText, elementID] of clusters) {
            const citation: HTMLSpanElement | null = doc.getElementById(elementID);
            const sortedItems: Citeproc.SortedItems = citationByIndex[index].sortedItems!;
            const idList: string = JSON.stringify(sortedItems.map(c => c[1].id));

            if (!citation) {
                this.editor.selection.setContent(
                    `<span
                        id='${elementID}'
                        data-reflist='${idList}'
                        class='abt-citation noselect mceNonEditable'
                    >
                        ${inlineText}
                    </span>`
                );
                continue;
            }
            citation.innerHTML = inlineText;
            citation.dataset['reflist'] = idList;
        }
    }

    private parseFootnoteCitations(
        clusters: Citeproc.CitationCluster[],
        citationByIndex: Citeproc.CitationByIndex
    ) {
        const doc = this.editor.getDoc();
        const existingNote = doc.getElementById(this.footnoteId);
        const existingBib = doc.querySelector(`#${this.bibliographyId}`);

        if (existingNote && existingNote.parentElement) {
            existingNote.parentElement.removeChild(existingNote);
        }
        if (existingBib && existingBib.parentElement) {
            existingBib.parentElement.removeChild(existingBib);
        }
        if (clusters.length === 0) return;

        for (const [index, footnote, elementID] of clusters) {
            const inlineText = `[${index + 1}]`;
            const citation: HTMLSpanElement = doc.getElementById(elementID)!;
            const sortedItems: Citeproc.SortedItems = citationByIndex[index].sortedItems!;
            const idList: string = JSON.stringify(sortedItems.map(c => c[1].id));

            if (!citation) {
                this.editor.selection.setContent(
                    `<span
                        id='${elementID}'
                        data-reflist='${idList}'
                        data-footnote='${footnote}'
                        class='abt-citation noselect mceNonEditable'
                    >
                        ${inlineText}
                    </span>`
                );
                continue;
            }
            citation.innerHTML = inlineText;
            citation.dataset['reflist'] = idList;
            citation.dataset['footnote'] = footnote;
        }

        const bm = this.editor.selection.getBookmark();

        const note = this.editor.dom.create<HTMLDivElement>('div', {
            class: `${this.footnoteId} noselect mceNonEditable`,
            id: this.footnoteId,
        });
        const heading = this.editor.dom.create<HTMLDivElement>(
            'div',
            {
                class: `${this.footnoteId}__heading`,
            },
            top.ABT_i18n.misc.footnotes
        );

        note.appendChild(heading);

        const citations = <NodeListOf<HTMLSpanElement>>doc.querySelectorAll(this.citationClass);

        for (const [index, citation] of citations.entries()) {
            const i = index + 1;
            citation.innerText = `[${i}]`;
            const noteItem = this.editor.dom.create<HTMLDivElement>(
                'div',
                {
                    class: `${this.footnoteId}__item`,
                },
                `<span class="abt-footnote__number">[${i}]</span>` +
                    `<span class="abt-footnote__content">${citation.dataset['footnote']}</span>`
            );
            note.appendChild(noteItem);
        }

        this.editor.getBody().appendChild(note);

        while (
            note.previousElementSibling &&
            note.previousElementSibling.childNodes.length === 1 &&
            note.previousElementSibling.childNodes[0].nodeName === 'BR'
        ) {
            const p = note.previousElementSibling;
            p.parentNode!.removeChild(p);
        }
        this.editor.setContent(this.editor.getBody().innerHTML);
        this.editor.selection.moveToBookmark(bm);
    }
}
