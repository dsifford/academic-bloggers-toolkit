import { observable, ObservableMap, asMap, toJS, IObservableArray, computed, intercept } from 'mobx';

interface SavedState {
    cache: {
        style: string;
        links: 'always'|'urls'|'never';
        locale: string;
    };
    citationByIndex: Citeproc.CitationByIndex;
    CSL: {
        [id: string]: CSL.Data;
    };
    bibOptions: {
        heading: string;
        style: 'fixed'|'toggle';
    };
}

class CitationStore {

    @observable
    CSL: ObservableMap<CSL.Data>;

    @observable
    private byIndex: IObservableArray<Citeproc.Citation>;

    get lookup(): {ids: string[], titles: string[]} {
        return {
            ids: this.CSL.keys(),
            titles: this.CSL.values().map(v => v.title),
        };
    }

    get citationByIndex(): Citeproc.Citation[] {
        return this.byIndex.slice().map(i => toJS(i));
    }

    constructor(byIndex: Citeproc.CitationByIndex, CSL: {[id: string]: CSL.Data}) {
        this.byIndex = observable(byIndex);
        this.CSL = asMap(CSL);
        intercept(this.CSL, (change) => {
            if (change.type !== 'add') return change;
            if (this.lookup.titles.indexOf(change.newValue.title) > -1) return null;
            return change;
        });
    }

    init(byIndex: Citeproc.CitationByIndex) {
        this.byIndex.replace(byIndex);
    }

    removeItems(idList: string[], doc: HTMLDocument) {
        const byIndex = this.citationByIndex
        .map(i =>
            Object.assign({}, i, {
                citationItems: i.citationItems.filter(j => idList.indexOf(j.id) === -1),
                sortedItems: i.sortedItems.filter(j => idList.indexOf(j[1].id) === -1),
            })
        )
        .reduce((prev, curr) => {
            if (curr.citationItems.length === 0) {
                const el = doc.getElementById(curr.citationID);
                el.parentNode.removeChild(el);
                return prev;
            }
            return [...prev, curr];
        }, []);
        this.byIndex.replace(byIndex);
        idList.forEach(id => this.CSL.delete(id));
    }
}

export class Store {

    bibOptions = {
        heading: '',
        style: <'fixed'|'toggle'> 'fixed',
    };

    @observable
    citations: CitationStore;

    /**
     * The user's locale provided by WordPress.
     */
    locale: string;

    /**
     * The user's selected link format.
     */
    links: 'always'|'urls'|'never';

    /**
     * The selected citation style
     */
    @observable
    citationStyle: string;

    @computed
    get uncited(): CSL.Data[] {
        return this.citations.CSL.keys().reduce((prev, curr) => {
            if (this.citedIDs.indexOf(curr) === -1) prev.push(this.citations.CSL.get(curr));
            return prev;
        }, []).slice();
    }

    @computed
    get cited(): CSL.Data[] {
        return this.citedIDs.map(id => this.citations.CSL.get(id)).slice();
    }

    @computed
    get citedIDs(): string[] {
        return this.citations.citationByIndex
        .map(i => i.citationItems.map(j => j.id))
        .reduce((prev, curr) => [...prev, ...curr], [])
        .reduce((p, c) =>
            p.indexOf(c) === -1
            ? [...p, c]
            : p
        , []).slice();
    }

    @computed
    get persistent(): string {
        return JSON.stringify({
            CSL: toJS(this.citations.CSL),
            cache: this.cache,
            citationByIndex: this.citations.citationByIndex,
        });
    }

    get cache() {
        return {
            links: this.links,
            locale: this.locale,
            style: this.citationStyle,
        };
    }

    constructor(savedState: SavedState) {
        const { cache, citationByIndex, bibOptions, CSL } = savedState;
        this.citations = new CitationStore(citationByIndex, CSL);
        this.links = cache.links;
        this.locale = cache.locale;
        this.citationStyle = cache.style;
        this.bibOptions = bibOptions;
    }

    reset() {
        this.citations = new CitationStore([], {});
    }
}
