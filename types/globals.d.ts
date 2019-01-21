type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
type Maybe<T> = T | undefined;

interface Window {
    ABT: ABT.Globals;
    ajaxurl: string;
}

declare namespace ABT {
    type Bibliography = Array<{ id: string; html: string }>;

    type Contributor = CSL.Person & { type: CSL.PersonFieldKey };

    interface EditorState {
        displayOptions: DisplayOptions;
        cache: {
            style: import('stores/data').Style;
            locale: string;
        };
        citationByIndex: Array<import('citeproc').Citation>;
        CSL: Record<string, CSL.Data>;
    }

    interface DisplayOptions {
        bib_heading: string;
        bib_heading_level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
        bibliography: 'fixed' | 'toggle';
        links: 'always' | 'always-full-surround' | 'urls' | 'never';
    }

    // TODO: This has got to go
    interface Globals {
        i18n: any;
        options: {
            citation_style: import('stores/data').Style;
            display_options: DisplayOptions;
        };
        state: ABT.EditorState;
        styles: import('stores/data').StyleJSON;
        wp: {
            abt_url: string;
        };
    }
}
