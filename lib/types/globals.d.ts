/* tslint:disable: class-name */

declare const __DEV__: boolean;
declare const ABT_CitationStyles: Array<{ label: string; value: string }>;
declare const DocumentTouch: any;

interface Window {
    ABT_i18n: BackendGlobals.ABT_i18n;
    ajaxurl: string;
    tinyMCE: TinyMCE.MCE;
    DocumentTouch?: any;
}

declare const Rollbar: {
    log(msg: string, e?: any): void;
    debug(msg: string, e?: any): void;
    info(msg: string, e?: any): void;
    warning(msg: string, e?: any): void;
    error(msg: string, e?: any): void;
    critical(msg: string, e?: any): void;
};

declare namespace BackendGlobals {
    // tslint:disable-next-line
    interface ABT_i18n {
        citationTypes: ABT.CitationTypes;
        errors: {
            badRequest: 'Request not valid';
            broken: 'BROKEN!';
            denied: 'Site denied request';
            fileExtensionError: 'Invalid file extension. Extension must be .ris, .bib, or .bibtex';
            filetypeError: 'The file could not be processed.';
            identifiersNotFound: {
                all: 'The following identifiers could not be found';
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
                tooltips: {
                    destroy: 'Delete all references';
                    help: 'Usage instructions';
                    importRIS: 'Import references from file';
                    refresh: 'Refresh reference list';
                    staticPubList: 'Insert Static Publication List';
                };
            };
            referenceList: {
                citedItems: 'Cited Items';
                tooltips: {
                    add: 'Add reference to reference list';
                    insert: 'Insert selected references';
                    pin: 'Pin reference list to visible window';
                    remove: 'Remove selected references from reference list';
                };
                uncitedItems: 'Uncited Items';
            };
        };
        tinymce: {
            editReferenceWindow: {
                title: 'Edit Reference';
                confirm: 'Confirm';
            };
            importWindow: {
                importBtn: 'Import';
                title: 'Import References from File';
                upload: 'Choose File';
            };
            pubmedWindow: {
                addReference: 'Select';
                next: 'Next';
                previous: 'Previous';
                search: 'Search';
                title: 'Search PubMed for Reference';
                viewReference: 'View';
            };
            referenceWindow: {
                buttonRow: {
                    addManually: 'Add Manually';
                    addReference: 'Add Reference';
                    addWithIdentifier: 'Add with Identifier';
                    insertInline: 'Insert citation inline';
                    pubmedWindowTitle: 'Search PubMed for Reference';
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
                referenceWindow: {
                    title: 'Add Reference';
                };
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
    }

    interface ABT_Custom_CSL {
        CSL?: string;
        label: string;
        value?: string;
    }
}

declare module 'autoprefixer-stylus';
declare module 'bibtex-parse-js';
declare module 'gulp-stylus';
declare module 'gulp-uglify/composer';
declare module 'gulp-wp-pot';
declare module 'merge-stream';
declare module 'react-virtualized-select';
declare module 'uglify-es';
