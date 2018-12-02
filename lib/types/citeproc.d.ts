declare module 'citeproc' {
    // const CSL: Citeproc.EngineConstructor;
    // export = CSL;
    /**
     * 0: `Bibmeta`
     *
     * 1: Array of raw formatted reference HTML.
     */
    type Bibliography = [Bibmeta, string[]];

    /**
     * Tuple describing the "where", "what", and "id" details for a given citation after being
     * processed.
     *
     * 0: The index of the citation's `HTMLElement` within the document
     *
     * 1: An HTML string to be used for the inline citation
     *
     * 2: A string containing a unique ID which should be used for the citations `HTMLElement` ID
     */
    type CitationResult = [number, string, string];

    /**
     * Enum describing either the citations occuring before or after a given citation in the
     * document.
     *
     * 0: ID of the `HTMLElement` containing the inline citation(s)
     *
     * 1: 0-based index of the location of the `HTMLElement` in the document
     */
    type Locator = Array<[string, number]>;

    interface CitationResultMeta {
        /**
         * Did the result of the operation result in a change in the structure of the bibliography?
         * @ignore This is highly inaccurate and buggy. Do not use.
         */
        bibchange: boolean;
        /**
         * Array of error messages that occurred during the operation, if they occurred.
         */
        citation_errors: string[];
    }

    /**
     * 0: A string containing a unique ID which should be used for the span element's ID.
     *
     * 1: The citation's "noteIndex" (relevant only if it's a "full-note" or "footnote" style citation)
     *
     * 2: An HTML string of the inline citation.
     */
    type RebuildProcessorStateData = [string, number, string];

    /**
     * Where...
     *
     * `in-text` = regular inline citation type.
     *
     * `note` = footnote type.
     */
    type CitationKind = 'in-text' | 'note';

    interface Bibmeta {
        /**
         * An HTML string to be appended to the end of the finished bibliography string.
         * @ignore (unused by ABT)
         */
        bibend: string;
        /**
         * An HTML string to be appended to the front of the finished bibliography string.
         * @ignore (unused by ABT)
         */
        bibstart: string;
        /**
         * Array of error messages, or an empty array if no errors occurred.
         */
        bibliography_errors: string[];
        /**
         * Array of Array of CSL Citation IDs. As far as I know, the inner array should only ever
         * contain one string, which would equal the single ID for that individual citation entry.
         */
        entry_ids: string[][];
        /**
         * An integer representing the spacing between entries in the bibliography.
         */
        entryspacing: number;
        /**
         * Should the bibliography have hanging indents?
         * NOTE: There is currently a bug in Citeproc-js where this value is actually a number.
         * This should not create an issue though.
         */
        hangingindent?: boolean;
        /**
         * An integer representing the spacing between the lines within each bibliography entry.
         * i.e. padding above and below each line
         */
        linespacing: number;
        /**
         * The maximum number of characters that appear in any label used in the bibliography. The
         * client that controls the final rendering of the bibliography string should use this
         * value to calculate and apply a suitable indentation length.
         */
        maxoffset: number;
        /**
         * @see http://docs.citationstyles.org/en/stable/specification.html#bibliography-specific-options
         * @see https://github.com/citation-style-language/styles/issues/804#issuecomment-31467854
         */
        'second-field-align': 'flush' | 'margin' | boolean;
    }

    interface Citation {
        /** ID of the HTMLSpanElement of the single citation element */
        citationID: string;
        /** Describes all citations that exist within the singe citation element */
        citationItems: Array<{
            /** ID of the individual CSL item */
            id: string;
            item?: CSL.Data;
        }>;
        properties?: {
            /** 0-based index of the citation group in the document */
            noteIndex?: number;
            index?: number;
        };
    }

    interface CitationRegistry {
        /**
         * Retrieve citation(s) by a HTMLSpanElement ID
         */
        citationById: Record<string, Citation>;
        /**
         * Array of `Citation` ordered ascending by use in the document
         */
        citationByIndex: Citation[];
        /**
         * Retrieve citation by the unique citation ID
         */
        citationsByItemId: Record<string, Citation[]>;
    }

    interface Registry {
        debug: boolean;
        citationreg: CitationRegistry;
        refhash: Record<string, CSL.Data>;
        getSortedIds(): string[];
    }

    interface Sys {
        retrieveLocale(lang: string): string;
        retrieveItem(id: string | number): CSL.Data;
    }

    interface Processor {}

    export class Engine {
        registry: Registry;
        sys: Sys;
        opt: {
            xclass: CitationKind;
        };
        constructor(
            sys: Sys,
            style: string,
            lang?: string,
            forceLang?: boolean,
        );
        /**
         * Prunes all citations from the processor not listed in `idList`.
         *
         * @param idList An array of citation IDs to keep
         */
        updateItems(idList: string[]): void;
        /**
         * Prunes all citations (listed as "uncited") from the processor not listed in `idList`.
         *
         * @param idList An array of citation IDs to keep
         */
        updateUncitedItems(idList: string[]): void;
        /**
         * Returns a single bibliography object based on the current state of the processor registry.
         *
         * NOTE: This will return `false` if the current citation style doesn't support bibliographies (e.g. "Mercatus Center").
         */
        makeBibliography(): Bibliography | boolean;
        /**
         * Adds a citation to the registry and regenerates the document's citations.
         * @param citation The new citation to be added
         * @param citationsPre Citations occurring before the citation in the document
         * @param citationsPost Citations occurring after the citation in the document
         */
        processCitationCluster(
            citation: Citation,
            citationsPre: Locator,
            citationsPost: Locator,
        ): [CitationResultMeta, CitationResult[]];
        /**
         * Rebuilds the state of the processor to match a given `CitationByIndex` object.
         *
         * Returns a list of [citationID,noteIndex,string] tuples in document order.
         * Set citation.properties.noteIndex to 0 for in-text citations.
         * It is not necessary to run updateItems() before this function.
         *
         * @param citationByIndex The new state that should be matched.
         * @param mode Citatation mode. (default: 'html')
         * @param uncitedItemIds An array of uncited item IDs.
         */
        rebuildProcessorState(
            citationByIndex: Citation[],
            mode?: 'html' | 'text' | 'rtf',
            uncitedItemIds?: string[],
        ): RebuildProcessorStateData[];
    }
}
