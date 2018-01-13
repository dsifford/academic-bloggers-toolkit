import { computed, observable } from 'mobx';

import domReady from 'utils/dom-ready';

export default class Store implements ABT.DisplayOptions {
    @observable bib_heading_level: ABT.HeadingLevel = 'h3';
    @observable bib_heading: string = '';
    @observable bibliography: 'fixed' | 'toggle' = 'fixed';
    @observable links: ABT.LinkStyle = 'always';

    constructor(options: Partial<ABT.DisplayOptions>) {
        this.options = {
            ...this.options,
            ...options,
        };
    }

    @computed
    get options(): ABT.DisplayOptions {
        return {
            bibliography: this.bibliography,
            bib_heading: this.bib_heading,
            bib_heading_level: this.bib_heading_level,
            links: this.links,
        };
    }
    set options({
        bib_heading_level,
        bib_heading,
        bibliography,
        links,
    }: ABT.DisplayOptions) {
        this.bibliography = bibliography;
        this.bib_heading = bib_heading;
        this.bib_heading_level = bib_heading_level;
        this.links = links;
    }

    async rehydrate(): Promise<void> {
        await domReady();
        this.options = {
            ...top.ABT.options.display_options,
        };
    }
}
