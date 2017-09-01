interface StyleObj {
    id: string;
    label: string;
    value: string;
}

interface CitationStyles {
    renamed: {
        [oldStyleId: string]: string;
    };
    styles: StyleObj[];
}

interface IRollbar {
    log(msg: string, e?: any): void;
    debug(msg: string, e?: any): void;
    info(msg: string, e?: any): void;
    warning(msg: string, e?: any): void;
    error(msg: string, e?: any): void;
    critical(msg: string, e?: any): void;
}

declare const ABT_CitationStyles: CitationStyles;
declare const ABT_Custom_CSL: BackendGlobals.ABT_Custom_CSL;
declare const DocumentTouch: any;

interface Window {
    ABT_CitationStyles: CitationStyles;
    ABT_Custom_CSL: BackendGlobals.ABT_Custom_CSL;
    ABT_Reflist_State: BackendGlobals.ABT_Reflist_State;
    ABT_i18n: BackendGlobals.ABT_i18n;
    ABT_wp: BackendGlobals.ABT_wp;
    DocumentTouch?: any;
    Rollbar: IRollbar;
    ajaxurl: string;
    tinyMCE: TinyMCE.MCE;
}

declare const Rollbar: IRollbar;

declare namespace BackendGlobals {
    interface ABT_i18n {
        citationTypes: ABT.CitationTypes;
        errors: {
            badRequest: 'Request not valid';
            broken: 'BROKEN!';
            denied: 'Site denied request';
            fileExtensionError: 'Invalid file extension. Extension must be .ris, .bib, or .bibtex';
            filetypeError: 'The file could not be processed';
            identifiersNotFound: {
                all: 'No identifiers could be found for your request';
                some: 'The following identifiers could not be found';
            };
            networkError: 'Network Error';
            noResults: 'Your search returned 0 results';
            prefix: 'Error';
            risLeftovers: 'The following references were unable to be processed';
            statusError: 'Request returned a non-200 status code';
            warnings: {
                warning: 'Warning';
                reason: 'Reason';
                noBib: {
                    message: 'Cannot create publication list for currently selected citation style';
                    reason: 'Style does not include bibliography';
                };
            };
            unexpected: {
                message: 'An unexpected error occurred';
                reportInstructions: 'Please report this error, including the steps taken to trigger it, here: \nhttps://github.com/dsifford/academic-bloggers-toolkit/issues'; // tslint:disable-line
            };
        };
        fieldmaps: ABT.FieldMappings;
        misc: {
            footnotes: 'Footnotes';
        };
        referenceList: {
            menu: {
                styleLabels: {
                    custom: 'Custom Style';
                    predefined: 'Pre-defined Styles';
                };
                toggleLabel: 'Toggle menu';
                tooltips: {
                    destroy: 'Delete all references';
                    help: 'Usage instructions';
                    importRIS: 'Import references';
                    refresh: 'Refresh reference list';
                    staticPubList: 'Insert static publication list';
                };
            };
            citedItems: 'Cited Items';
            tooltips: {
                add: 'Add reference';
                insert: 'Insert selected references';
                pin: 'Pin reference list';
                remove: 'Remove selected references';
            };
            uncitedItems: 'Uncited Items';
        };
        dialogs: {
            closeLabel: 'Close dialog';
            edit: {
                title: 'Edit Reference';
                confirm: 'Confirm';
            };
            import: {
                importBtn: 'Import';
                title: 'Import References';
                upload: 'Choose File';
            };
            pubmed: {
                addReference: 'Select';
                next: 'Next';
                previous: 'Previous';
                search: 'Search';
                title: 'Search PubMed';
                viewReference: 'View';
            };
            add: {
                buttonRow: {
                    addManually: 'Add Manually';
                    addReference: 'Add Reference';
                    addWithIdentifier: 'Add with Identifier';
                    insertInline: 'Insert citation inline';
                    searchPubmed: 'Search PubMed';
                };
                identifierInput: {
                    label: 'DOI/PMID/PMCID';
                };
                manualEntryContainer: {
                    autocite: 'Autocite';
                    citationType: 'Citation Type';
                    ISBN: 'ISBN';
                    search: 'Search';
                    URL: 'URL';
                };
                people: {
                    add: 'Add Contributor';
                    contributors: 'Contributors';
                    given: 'Given Name, M.I.';
                    surname: 'Surname';
                };
                title: 'Add References';
            };
        };
    }

    interface ABT_Reflist_State {
        bibOptions: {
            heading: string;
            headingLevel: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
            style: 'fixed' | 'toggle';
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
        info: {
            site: {
                language: string;
                name: string;
                plugins: string[];
                theme: string;
                url: string;
            };
            versions: {
                abt: string;
                php: string;
                wordpress: string;
            };
        };
    }

    interface ABT_Custom_CSL {
        CSL?: string;
        label: string;
        value?: string;
    }
}

// ==============

declare module 'bibtex-parse-js';
declare module 'common-tags';
declare module 'focus-trap-react';
declare module 'gulp-uglify/composer';
declare module 'gulp-wp-pot';
declare module 'react-select-fast-filter-options';
declare module 'react-virtualized-select';
declare module 'rollbar-sourcemap-webpack-plugin';
declare module 'rollbar/dist/rollbar.umd';
declare module 'uglify-es';
