import { computed, observable } from 'mobx';

import domReady from 'utils/dom-ready';

export default class Store implements ABT.CitationStyle {
    @observable kind!: 'predefined' | 'custom';
    @observable value!: string;
    @observable label!: string;
    constructor(style: ABT.CitationStyle) {
        this.style = style;
    }

    @computed
    get style(): ABT.CitationStyle {
        return {
            kind: this.kind,
            value: this.value,
            label: this.label,
        };
    }
    set style({ kind, value, label }: ABT.CitationStyle) {
        this.kind = kind;
        this.value = value;
        this.label = label;
    }

    async rehydrate(): Promise<void> {
        await domReady();
        this.style = top.ABT.options.citation_style;
    }
}
