import {
    asMap,
    computed,
    intercept,
    IObservableArray,
    observable,
    ObservableMap,
    toJS,
    action,
} from 'mobx';
import { localeMapper as locales } from '../utils/Constants';

class CitationStore {

    @observable
    CSL: ObservableMap<CSL.Data>;

    @observable
    private byIndex: IObservableArray<Citeproc.Citation>;

    constructor(byIndex: Citeproc.CitationByIndex, CSL: {[id: string]: CSL.Data}) {
        this.byIndex = observable(byIndex);
        this.CSL = this.cleanCSL(CSL);
        intercept(this.CSL, (change) => {
            if (change.type !== 'add') return change;
            if (this.lookup.titles.indexOf(change.newValue.title) > -1) return null;
            return change;
        });
    }

    @computed
    get uncited(): CSL.Data[] {
        return this.CSL.keys().reduce((prev, curr) => {
            if (this.citedIDs.indexOf(curr) === -1) prev.push(this.CSL.get(curr));
            return prev;
        }, []).slice();
    }

    @computed
    get cited(): CSL.Data[] {
        return this.citedIDs.map(id => this.CSL.get(id)).slice();
    }

    @computed
    get citedIDs(): string[] {
        return this.citationByIndex
        .map(i => i.citationItems.map(j => j.id))
        .reduce((prev, curr) => [...prev, ...curr], [])
        .reduce((p, c) =>
            p.indexOf(c) === -1
            ? [...p, c]
            : p
        , []).slice();
    }

    @action
    init(byIndex: Citeproc.CitationByIndex) {
        this.byIndex.replace(JSON.parse(JSON.stringify(byIndex)));
    }

    @action
    removeItems(idList: string[], doc: HTMLDocument) {
        idList.forEach(id => {
            if (this.citedIDs.indexOf(id) === -1)
                this.CSL.delete(id);
        });
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
        this.init(byIndex);
    }

    @action
    addItems(data: CSL.Data[]) {
        this.CSL.merge(
            data.reduce((prev, curr) => {
                prev[curr.id] = curr;
                return prev;
            }, {} as {[itemId: string]: CSL.Data})
        );
    }

    get lookup(): {ids: string[], titles: string[]} {
        return {
            ids: this.CSL.keys(),
            titles: this.CSL.values().map(v => v.title),
        };
    }

    get citationByIndex(): Citeproc.Citation[] {
        return toJS(this.byIndex);
    }

    private cleanCSL(CSL: {[id: string]: CSL.Data}): ObservableMap<CSL.Data> {
        for (const key of Object.keys(CSL)) {
            CSL[key].language = locales[CSL[key].language] || 'en-US';
        }
        return asMap(CSL);
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
    links: 'always'|'urls'|'never'|'always-full-surround';

    /**
     * The selected citation style
     */
    @observable
    citationStyle: string;

    constructor(savedState: BackendGlobals.ABT_Reflist_State) {
        const { cache, citationByIndex, bibOptions, CSL } = savedState;
        this.citations = new CitationStore(citationByIndex, CSL);
        this.links = cache.links;
        this.locale = cache.locale;
        this.citationStyle = cache.style;
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
    reset() {
        this.citations = new CitationStore([], {});
    }

    @action
    setStyle(style: string) {
        this.citationStyle = style;
    }

    get cache() {
        return {
            links: this.links,
            locale: this.locale,
            style: this.citationStyle,
        };
    }
}
