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

    /**
     * 0: ID of the HTMLSpanElement containing the inline citation(s)
     * 1: 0-based index of the location of the HTMLSpanElement in the document
     * @type {Array}
     */
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
            /** ID of the individual CSL item */
            id: string;
            item?: CSL.Data;
        }[];
        properties: {
            index?: number;
            /** 0-based index of the citation group in the document */
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
