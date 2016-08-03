interface Window {
  tinyMCE: TinyMCE.MCE;
  DocumentTouch?;
}

interface InputEvent extends UIEvent {
    target: HTMLInputElement;
}

declare module 'react-virtualized-select' {
    const VSelect: any;
    export default VSelect.defaultProps;
}

declare namespace ABT {

    interface CSLProcessor {
        style: string;
        citeproc: Citeproc.Processor;
        /**
         * Instantiates a new CSL.Engine (either when initially constructed or when
         *   the user changes his/her selected citation style)
         * @param styleID CSL style filename.
         * @return Promise that resolves to either an object containing the style XML
         *   and the `sys` object, or an Error depending on the responses from the
         *   network.
         */
        init(style: string, citationByIndex: Citeproc.CitationByIndex): Promise<Citeproc.CitationClusterData[]>
        /**
         * Updates the Citeproc object and the local state with new citation data.
         * @param citations Array of CSL.Data.
         */
        consumeCitations(citations: CSL.Data[]): {[itemID: string]: CSL.Data};
        /**
         * Purges items from the local state whos ID is listed in `items`
         * @param  items Array of item IDs to remove from the state.
         * @return State after removing items
         */
        purgeCitations(items: string[]): {[itemID: string]: CSL.Data};
        /**
         * Transforms the CSL.Data[] into a Citeproc.Citation.
         *
         * @param currentIndex The current inline-citation's index.
         * @param csl Fallback CSL.Data[].
         * @return Citeproc.CitationByIndexSingle for the current inline citation.
         */
        prepareInlineCitationData(csl: CSL.Data[]): Citeproc.Citation;
        /**
         * Wrapper function for citeproc.makeBibliography that takes the output and
         *   inlines CSS classes that are appropriate for the style (according to the
         *   generated bibmeta).
         * NOTE: This still needs to be extended further.
         * @return {Citeproc.Bibliography} Parsed bibliography.
         */
        makeBibliography(links: 'always'|'urls'|'never'): Citeproc.Bibliography;
    }

    type Bibliography = [Citeproc.Bibmeta, {id: string, html: string}[]];

    interface AdminMeta {
        /** Heading for the bibliography */
        bibHeading: string;
        /** Display style for the bibliography */
        bibStyle: 'fixed'|'toggle';
        /** URL to the `js` directory */
        jsURL: string;
        /** When links should be included in the bibliography */
        links: 'always'|'urls'|'never';
        /** URL `views` within the `tinymce` directory */
        tinymceViewsURL: string;
        /** CSL style filename of the user's preferred citation style (without .csl extension) */
        style: string;
        /** The user's locale (WordPress format) */
        locale: string;
    }

    interface PeopleProps {
        people: CSL.TypedPerson[];
        eventHandler: Function;
        citationType: CSL.CitationType;
    }

    interface FrontendMeta {
        prBoxStyle: 'fixed'|'toggle';
        bibStyle: 'fixed'|'toggle';
    }

    /**
     * addManually: boolean
     * attachInline: boolean;
     * identifierList: string;
     * includeLink: boolean;
     * manualData: CSL.Data;
     * people: CSL.TypedPerson[];
     */
    interface ReferenceWindowPayload {
        addManually: boolean;
        attachInline: boolean;
        identifierList: string;
        manualData: CSL.Data;
        people: CSL.TypedPerson[];
    }

    interface ReferencePayload extends ReferenceWindowPayload {
        citationStyle: string;
    }

    interface ImportWindowPayload {
        filename: string;
        /** [itemID, CSL.Data][] */
        payload: [string, CSL.Data][];
        links: boolean;
    }

    interface FieldMappings {
        bill: FieldMap;
        book: FieldMap;
        chapter: FieldMap;
        'legal_case': FieldMap;
        'paper-conference': FieldMap;
        'entry-encyclopedia': FieldMap;
        'motion_picture': FieldMap;
        speech: FieldMap;
        'article-journal': FieldMap;
        'article-magazine': FieldMap;
        'article-newspaper': FieldMap;
        patent: FieldMap;
        report: FieldMap;
        legislation: FieldMap;
        thesis: FieldMap;
        broadcast: FieldMap;
        webpage: FieldMap;
    }

