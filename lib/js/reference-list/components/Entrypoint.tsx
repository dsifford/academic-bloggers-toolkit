import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { observable, action } from 'mobx';
import { ReferenceList } from './ReferenceList';

class Store {

    bibOptions: {
        heading: string;
        style: 'fixed' | 'toggle';
    };

    @observable
    bibliography: {
        id: string;
        html: string;
    }[];

    @observable
    cache: {
        style: string;
        links: 'always'|'urls'|'never';
        locale: string;
        bibmeta: Citeproc.Bibmeta;
        uncited: [string, CSL.Data][];
    } = {
        style: 'american-medical-association',
        links: 'always',
        locale: '',
        bibmeta: null,
        uncited: [],
    };

    @observable
    citations: Citeproc.CitationRegistry;

    @observable
    isFixed: boolean = false;

    @observable
    menuOpen: boolean = false;

    @observable
    isLoading: boolean = true;

    @observable
    processorState: {
        [itemID: string]: CSL.Data;
    } = {};

    @action
    init(savedState): void {
        const { bibliography, cache, processorState, citations, bibOptions } = savedState;

        this.bibOptions = bibOptions;
        this.bibliography = bibliography;
        this.processorState = processorState;
        this.citations = citations;
        this.cache = Object.assign({}, this.cache, cache);

    }

}

const store: Store = new Store();

declare const ABT_Reflist_State;
console.log(ABT_Reflist_State);

ReactDOM.render(
    <ReferenceList store={store} />,
    document.getElementById('abt-reflist')
);
