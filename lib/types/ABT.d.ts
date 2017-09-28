declare namespace ABT {
    type Bibliography = Array<{ id: string; html: string }>;

    type CitationTypes = Array<{
        label: string;
        value: string;
    }>;

    type LinkStyle = 'always' | 'always-full-surround' | 'urls' | 'never';

    interface BibOptions {
        /** Heading options */
        heading: string;
        /** HTML Heading element preferred for heading */
        headingLevel: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
        /** Should the heading be toggleable? */
        style: 'fixed' | 'toggle';
    }

    interface ExternalSiteMeta {
        authors: Array<{
            firstname: string;
            lastname: string;
        }>;
        article: {
            /* Facebook URL - not name */
            author?: string;
            /* ISO Date String */
            modified_time?: string;
            /* ISO Date String */
            published_time?: string;
            /* Facebook URL */
            publisher?: string;
            /* Category or section of source */
            section?: string;
            /* CSV list of tags */
            tag?: string;
        };
        /* Published Date ISO string */
        issued?: string;
        og: {
            /* Article description */
            description?: string;
            /* Height of main image in px */
            image_height?: string;
            /* Width of main image in px */
            image_width?: string;
            /* urlencoded image url */
            image?: string;
            /* Site locale */
            locale?: string;
            /* ISO Date String */
            pubdate?: string;
            /* Clean URL form of site (e.g. `social.techcrunch.com`) */
            site?: string;
            /* Title of website */
            site_name?: string;
            /* Title of Article */
            title?: string;
            /* Type of posting (generally article) */
            type?: string; // tslint:disable-line
            /* ISO Date String */
            updated_time?: string;
            /* URL of page */
            url?: string;
        };
        sailthru: {
            /* _usually_ is `firstname lastname` */
            author?: string;
            /* ISO Date String (issued) */
            date?: string;
            /* Article description */
            description?: string;
            /* Full-size image URL */
            image_full?: string;
            /* Thumbnail image URL */
            image_thumb?: string;
            /* CSV list of tags */
            tags?: string;
            /* Title of Article */
            title?: string;
        };
        /* Title of Article - last resort */
        title?: string;
        /* URL of page */
        url?: string;
    }

    type PersonType =
        | 'author'
        | 'container-author'
        | 'editor'
        | 'director'
        | 'interviewer'
        | 'illustrator'
        | 'composer'
        | 'translator'
        | 'recipient';

    interface Field {
        value: string;
        label: string;
        required: boolean;
        pattern: string;
        placeholder: string;
    }

    interface FieldMap {
        title: string;
        fields: Field[];
        people: Array<{
            label: string;
            type:
                | 'author'
                | 'container-author'
                | 'editor'
                | 'director'
                | 'interviewer'
                | 'illustrator'
                | 'composer'
                | 'translator'
                | 'recipient'
                | 'collection-editor';
        }>;
    }

    interface FieldMappings {
        bill: FieldMap;
        book: FieldMap;
        chapter: FieldMap;
        legal_case: FieldMap;
        'paper-conference': FieldMap;
        'entry-encyclopedia': FieldMap;
        motion_picture: FieldMap;
        speech: FieldMap;
        article: FieldMap;
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

    interface TypedPerson extends CSL.Person {
        type: PersonType;
    }

    interface ManualData {
        manualData: CSL.Data;
        people: TypedPerson[];
    }

    interface ReferenceWindowPayload extends ManualData {
        addManually: boolean;
        attachInline: boolean;
        identifierList: string;
    }

    interface i18n {
        citationTypes: CitationTypes;
        errors: {
            missingPhpFeatures: 'Your WordPress PHP installation is incomplete. You must have the following PHP extensions enabled to use this feature: "dom", "libxml"';
            badRequest: 'Request not valid';
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
                noBib: 'No bibliography format exists for your citation type';
            };
            unexpected: {
                message: 'An unexpected error occurred';
                reportInstructions: 'Please report this error, including the steps taken to trigger it, here: \nhttps://github.com/dsifford/academic-bloggers-toolkit/issues'; // tslint:disable-line
            };
        };
        fieldmaps: FieldMappings;
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

    interface EditorState {
        bibOptions: {
            heading: string;
            headingLevel: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
            style: 'fixed' | 'toggle';
        };
        cache: {
            style: string;
            links: LinkStyle;
            locale: string;
        };
        citationByIndex: Citeproc.CitationByIndex;
        CSL: {
            [id: string]: CSL.Data;
        };
    }

    interface CustomCSL {
        CSL?: string;
        label: string;
        value?: string;
    }

    interface Backend {
        state: ABT.EditorState;
        i18n: ABT.i18n;
        styles: CitationStyles;
        wp: WP_info;
        custom_csl: ABT.CustomCSL;
    }
}
