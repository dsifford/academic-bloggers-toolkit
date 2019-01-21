// Type definitions for citeproc-js
// Project: https://github.com/Juris-M/citeproc-js
// Definitions by: Derek P Sifford <https://github.com/dsifford>

declare module 'citeproc' {
    /**
     * 0: `Bibmeta`
     *
     * 1: Array of raw formatted reference HTML.
     */
    export type Bibliography = [Bibmeta, string[]];

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
    export type CitationResult = [number, string, string];

    /**
     * Enum describing either the citations occuring before or after a given citation in the
     * document.
     *
     * 0: ID of the `HTMLElement` containing the inline citation(s)
     *
     * 1: 0-based index of the location of the `HTMLElement` in the document
     */
    export type Locator = Array<[string, number]>;

    export interface CitationResultMeta {
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
    export type RebuildProcessorStateData = [string, number, string];

    /**
     * Where...
     *
     * `in-text` = regular inline citation type.
     *
     * `note` = footnote type.
     */
    export type CitationKind = 'in-text' | 'note';

    export interface Bibmeta {
        /**
         * An HTML string to be appended to the end of the finished bibliography string.
         * @ignore (unused by ABT)
         */
        bibend: string;
        /**
         * Array of error messages, or an empty array if no errors occurred.
         */
        bibliography_errors: string[];
        /**
         * An HTML string to be appended to the front of the finished bibliography string.
         * @ignore (unused by ABT)
         */
        bibstart: string;
        /**
         * Array of Array of CSL Citation IDs. As far as I know, the inner array should only ever
         * contain one string, which would equal the single ID for that individual citation entry.
         */
        entry_ids: Array<[string]>;
        /**
         * An integer representing the spacing between entries in the bibliography.
         */
        entryspacing: number;
        /**
         * The number of em-spaces to apply in hanging indents within the bibliography.
         */
        hangingindent?: number;
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
        'second-field-align': 'flush' | 'margin' | false;
    }

    // I have literally no idea what any of this is for...
    interface SortedItemMeta {
        'first-reference-note-number': number;
        id: string;
        item: CSL.Data;
        'near-note': boolean;
        position: number;
        section_form_override: string;
        sortkeys: string[];
    }

    export interface Citation {
        /** ID of the HTMLSpanElement of the single citation element */
        citationID: string;
        /** Describes all citations that exist within the singe citation element */
        citationItems: Array<{
            /** ID of the individual CSL item */
            id: string;
            item?: CSL.Data;
        }>;
        properties: {
            /**
             * 0-based index of the citation group in the document
             */
            index: number;
            /**
             * Indicates the footnote number in which the citation is located
             * within the document. Citations within the main text of the
             * document have a noteIndex of 0.
             */
            noteIndex?: number;
        };
    }

    interface StatefulCitation extends Citation {
        sortedItems: Array<[CSL.Data, SortedItemMeta]>;
    }

    interface CitationRegistry {
        /**
         * Retrieve citation(s) by a HTMLSpanElement ID
         */
        citationById: Record<string, StatefulCitation>;
        /**
         * Array of `Citation` ordered ascending by use in the document
         */
        citationByIndex: StatefulCitation[];
        /**
         * Retrieve citation by the unique citation ID
         */
        citationsByItemId: Record<string, StatefulCitation[]>;
    }

    interface Registry {
        debug: boolean;
        citationreg: CitationRegistry;
        refhash: Record<string, CSL.Data>;
        getSortedIds(): string[];
    }

    export interface Sys {
        retrieveLocale(lang: string): string;
        retrieveItem(id: string | number): CSL.Data;
    }

    export class Engine {
        registry: Registry;
        sys: Sys;
        opt: {
            development_extensions: {
                /**
                 * @defaultValue true
                 */
                allow_field_hack_date_override: boolean;
                /**
                 * @defaultValue false
                 */
                allow_force_lowercase: boolean;
                /**
                 * @defaultValue false
                 */
                apply_citation_wrapper: boolean;
                /**
                 * @defaultValue true
                 */
                clean_up_csl_flaws: boolean;
                /**
                 * @defaultValue false
                 */
                clobber_locator_if_no_statute_section: boolean;
                /**
                 * @defaultValue false
                 */
                csl_reverse_lookup_support: boolean;
                /**
                 * @defaultValue false
                 */
                expect_and_symbol_form: boolean;
                /**
                 * @defaultValue true
                 */
                field_hack: boolean;
                /**
                 * @defaultValue true
                 */
                flip_parentheses_to_braces: boolean;
                /**
                 * @defaultValue false
                 */
                force_jurisdiction: boolean;
                /**
                 * @defaultValue false
                 */
                handle_parallel_articles: boolean;
                /**
                 * @defaultValue true
                 */
                jurisdiction_subfield: boolean;
                /**
                 * @defaultValue true
                 */
                locator_date_and_revision: boolean;
                /**
                 * @defaultValue true
                 */
                locator_label_parse: boolean;
                /**
                 * @defaultValue true
                 */
                locator_parsing_for_plurals: boolean;
                /**
                 * @defaultValue false
                 */
                main_title_from_short_title: boolean;
                /**
                 * @defaultValue false
                 */
                normalize_lang_keys_to_lowercase: boolean;
                /**
                 * @defaultValue true
                 */
                parse_names: boolean;
                /**
                 * @defaultValue true
                 */
                raw_date_parsing: boolean;
                /**
                 * @defaultValue false
                 */
                require_explicit_legal_case_title_short: boolean;
                /**
                 * @defaultValue false
                 */
                rtl_support: boolean;
                /**
                 * @defaultValue false
                 */
                spoof_institutional_affiliations: boolean;
                /**
                 * @defaultValue false
                 */
                static_statute_locator: boolean;
                /**
                 * @defaultValue false
                 */
                strict_text_case_locales: boolean;
                /**
                 * @defaultValue false
                 */
                thin_non_breaking_space_html_hack: boolean;
                /**
                 * @defaultValue false
                 */
                uppercase_subtitles: boolean;
                /**
                 * @defaultValue false
                 */
                wrap_url_and_doi: boolean;
            };
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
        makeBibliography(): Bibliography | false;
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
