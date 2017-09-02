// tslint:disable no-stateless-class

interface InlineElementOptions {
    classNames?: string[];
    footnote?: string;
    id: string;
    innerHTML: string;
    kind: Citeproc.CitationKind;
    reflist: string;
}

enum EditorEvents {
    /**
     * Bind and emit this if the editor supports keyboard shortcuts. Keyboard
     * shortcut for this should be cmd/ctrl+alt+r
     */
    ADD_REFERENCE = 'ADD_REFERENCE',
    /**
     * Emit this any time the editor becomes available again after being
     * unavailable (excluding the initial initialization).
     */
    AVAILABLE = 'EDITOR_AVAILABLE',
    /**
     * Emit this when user manually deletes one or more inline citations using
     * the keyboard.
     */
    CITATION_DELETED = 'CITATION_DELETED',
    /**
     * Bind and emit to this if the editor supports keyboard shortcuts.
     * Keyboard shortcut for this should be cmd/ctrl+alt+p
     */
    TOGGLE_PINNED = 'TOGGLE_PINNED',
    /**
     * Emit this any time the editor goes unavailable or becomes hidden.
     */
    UNAVAILABLE = 'EDITOR_UNAVAILABLE',
    /**
     * Emit this any time the user performs an "undo" in the editor.
     */
    UNDO = 'UNDO',
}

export default abstract class Editor {
    static readonly events = EditorEvents;

    static readonly bibliographyId = 'abt-bibliography';
    static readonly citationClass = 'abt-citation';
    static readonly footnoteId = 'abt-footnote';
    static readonly staticBibClass = 'abt-static-bib';

    static createBibliographyElement(
        { heading = '', headingLevel = 'h3', style = 'fixed' }: Partial<ABT.BibOptions>,
        items: ABT.Bibliography,
        classNames: string[] = [],
    ): HTMLDivElement {
        const bib = document.createElement('div');
        bib.id = Editor.bibliographyId;
        bib.classList.add(Editor.bibliographyId, ...classNames);

        if (bib.classList.contains(Editor.staticBibClass)) {
            bib.classList.remove(Editor.bibliographyId);
            bib.removeAttribute('id');
            // Occurs only when attempting to insert a static list when the
            // user's selected citation type doesn't define a bibliography.
            if (items.length === 0) {
                bib.innerHTML = `<strong>Warning:</strong> No bibliography format exists for your citation type.`;
                return bib;
            }
        }

        if (heading) {
            let headingElement;
            if (style === 'toggle') {
                headingElement = document.createElement('button');
                headingElement.classList.add(
                    `${Editor.bibliographyId}__heading`,
                    `${Editor.bibliographyId}__heading_toggle`,
                );
                headingElement.setAttribute('aria-expanded', 'false');
                headingElement.setAttribute('aria-controls', `${this.bibliographyId}__container`);
                headingElement.dataset.headingLevel = headingLevel;
            } else {
                headingElement = document.createElement(headingLevel);
                headingElement.classList.add(`${Editor.bibliographyId}__heading`);
            }
            headingElement.innerText = heading;
            bib.appendChild(headingElement);
        }

        const container = document.createElement('div');
        container.id = `${this.bibliographyId}__container`;
        container.classList.add(`${this.bibliographyId}__container`);
        bib.appendChild(container);

        for (const itemMeta of items) {
            const item = document.createElement('div');
            item.id = itemMeta.id;
            item.innerHTML = itemMeta.html;
            container.appendChild(item);
        }

        return bib;
    }

    static createFootnoteSection(footnotes: string[], classNames: string[] = []): HTMLDivElement {
        const note = document.createElement('div');
        note.id = Editor.footnoteId;
        note.classList.add(Editor.footnoteId, ...classNames);

        const heading = document.createElement('div');
        heading.classList.add(`${Editor.footnoteId}__heading`);
        heading.innerText = ABT_i18n.misc.footnotes;

        note.appendChild(heading);

        for (const [index, footnote] of footnotes.entries()) {
            const item = document.createElement('div');
            item.classList.add(`${Editor.footnoteId}__item`);

            const itemNumber = document.createElement('span');
            itemNumber.classList.add(`${Editor.footnoteId}__number`);
            itemNumber.innerText = `[${index + 1}]`;

            const itemContent = document.createElement('span');
            itemContent.classList.add(`${Editor.footnoteId}__content`);
            itemContent.innerHTML = footnote;

            item.appendChild(itemNumber);
            item.appendChild(itemContent);

            note.appendChild(item);
        }

        return note;
    }

    static createInlineElement({
        classNames = [],
        ...options,
    }: InlineElementOptions): HTMLSpanElement {
        const { id, innerHTML, reflist } = options;
        const element = document.createElement('span');
        element.id = id;
        element.classList.add(Editor.citationClass, ...classNames);
        element.innerHTML = innerHTML;
        element.dataset.reflist = reflist;
        if (options.kind === 'note') {
            element.dataset.footnote = options.footnote;
        }
        return element;
    }
}