    interface FieldMap {
        title: string;
        fields: Field[];
        people: {
            label: string;
            type: 'author'|
                'container-author'|
                'editor'|
                'director'|
                'interviewer'|
                'illustrator'|
                'composer'|
                'translator'|
                'recipient'|
                'collection-editor'
        }[];
    }

    interface Field {
        value: string;
        label: string;
        required: boolean;
        pattern: string;
        placeholder: string;
    }

    interface PRMetaPayload {
        1: PeerReviewTableData;
        2: PeerReviewTableData;
        3: PeerReviewTableData;
        selection: '0'|'1'|'2'|'3';
    }

    interface PRMetaState {
        selection: '0'|'1'|'2'|'3';
        1: ABT.PeerReviewTableData;
        2: ABT.PeerReviewTableData;
        3: ABT.PeerReviewTableData;
        hidden: {
            1: boolean
            2: boolean
            3: boolean
        };
    }

    interface PeerReviewTableData {
        heading: {
            value: string;
        };
        response: PeerReviewSingleData;
        review: PeerReviewSingleData;
    }

    interface PeerReviewSingleData {
        background: string;
        content: string;
        image: string;
        name: string;
        twitter: string;
    }
}

declare namespace Citeproc {

    /**
     * 1: Bibmeta
     * 2: Array of raw citation HTML.
     */
    type Bibliography = [
        Bibmeta,
        string[]
    ];
    type CitationByIndex = Citation[];
    /**
     * 0: The index of the HTMLSpanElement within the document
     * 1: An HTML string of the inline citation.
     * 2: A string containing a unique ID which should be used for the span
     *    element's ID.
     */
    type CitationClusterData = [number, string, string];
    type CitationsPrePost = [string, number][];
    /**
     * 0: A string containing a unique ID which should be used for the span
     *    element's ID.
     * 1: The index of the HTMLSpanElement within the document
     * 2: An HTML string of the inline citation.
     * @type {Array}
     */
    type RebuildProcessorStateData = [string, number, string];
    type SortedItems = [
        CSL.Data,
        {
            id: string;
            sortkeys: [string];
        }
    ][];

    interface Bibmeta {
        /** Closing div tag for bibliography. */
        bibend?: string;
        /** array of strings? for errors. */
        'bibliography_errors'?: string[];
        /** Opening div tag for bibliography. */
        bibstart?: string;
        /** (not sure what for) */
        done?: boolean;
        /** array of itemIDs */
        'entry_ids'?: [string][];
        /** horizontal spacing? */
        entryspacing?: number;
        /** vertical spacing? */
        linespacing?: number;
        maxoffset?: number;
        'second-field-align'?: 'flush'|'margin'|boolean;
    }


    interface Citation {
        citationID?: string;
        citationItems: {
            id: string;
            item?: CSL.Data;
        }[];
        properties: {
            index?: number;
            noteIndex: number;
        };
        sortedItems?: SortedItems;
    }

    interface CitationRegistry {
        /** Retrieve citation(s) by a HTMLSpanElement ID */
        citationById: {
            [id: string]: Citation;
        };
        /** Retrieve citation(s) by the index of its parent HTMLSpanElement in the document */
        citationByIndex: Citation[];
        /** Retrieve citation by the unique citation ID */
        citationsByItemId: {
            [itemId: string]: Citation[];
        };
    }

    interface SystemObj {
        retrieveLocale(lang: string): string;
        retrieveItem(id: string|number): CSL.Data;
    }

    interface Processor {
        registry: {
            citationreg: CitationRegistry;
        };
        sys: SystemObj;
        opt: {
            xclass: 'note'|'in-text';
        };
        makeBibliography(): Bibliography;
        processCitationCluster(
            citation: Citeproc.Citation,
            pre: Citeproc.CitationsPrePost,
            post: Citeproc.CitationsPrePost
        ): [{ bibchange: boolean; 'citation_errors': string[]}, CitationClusterData[]];
        rebuildProcessorState(citationByIndex: Citation[]): RebuildProcessorStateData[];
    }

}

declare namespace TinyMCE {

