import { action, computed, observable, toJS } from 'mobx';

import CitationStore from 'core/citation-store';

export default class Store {
    readonly bibOptions: ABT.BibOptions;
    citations: CitationStore;

    /**
     * The selected citation style
     */
    citationStyle = observable('');

    /**
     * The user's locale provided by WordPress.
     */
    readonly locale: string;

    constructor(savedState: ABT.Backend['state']) {
        const { cache, citationByIndex, bibOptions, CSL } = savedState;
        this.citations = new CitationStore(citationByIndex, CSL);
        this.locale = cache.locale;
        this.citationStyle.set(cache.style);
        this.bibOptions = bibOptions;
    }

    @computed
    get persistent(): string {
        return JSON.stringify({
            CSL: toJS(this.citations.CSL),
            cache: this.cache,
            citationByIndex: this.citations.citationByIndex,
        });
    }

    @action
    reset(): void {
        this.citations = new CitationStore([], {});
    }

    @action
    setStyle(style: string): void {
        this.citationStyle.set(style);
    }

    private get cache(): ABT.EditorState['cache'] {
        return {
            locale: this.locale,
            style: this.citationStyle.get(),
        };
    }
}
