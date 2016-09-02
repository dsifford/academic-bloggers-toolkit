// tslint:disable no-namespace
interface Window {
  tinyMCE: TinyMCE.MCE;
  DocumentTouch?;
}

declare module 'react-virtualized-select';

declare const ABT_CitationStyles: {label: string, value: string}[];

declare namespace BackendGlobals {

    // tslint:disable-next-line
    interface ABT_i18n {
        citationTypes: ABT.CitationTypes;
        fieldmaps: ABT.FieldMappings;
        referenceList: {
            menu: {
                stylePlaceholder: string;
                tooltips: {
                    destroy: string;
                    'import': string;
                    refresh: string;
                    help: string;
                };
            };
            referenceList: {
                citedItems: string;
                tooltips: {
                    add: string;
                    insert: string;
                    pin: string;
                    remove: string;
                };
                uncitedItems: string;
                noBibAlertWarning: string;
                noBibAlertReason: string;
            };
        };
        tinymce: {
            importWindow: {
                title: string;
                filetypeError: string;
                leftovers: string;
                'import': string;
                upload: string;
            };
            pubmedWindow: {
                title: string;
                addReference: string;
                next: string;
                previous: string;
                search: string;
            };
            referenceWindow: {
                referenceWindow: {
                    title: string;
                };
                buttonRow: {
                    addManually: string;
                    addReference: string;
                    addWithIdentifier: string;
                    attachInline: string;
                    pubmedWindowTitle: string;
                    searchPubmed: string;
                };
                identifierInput: {
                    label: string;
                };
                manualEntryContainer: {
                    type: string;
                };
                people: {
                    add: string;
                    given: string;
                    surname: string;
                };
            };
        };
    }

    // tslint:disable-next-line
    interface ABT_Reflist_State {
        bibOptions: {
            heading: string;
            style: 'fixed'|'toggle';
        };
        cache: {
            style: string;
            links: ABT.LinkStyle;
            locale: string;
        };
        citationByIndex: Citeproc.CitationByIndex;
        CSL: {
            [id: string]: CSL.Data;
        };
    }

    // tslint:disable-next-line
    interface ABT_wp {
        abt_url: string;
        home_url: string;
        plugins_url: string;
        wp_upload_dir: {
            /* /folder-of-wp-installation/wp-content/uploads */
            basedir: string;
            /* http(s)://siteurl.com/wp-content/uploads */
            baseurl: string;
            error: boolean;
            /* /folder-of-wp-installation/wp-content/uploads/2016/08 */
            path: string;
            /* /2016/08 */
            subdir: string;
            /* http(s)://siteurl.com/wp-content/uploads/2016/08 */
            url: string;
        };
    }

    // tslint:disable-next-line
    interface ABT_Custom_CSL {
        CSL?: string;
        label: string;
        value?: string;
    }
}

// tslint:disable-next-line
declare namespace ABT {

    type LinkStyle = 'always'|'always-full-surround'|'urls'|'never';

    type CitationTypes = {
        inUse: boolean;
        label: string;
        value: string;
    }[];

    type Bibliography = {id: string, html: string}[];

    interface PeopleProps {
        people: CSL.TypedPerson[];
        eventHandler: Function;
        citationType: CSL.CitationType;
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

}

// tslint:disable no-namespace
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
        /** NOT USED - Closing div tag for bibliography. */
        bibend: string;
        /** array of strings? for errors. */
        'bibliography_errors': string[];
        /** NOT USED - Opening div tag for bibliography. */
        bibstart: string;
        /** (not sure what for) */
        done: boolean;
        /** array of itemIDs */
        'entry_ids': [string][];
        /** Vertical margin between each individual reference item. */
        entryspacing: number;
        /**
         * Should the bibliography have hanging indents?
         * NOTE: There is currently a bug in Citeproc-js where this value is actually
         *   a number. This should not affect this though.
         */
        hangingindent: boolean;
        /** Vertical spacing within each individual reference item. */
        linespacing: number;
        /**
         * NOT USED - Maximum width of the label for the bibliography. In other words,
         *   a bibliography numbered up to 1000 will have a greater maxoffset
         *   than one numbered up to 5.
         */
        maxoffset: number;
        /**
         * Too difficult to explain.
         * See here: https://github.com/citation-style-language/styles/issues/804#issuecomment-31467854
         */
        'second-field-align': 'flush'|'margin'|boolean;
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
        makeBibliography(): Bibliography|boolean;
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
        dom: Object;
        editors: Editor[];
        activeEditor: Editor;
        add(editor: Editor): Editor;
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
            create(tag: string, attrs: { [attr: string]: string}, children?: string): HTMLElement;
            doc: Document;
            getStyle(element: HTMLElement, name: string, computed: boolean): string;
        };
        selection: {
            bookmarkManager: {
                getBookmark(type?: number, normalized?: boolean): Object;
                moveToBookmark(bookmark: Object): boolean
            }
            collapse(toStart: boolean): void;
            getBookmark(type?: number, normalized?: boolean): Object;
            getNode(): Node;
            getContent(args: { format: 'html'|'text' }): string;
            moveToBookmark(bookmark: Object): boolean;
            select(el: HTMLElement, content: boolean);
            setCursorLocation(a): void;
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
        data?: Object;
        editor?: Editor;
        windows?;
        alert?(message: string, callback?: Function, scope?: Object): void;
        close?(): void;
        confirm?(message: string, callback?: Function, scope?: Object): void;
        onClose?(e): void;
        onOpen?(e): void;
        open?(window: WindowMangerObject): void;
        setParams?(paramObj): void;
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
            /** format: 'YYYY/MM/DD HH:MM' */
            date: string;
            pubstatus: string;
        }[];
        issn?: string;
        issue?: string;
        lang?: string[];
        /** format: 'Lastname FM' */
        lastauthor?: string;
        medium?: string;
        nlmuniqueid?: string;
        pages?: string;
        pubdate?: string;
        publisherlocation?: string;
        publishername?: string;
        reportnumber?: string;
        locationlabel?: string;
        /**
         * (1) received      -- date manuscript received for review
         * (2) accepted      -- accepted for publication
         * (3) epublish      -- published electronically by publisher
         * (4) ppublish      -- published in print by publisher
         * (5) revised       -- article revised by publisher/author
         * (6) pmc           -- article first appeared in PubMed Central
         * (7) pmcr          -- article revision in PubMed Central
         * (8) pubmed        -- article citation first appeared in PubMed
         * (9) pubmedr       -- article citation revision in PubMed
         * (10) aheadofprint -- epublish, but will be followed by print
         * (11) premedline   -- date into PreMedline status
         * (12) medline      -- date made a MEDLINE record
         * (255) other
         */
        pubstatus?: '1'|'2'|'3'|'4'|'5';
        pubtype?: string;
        recordstatus?: string;
        sortfirstauthor?: string;
        /** format: 'YYYY/MM/DD HH:MM' */
        sortpubdate?: string;
        sorttitle?: string;
        source?: string;
        srccontriblist?: string[];
        srcdate?: string;
        title?: string;
        vernaculartitle?: string;
        viewcount?: number;
        volume?: string;
        uid?: string;
    }
    /*

     */

    interface Author {
      authtype?: string;
      clusterid?: string;
      name?: string;
      firstname?: string;
      lastname?: string;
      middleinitial?: string;
    }

}
