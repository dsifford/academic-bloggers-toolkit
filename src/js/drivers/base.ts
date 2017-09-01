export interface BibOptions {
    /** Heading options */
    heading: string;
    /** HTML Heading element preferred for heading */
    headingLevel: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    /** Should the heading be toggleable? */
    style: 'fixed' | 'toggle';
}

export interface RelativeCitationPositions {
    /** The zero-based index of the HTMLSpanElement being inserted */
    currentIndex: number;
    /** Enum describing the citations located before [0] and after [1] the cursor */
    locations: [Citeproc.CitationsPrePost, Citeproc.CitationsPrePost];
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

export interface EditorDriverConstructor {
    new (): EditorDriver;
}

interface InlineElementOptions {
    kind: Citeproc.CitationKind;
    classNames?: string[];
    id: string;
    reflist: string;
    innerHTML: string;
    footnote?: string;
}

/**
 * Base class from which all editor drivers must be derived
 */
export default abstract class EditorDriver {
    static readonly events = EditorEvents;

    static readonly bibliographyId = 'abt-bibliography';
    static readonly brokenPrefix = top.ABT_i18n.errors.broken;
    static readonly citationClass = 'abt-citation';
    static readonly footnoteId = 'abt-footnote';
    static readonly staticBibClass = 'abt-static-bib';

    static createBibliographyElement(
        { heading = '', headingLevel = 'h3', style = 'fixed' }: Partial<BibOptions>,
        items: ABT.Bibliography,
        classNames: string[] = [],
    ): HTMLDivElement {
        const bib = document.createElement('div');
        bib.id = EditorDriver.bibliographyId;
        bib.classList.add(EditorDriver.bibliographyId, ...classNames);

        if (bib.classList.contains(EditorDriver.staticBibClass)) {
            bib.classList.remove(EditorDriver.bibliographyId);
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
                    `${EditorDriver.bibliographyId}__heading`,
                    `${EditorDriver.bibliographyId}__heading_toggle`,
                );
                headingElement.setAttribute('aria-expanded', 'false');
                headingElement.setAttribute('aria-controls', `${this.bibliographyId}__container`);
                headingElement.dataset.headingLevel = headingLevel;
            } else {
                headingElement = document.createElement(headingLevel);
                headingElement.classList.add(`${EditorDriver.bibliographyId}__heading`);
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

    static createInlineElement({
        classNames = [],
        ...options,
    }: InlineElementOptions): HTMLSpanElement {
        const { id, innerHTML, reflist } = options;
        const element = document.createElement('span');
        element.id = id;
        element.classList.add(EditorDriver.citationClass, ...classNames);
        element.innerHTML = innerHTML;
        element.dataset.reflist = reflist;
        if (options.kind === 'note') {
            element.dataset.footnote = options.footnote;
        }
        return element;
    }

    static createFootnoteSection(footnotes: string[], classNames: string[] = []): HTMLDivElement {
        const note = document.createElement('div');
        note.id = EditorDriver.footnoteId;
        note.classList.add(EditorDriver.footnoteId, ...classNames);

        const heading = document.createElement('div');
        heading.classList.add(`${EditorDriver.footnoteId}__heading`);
        heading.innerText = ABT_i18n.misc.footnotes;

        note.appendChild(heading);

        for (const [index, footnote] of footnotes.entries()) {
            const item = document.createElement('div');
            item.classList.add(`${EditorDriver.footnoteId}__item`);

            const itemNumber = document.createElement('span');
            itemNumber.classList.add(`${EditorDriver.footnoteId}__number`);
            itemNumber.innerText = `[${index + 1}]`;

            const itemContent = document.createElement('span');
            itemContent.classList.add(`${EditorDriver.footnoteId}__content`);
            itemContent.innerHTML = footnote;

            item.appendChild(itemNumber);
            item.appendChild(itemContent);

            note.appendChild(item);
        }

        return note;
    }

    /** Retrieve an array of every HTMLElement ID for all citations currently existing in the editor. */
    abstract get citationIds(): string[];

    /**
     * Retrieve a `Citeproc.CitationByIndex` object describing the order and
     * contents of all citations existing in the document.
     */
    abstract get citationsByIndex(): Citeproc.CitationByIndex;

    /** Retrive the currently selected content in the editor as a raw HTML string. */
    abstract get selection(): string;

    /**
     * Called when the window is loaded. Should resolve when the editor is
     * available and ready.
     */
    abstract async init(): Promise<void>;

    /**
     * Responsible for taking the data generated by the citation processor and
     * composing the citations in the editor.
     * @param clusters Array of `Citeproc.CitationCluster`
     * @param citationByIndex Array of `Citeproc.Citation` ordered by position in document
     * @param kind One of `note` or `in-text`
     */
    abstract composeCitations(
        clusters: Citeproc.CitationCluster[],
        citationByIndex: Citeproc.CitationByIndex,
        kind: Citeproc.CitationKind,
    ): void;

    /**
     * Receives a bibliography array and options as input and composes and
     * inserts a bibliography in the editor.
     * @param options Object containing the user's bibliography options
     * @param bibliography Either an array of ABT.Bibliograhy or `false` if the
     * user's current citation style does not support bibliographies
     * @param staticBib Is the bibliography a static biblography? (This should
     * default to false)
     */
    abstract setBibliography(
        options: BibOptions,
        bibliography: ABT.Bibliography | boolean,
        staticBib?: boolean,
    ): void;

    /**
     * Find and remove all citations, footnotes, and bibliographies. Static
     * bibliographies should be maintained.
     */
    abstract reset(): void;

    /**
     * Returns an enum of `Citeproc.CitationsPrePost` describing citations
     * located before and after the current cursor location.
     * @param validIds Array of valid citation IDs that the processor is
     * currently aware of. (necessary for instances where the user deletes a
     * citation without "refreshing" the document)
     */
    abstract getRelativeCitationPositions(validIds: string[]): RelativeCitationPositions;

    /**
     * Responsible for finding and removing elements from the editor that have
     * the given HTML Element IDs.
     * @param idList Array of HTML element IDs to remove from the document
     */
    abstract removeItems(idList: string[]): void;

    /**
     * If the editor supports a 'loading' state which shows a spinner or some
     * progress indicator, this should be implemented.
     *   - If `true` is passed as an arg, the editor's state should be loading.
     *   - If `false` is passed as an arg, the editor's state should be not loading.
     *   - If no args are passed, the editor's loading state should be toggled to
     *   the opposite of what it currently is.
     * @param _loading Optional argument to explicitly set the loading state
     */
    setLoadingState(_loading?: boolean): void {
        return;
    }

    /**
     * If the editor has some form of alert or notifications system, override
     * this so the native notifications are used.
     * @param message Message to be alerted to the user.
     */
    alert(message: string): void {
        window.alert(message);
    }

    /**
     * Should be used for binding all `EditorEvents` to the appropriate
     * handlers for the editor. Must be called internally (ideally should be
     * done directly before promise resolution in the `init()` method).
     * @emits EditorEvents
     */
    protected abstract bindEvents(): void;
}