    interface MCE {
        DOM: Object;
        EditorManager;
        PluginManager: PluginManager;
        EditorObservable;
        Env;
        WindowManager;
        activeEditor: Editor;
        add(editor: Editor): Editor;
        dom: Object;
        editors: Editor[];
        remove(e?: string): void;
    }

    interface Editor {
        id: string;
        buttons: Object;
        container: HTMLDivElement;
        contentDocument: HTMLDocument;
        contentWindow: Window;
        controlManager: Object;
        dom: {
            doc: Document;
            create(tag: string, attrs: { [attr: string]: string}, children?: string): HTMLElement;
        };
        selection: {
            bookmarkManager: {
                getBookmark(type?: number, normalized?: boolean): Object;
                moveToBookmark(bookmark: Object): boolean
            }
            getBookmark(type?: number, normalized?: boolean): Object;
            collapse(toStart: boolean): void;
            getNode(): Node;
            select(el: HTMLElement, content: boolean);
            setCursorLocation(a): void;
            moveToBookmark(bookmark: Object): boolean;
        };
        settings: {
            params;
        };
        target: Object;
        windowManager: WindowManager;
        wp: Object;
        addButton(buttonID: string, buttonObj: Object): void;
        addShortcut(keys: string, title: string, func: Function): void;
        getBody(): HTMLBodyElement;
        getContent(): string;
        setContent(content: string, args?: Object): string;
        insertContent(content: string): void;
        on(eventString: string, callback: Function): void;
        /** true = loading; false = not loading */
        setProgressState(state: boolean): void;
    }

    interface WindowManager {
        alert?(message: string, callback?: Function, scope?: Object): void;
        close?(): void;
        confirm?(message: string, callback?: Function, scope?: Object): void;
        data?: Object;
        editor?: Editor;
        onClose?(e): void;
        onOpen?(e): void;
        open?(window: WindowMangerObject): void;
        setParams?(paramObj): void;
        windows?;
        submit?(): () => void;
    }

    interface PluginManager {
        add(pluginName: string, callback: Function);
    }

    interface MenuItem {
        text: string;
        menu?: MenuItem[];
        onclick?: (e?: Event) => void;
        disabled?: boolean;
        id?: string;
    }

    interface WindowElement {
        type: string;
        name?: string;
        label?: string;
        value?: string;
        html?: string;
        tooltip?: string;
    }

    interface WindowMangerObject {
        title: string;
        width?: number;
        height?: number;
        body?: WindowElement[];
        url?: string;
        buttons?: Object;
        params?: Object;
        onclose?(e);
        onsubmit?(e);
    }
}

declare namespace CSL {

    type CitationType =
        'article'|'article-journal'|'article-magazine'|'article-newspaper'|
        'bill'|'book'|'broadcast'|'chapter'|'dataset'|'entry'|'entry-dictionary'|
        'entry-encyclopedia'|'figure'|'graphic'|'interview'|'legal_case'|
        'legislation'|'manuscript'|'map'|'motion_picture'|'musical_score'|
        'pamphlet'|'paper-conference'|'patent'|'personal_communication'|'post'|
        'post-weblog'|'report'|'review'|'review-book'|'song'|'speech'|'thesis'|
        'treaty'|'webpage';


    interface Citation {
        schema: 'https://github.com/citation-style-language/schema/raw/master/csl-citation.json';
        citationID: string|number;
        citationItems?: CitationItem[];
        properties?: {
            noteIndex: number
        };
    }


    interface CitationItem {
        id: string|number;
        itemData?: string;
        prefix?: string;
        suffix?: string;
        locator?: string;
        label?: 'book'|
            'chapter'|
            'column'|
            'figure'|
            'folio'|
            'issue'|
            'line'|
            'note'|
            'opus'|
            'page'|
            'paragraph'|
            'part'|
            'section'|
            'sub verbo'|
            'verse'|
            'volume';
        'suppress-author'?: string|number|boolean;
        'author-only'?: string|number|boolean;
        uris?: string[];
    }

