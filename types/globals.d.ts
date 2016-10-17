interface Window {
    ABT_i18n: BackendGlobals.ABT_i18n;
    tinyMCE: TinyMCE.MCE;
    DocumentTouch?;
}

declare const __DEV__: boolean;

declare const ABT_CitationStyles: {label: string, value: string}[];

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
        readonly citationTypes: ABT.CitationTypes;
        readonly errors: {
            readonly badRequest: 'Request not valid';
            readonly broken: 'BROKEN!';
            readonly denied: 'Site denied request';
            readonly filetypeError: 'The file could not be processed. Are you sure it\'s a .RIS (Refman) file?';
            readonly identifiersNotFound: {
                readonly all: 'The following identifiers could not be found';
                readonly some: 'The following identifiers could not be found';
            };
            readonly networkError: 'Network Error';
            readonly noResults: 'Your search returned 0 results';
            readonly prefix: 'Error';
            readonly risLeftovers: 'The following references were unable to be processed';
            readonly statusError: 'Request returned a non-200 status code';
            readonly warnings: {
                readonly warning: 'Warning';
                readonly reason: 'Reason';
                readonly noBib: {
                    readonly message: 'Cannot create publication list for currently selected citation style';
                    readonly reason: 'Style does not include bibliography';
                };
            };
            readonly unexpected: {
                readonly message: 'An unexpected error occurred';
                readonly reportInstructions: 'Please report this error, including the steps taken to trigger it, here: \nhttps://github.com/dsifford/academic-bloggers-toolkit/issues'; // tslint:disable-line
            };
        };
        readonly fieldmaps: ABT.FieldMappings;
        readonly referenceList: {
            readonly menu: {
                tooltips: {
                    readonly destroy: 'Delete all references';
                    readonly help: 'Usage instructions';
                    readonly importRIS: 'Import references from RIS file';
                    readonly refresh: 'Refresh reference list';
                    readonly staticPubList: 'Insert Static Publication List';
                };
            };
            readonly referenceList: {
                readonly citedItems: 'Cited Items';
                readonly tooltips: {
                    readonly add: 'Add reference to reference list';
                    readonly insert: 'Insert selected references';
                    readonly pin: 'Pin reference list to visible window';
                    readonly remove: 'Remove selected references from reference list';
                };
                readonly uncitedItems: 'Uncited Items';
            };
        };
        readonly tinymce: {
            readonly importWindow: {
                readonly importBtn: 'Import';
                readonly title: 'Import References from RIS File';
                readonly upload: 'Choose File';
            };
            readonly pubmedWindow: {
                readonly addReference: 'Select';
                readonly next: 'Next';
                readonly previous: 'Previous';
                readonly search: 'Search';
                readonly title: 'Search PubMed for Reference';
                readonly viewReference: 'View';
            };
            readonly referenceWindow: {
                readonly buttonRow: {
                    readonly addManually: 'Add Manually';
                    readonly addReference: 'Add Reference';
                    readonly addWithIdentifier: 'Add with Identifier';
                    readonly insertInline: 'Insert citation inline';
                    readonly pubmedWindowTitle: 'Search PubMed for Reference';
                    readonly searchPubmed: 'Search PubMed';
                };
                readonly identifierInput: {
                    readonly label: 'PMID/DOI';
                };
                readonly manualEntryContainer: {
                    readonly autocite: 'Autocite';
                    readonly citationType: 'Citation Type';
                    readonly ISBN: 'ISBN';
                    readonly search: 'Search';
                    readonly URL: 'URL';
                };
                readonly people: {
                    readonly add: 'Add Contributor';
                    readonly contributors: 'Contributors';
                    readonly given: 'Given Name, M.I.';
                    readonly surname: 'Surname';
                };
                readonly referenceWindow: {
                    readonly title: 'Add Reference';
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
