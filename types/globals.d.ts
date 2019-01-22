type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
type Maybe<T> = T | undefined;

interface Window {
    ABT: {
        i18n: any;
    };
    ajaxurl: string;
}

declare namespace ABT {
    type Bibliography = Array<{ id: string; html: string }>;

    type Contributor = CSL.Person & { type: CSL.PersonFieldKey };

    interface LegacyEditorState {
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
}
