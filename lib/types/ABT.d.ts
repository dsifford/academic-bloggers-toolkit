declare namespace ABT {
    type Bibliography = Array<{ id: string; html: string }>;

    type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

    type StyleKind = 'custom' | 'predefined';

    type LinkStyle = 'always' | 'always-full-surround' | 'urls' | 'never';

    type ContributorType =
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

    type Contributor = CSL.Person & { type: CSL.PersonFieldKey };

    interface ContributorField {
        label: string;
        type: ContributorType;
    }

    interface Field extends React.HTMLProps<HTMLInputElement> {
        value: string;
        label: string;
    }

    type FieldMappings = {
        [k in CSL.ItemType]: {
            title: string;
            fields: Field[];
            people: ContributorField[];
        }
    };

    interface CitationStyle {
        kind: StyleKind;
        label: string;
        value: string;
    }

    interface EditorState {
        displayOptions: DisplayOptions;
        cache: {
            style: CitationStyle;
            locale: string;
        };
        citationByIndex: Citeproc.CitationByIndex;
        CSL: {
            [id: string]: CSL.Data;
        };
    }

    interface DisplayOptions {
        bib_heading: string;
        bib_heading_level: HeadingLevel;
        bibliography: 'fixed' | 'toggle';
        links: LinkStyle;
    }

    interface Options {
        citation_style: CitationStyle;
        custom_css: string;
        display_options: DisplayOptions;
        VERSION: string;
    }

    interface Globals {
        css_editor_settings: object | boolean;
        i18n: ABT.i18n;
        options: Options;
        state: ABT.EditorState;
        styles: {
            renamed: {
                [oldStyleId: string]: string;
            };
            styles: CitationStyle[];
        };
        wp: WP_info;
    }

    interface i18n {
        citation_types: Array<{
            label: string;
            value: string;
        }>;
        errors: {
            missing_php_features: 'Your WordPress PHP installation is incomplete. You must have the following PHP extensions enabled to use this feature: "dom", "libxml"';
            bad_request: 'Request not valid';
            denied: 'Site denied request';
            file_extension_error: 'Invalid file extension. Extension must be .ris, .bib, or .bibtex';
            filetype_error: 'The selected file could not be processed';
            identifiers_not_found: {
                all: 'No identifiers could be found for your request';
                some: 'The following identifiers could not be found';
            };
            network_error: 'Network Error';
            no_results: 'Your search returned 0 results';
            prefix: 'Error';
            ris_leftovers: 'The following references were unable to be processed';
            status_error: 'Request returned a non-200 status code';
            warnings: {
                warning: 'Warning';
                reason: 'Reason';
                no_bib: 'No bibliography format exists for your citation type';
            };
            unexpected: {
                message: 'An unexpected error occurred';
                report_instructions: 'Please report this error, including the steps taken to trigger it, here: \nhttps://github.com/dsifford/academic-bloggers-toolkit/issues'; // tslint:disable-line
            };
            tinymce_unavailable: "TinyMCE editor doesn't appear to be available in this scope";
            invalid_predefined_style: 'Invalid predefined style type';
        };
        fieldmaps: FieldMappings;
        misc: {
            footnotes: 'Footnotes';
            source: 'Source';
        };
        reference_list: {
            menu: {
                style_labels: {
                    custom: 'Custom Style';
                    predefined: 'Pre-defined Styles';
                };
                toggle_label: 'Toggle menu';
                tooltips: {
                    destroy: 'Delete all references';
                    help: 'Usage instructions';
                    import: 'Import references';
                    refresh: 'Refresh reference list';
                    static_publist: 'Insert static publication list';
                };
            };
            cited_items: 'Cited Items';
            tooltips: {
                add: 'Add reference';
                insert: 'Insert selected references';
                pin: 'Pin reference list';
                remove: 'Remove selected references';
            };
            uncited_items: 'Uncited Items';
        };
        dialogs: {
            close_label: 'Close dialog';
            edit: {
                title: 'Edit Reference';
                confirm: 'Confirm';
            };
            import: {
                import_button: 'Import';
                title: 'Import References';
                upload: 'Choose File';
            };
            pubmed: {
                add_reference: 'Select';
                next: 'Next';
                previous: 'Previous';
                search: 'Search';
                title: 'Search PubMed';
                view_reference: 'View';
            };
            add: {
                button_row: {
                    add_manually: 'Add Manually';
                    add_reference: 'Add Reference';
                    add_with_identifier: 'Add with Identifier';
                    insert_inline: 'Insert citation inline';
                    search_pubmed: 'Search PubMed';
                };
                identifier_input: {
                    label: 'DOI/PMID/PMCID';
                };
                manual_input: {
                    autocite: 'Autocite';
                    citation_type: 'Citation Type';
                    ISBN: 'ISBN';
                    search: 'Search';
                    URL: 'URL';
                };
                contributor_list: {
                    add: 'Add contributor';
                    contributors: 'Contributors';
                };
                contributor: {
                    given: 'Given Name, M.I.';
                    surname: 'Surname';
                    literal: 'Literal Name';
                    remove: 'Remove contributor';
                    toggle_literal: 'Toggle literal name';
                };
                title: 'Add References';
            };
        };
        options_page: {
            citation_style_type: 'Citation Style Type';
            predefined: 'Predefined';
            custom: 'Custom';
            heading: 'Heading';
            heading_level: 'Heading Level';
            fixed: 'Fixed';
            toggle: 'Toggle';
            bibliography_style: 'Bibliography Style';
            link_format: {
                title: 'Link Format';
                always: 'Make URLs clickable and always add trailing source link.';
                always_full_surround: 'Make entire reference a clickable link to the source URL.';
                urls: 'Make URLs clickable only.';
                never: 'Never add clickable links.';
            };
        };
    }
}
