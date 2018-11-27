declare module 'citeproc' {
    const CSL: Citeproc.EngineConstructor;
    export = CSL;
}

// tslint:disable-next-line:no-namespace
declare namespace Citeproc {
    /**
     * 0: `Bibmeta`
     *
     * 1: Array of raw formatted reference HTML.
     */
    type Bibliography = [Bibmeta, string[]];

    /**
     * Array of `Citation` ordered ascending by use in the document.
     */
    type CitationByIndex = Citation[];

    /**
     * Enum describing the "where", "what", and "id" details for a given citation after being
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
     * 1: The index of the HTMLSpanElement within the document.
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
        /** Retrieve citation(s) by a HTMLSpanElement ID */
        citationById: {
            [id: string]: Citation;
        };
        /** Retrieve citation(s) by the index of its parent HTMLSpanElement in the document */
        citationByIndex: CitationByIndex;
        /** Retrieve citation by the unique citation ID */
        citationsByItemId: {
            [itemId: string]: Citation[];
        };
    }

    /** An object whose keys are reference IDs and whose values are CSL.Data */
    interface RefHash {
        [referenceId: string]: CSL.Data;
    }

    interface Registry {
        debug: boolean;
        citationreg: CitationRegistry;
        refhash: RefHash;
        getSortedIds(): string[];
    }

    interface SystemObj {
        retrieveLocale(lang: string): string;
        retrieveItem(id: string | number): CSL.Data;
    }

    interface Processor {
        registry: Registry;
        sys: SystemObj;
        opt: {
            xclass: CitationKind;
        };
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
         * @param citationByIndex The new state that should be matched
         */
        rebuildProcessorState(
            citationByIndex: Citation[],
        ): RebuildProcessorStateData[];
    }

    interface EngineConstructor {
        Engine: {
            new (sys: SystemObj, style?: string): Processor;
        };
    }
}
