interface Window {
  tinyMCE: TinyMCE.MCE;
  DocumentTouch?;
}

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
        citationTypes: ABT.CitationTypes;
        fieldmaps: ABT.FieldMappings;
        referenceList: {
            menu: {
                stylePlaceholder: string;
                tooltips: {
                    destroy: string;
                    importRIS: string;
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
                importBtn: string;
                upload: string;
            };
            pubmedWindow: {
                title: string;
                addReference: string;
                viewReference: string;
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
                    citationType: string;
                };
                people: {
                    add: string;
                    contributors: string;
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
