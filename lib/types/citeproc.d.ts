// tslint:disable no-namespace

// FIXME: Comb through all of this and update to match below:
// http://citeproc-js.readthedocs.io/en/latest/csl-json/markup.html

declare module 'citeproc' {
    const CSL: Citeproc.EngineConstructor;
    export = CSL;
}

declare namespace Citeproc {
    /**
     * 1: Bibmeta
     * 2: Array of raw citation HTML.
     */
    type Bibliography = [Bibmeta, string[]];

    /**
     * Array of `Citation` ordered ascending by use in the document.
     */
    type CitationByIndex = Citation[];

    /**
     * 0: The index of the HTMLSpanElement within the document
     * 1: An HTML string of the inline citation.
     * 2: A string containing a unique ID which should be used for the span
     *    element's ID.
     */
    type CitationCluster = [number, string, string];

    /**
     * 0: ID of the HTMLSpanElement containing the inline citation(s)
     * 1: 0-based index of the location of the HTMLSpanElement in the document
     */
    type CitationsPrePost = [string, number][];

    /**
     * Describes the citations the occur before [0] and after [1] the current
     * citation being processed
     */
    type CitationLocations = [CitationsPrePost, CitationsPrePost];

    /**
     * 0: A string containing a unique ID which should be used for the span
     *    element's ID.
     * 1: The index of the HTMLSpanElement within the document
     * 2: An HTML string of the inline citation.
     */
    type RebuildProcessorStateData = [string, number, string];

    type CitationKind = 'in-text' | 'note';

    interface Bibmeta {
        /** NOT USED - Closing div tag for bibliography. */
        bibend: string;
        /** array of strings? for errors. */
        bibliography_errors: string[];
        /** NOT USED - Opening div tag for bibliography. */
        bibstart: string;
        /** (not sure what for) */
        done: boolean;
        /** array of itemIDs */
        entry_ids: Array<[string]>;
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
        'second-field-align': 'flush' | 'margin' | boolean;
    }

    interface Citation {
        /** ID of the HTMLSpanElement of the single citation element */
        citationID?: string;
        /** Describes all citations that exist within the singe citation element */
        citationItems: Array<{
            /** ID of the individual CSL item */
            id: string;
            item?: CSL.Data;
        }>;
        properties: {
            index?: number;
            /** 0-based index of the citation group in the document */
            noteIndex: number;
        };
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
        retrieveItem(id: string | number): CSL.Data;
    }

    interface Processor {
        registry: {
            citationreg: CitationRegistry;
        };
        sys: SystemObj;
        opt: {
            xclass: CitationKind;
        };
        updateItems: any; // FIXME:
        makeBibliography(): Bibliography | boolean;
        processCitationCluster(
            citation: Citeproc.Citation,
            pre: Citeproc.CitationsPrePost,
            post: Citeproc.CitationsPrePost,
        ): [{ bibchange: boolean; citation_errors: string[] }, CitationCluster[]];
        rebuildProcessorState(citationByIndex: Citation[]): RebuildProcessorStateData[];
    }

    interface EngineConstructor {
        Engine: {
            new (sys: SystemObj, style?: string): Processor;
        };
    }
}
