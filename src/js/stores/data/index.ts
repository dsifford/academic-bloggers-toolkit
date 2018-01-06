import { action, computed, toJS } from 'mobx';

import CitationStore from './citation-store';
import StyleStore from './style-store';

export default class Store {
    readonly bibOptions: ABT.BibOptions;
    /**
     * The user's locale provided by WordPress.
     */
    readonly locale: string;
    citations: CitationStore;
    citationStyle: StyleStore;

    constructor(savedState: ABT.Globals['state']) {
        const {
            cache: { style, locale },
            citationByIndex,
            bibOptions,
            CSL,
        } = savedState;
        this.citations = new CitationStore(citationByIndex, CSL);
        this.citationStyle = new StyleStore(style);
        this.bibOptions = bibOptions;
        this.locale = locale;
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

    private get cache(): ABT.EditorState['cache'] {
        return {
            locale: this.locale,
            style: this.citationStyle,
        };
    }
}
