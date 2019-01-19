import { computed, observable } from 'mobx';

import { Style } from 'stores/data';
import { StyleKind } from 'stores/data/constants';

export default class Store implements Style {
    @observable kind!: StyleKind;
    @observable value!: string;
    @observable label!: string;
    constructor(style: Style) {
        this.style = style;
    }

    @computed
    get style(): Style {
        return {
            kind: this.kind,
            value: this.value,
            label: this.label,
        };
    }
    set style({ kind, value, label }: Style) {
        this.kind = kind;
        this.value = value;
        this.label = label;
    }
}