    interface Data {
        id?: string;
        type?: CitationType;
        categories?: string[];
        language?: string;
        journalAbbreviation?: string;
        shortTitle?: string;
        author?: Person[];
        'collection-editor'?: Person[];
        composer?: Person[];
        'container-author'?: Person[];
        director?: Person[];
        editor?: Person[];
        'editorial-director'?: Person[];
        interviewer?: Person[];
        illustrator?: Person[];
        'original-author'?: Person[];
        recipient?: Person[];
        'reviewed-author'?: Person[];
        translator?: Person[];
        accessed?: Date;
        container?: Date;
        'event-date'?: Date;
        'issued'?: Date;
        'original-date'?: Date;
        submitted?: Date;
        abstract?: string;
        annote?: string;
        archive?: string;
        'archive-location'?: string;
        'achive-place'?: string;
        authority?: string;
        'call-number'?: string;
        'chapter-number'?: string;
        'citation-number'?: string;
        'citation-label'?: string;
        'collection-number'?: string;
        'collection-title'?: string;
        'container-title'?: string;
        'container-title-short'?: string;
        dimensions?: string;
        DOI?: string;
        edition?: string|number;
        event?: string;
        'event-place'?: string;
        'first-reference-note-number'?: string;
        genre?: string;
        ISBN?: string;
        ISSN?: string;
        issue?: string|number;
        jurisdiction?: string;
        keyword?: string;
        locator?: string;
        medium?: string;
        note?: string;
        number?: string|number;
        'number-of-pages'?: string;
        'number-of-volumes'?: string|number;
        'original-publisher'?: string;
        'original-publisher-place'?: string;
        'original-title'?: string;
        'page'?: string;
        'page-first'?: string;
        PMCID?: string;
        PMID?: string;
        publisher?: string;
        'publisher-place'?: string;
        references?: string;
        'reviewed-title'?: string;
        scale?: string;
        section?: string;
        source?: string;
        status?: string;
        title?: string;
        'title-short'?: string;
        URL?: string;
        version?: string;
        volume?: string|number;
        'year-suffix'?: string;
    }

    interface Person {
        family?: string;
        given?: string;
        'dropping-particle'?: string;
        'non-dropping-particle'?: string;
        suffix?: string;
        'comma-suffix'?: string|number|boolean;
        'static-ordering'?: string|number|boolean;
        literal?: string;
        'parse-names'?: string|number|boolean;
    }

    /**
     * Skipped Person Types:
     *   - collection-editor
     *   - editorial-director
     *   - original-author
     *   - reviewed-author
     */
    interface TypedPerson extends Person {
        type: 'author'|
              'container-author'|
              'editor'|
              'director'|
              'interviewer'|
              'illustrator'|
              'composer'|
              'translator'|
              'recipient';
    }

    interface Date {
        'date-parts'?: [ (number|string)[] ];
        season?: string|number;
        circa?: string|number|boolean;
        literal?: string;
        raw?: string;
        /* Not part of CSL spec - Added by Citeproc */
        day?: number;
        month?: number;
        year?: number;
    }

}

declare namespace PubMed {

    type Data = SingleReference[]

    interface SingleReference {
        articleids?: {
            idtype: string
            idtypen: number
            value: string
        }[];
        attributes?: string[];
        authors?: Author[];
        availablefromurl?: string;
        bookname?: string;
        booktitle?: string;
        chapter?: string;
        doccontriblist?: string[];
        docdate?: string;
        doctype?: string;
        edition?: string;
        elocationid?: string;
        epubdate?: string;
        essn?: string;
        fulljournalname?: string;
        history?: {
            date: string /** NOTE: format: 'YYYY/MM/DD HH:MM' */
            pubstatus: string
        }[];
        issn?: string;
        issue?: string;
        lang?: string[];
        lastauthor?: string; /** NOTE: format: 'Lastname FM' */
        pubdate?: string;
        sortpubdate?: string; /** NOTE: format: 'YYYY/MM/DD HH:MM' */
        sorttitle?: string;
        source?: string;
        srccontriblist?: string[];
        srcdate?: string;
        title?: string;
        vernaculartitle?: string;
        viewcount?: number;
        volume?: string;
        uid?: number;
    }

    interface Author {
      authtype?: string;
      clusterid?: string;
      name?: string;
      firstname?: string;
      lastname?: string;
      middleinitial?: string;
    }

}
