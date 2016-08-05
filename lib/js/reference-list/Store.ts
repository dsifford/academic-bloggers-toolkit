import { observable, ObservableMap, asMap, toJS, IObservableArray, computed } from 'mobx';

interface SavedState {
    cache: {
        style: string;
        links: 'always'|'urls'|'never';
        locale: string;
        bibmeta: Citeproc.Bibmeta;
        uncited: [string, CSL.Data][]|string[];
    };
    citations: Citeproc.CitationRegistry;
    CSL: {
        [id: string]: CSL.Data;
    };
    bibOptions: {
        heading: string;
        style: 'fixed'|'toggle';
    }
}


class CitationStore {

    @observable
    private byId: ObservableMap<Citeproc.Citation>;

    @observable
    private byIndex: IObservableArray<Citeproc.Citation>;

    @observable
    private byItemId: ObservableMap<Citeproc.Citation[]>;

    @observable
    CSL: ObservableMap<CSL.Data>;

    @computed
    get data(): {registry: Citeproc.CitationRegistry, CSL: {[id: string]: CSL.Data}} {
        return {
            registry: {
                citationById: toJS(this.byId),
                citationByIndex: this.byIndex.slice(),
                citationsByItemId: toJS(this.byItemId),
            },
            CSL: toJS(this.CSL),
        }
    }

    constructor(c: Citeproc.CitationRegistry, CSL: {[id: string]: CSL.Data}) {
        this.byId = asMap(c.citationById);
        this.byIndex = observable(c.citationByIndex);
        this.byItemId = asMap(c.citationsByItemId);
        this.CSL = asMap(CSL);
    }

    init(registry: Citeproc.CitationRegistry) {
        this.byId = asMap(registry.citationById);
        this.byIndex.replace(registry.citationByIndex);
        this.byItemId = asMap(registry.citationsByItemId);
    }

    removeItems(idList: string[], editor: HTMLDocument) {
        idList.forEach(id => {
            this.removeByIndex(id, editor);
            this.removeById(id);
            this.byItemId.delete(id);
        });
    }

    private removeByIndex(id: string, editor: HTMLDocument) {
        for (const [k, v] of this.byIndex.entries()) {
            this.byIndex[k].citationItems = v.citationItems.filter(i => i.id !== id);
            if (this.byIndex[k].citationItems.length === 0) {
                const el = editor.getElementById(v.citationID);
                el.parentNode.removeChild(el);
                this.byIndex.remove(this.byIndex[k]);
                continue;
            }
            this.byIndex[k].sortedItems = v.sortedItems.filter(i => i[1].id !== id);
        }
    }

    private removeById(id: string) {
        const item = this.citationById;

        for (const k of Object.keys(item)) {
            item[k].citationItems = item[k].citationItems.filter(i => i.id !== id);
            if (item[k].citationItems.length === 0) {
                this.byId.delete(k);
                continue;
            }
            console.log(this.byId.get(k));
            item[k].sortedItems = item[k].sortedItems.filter(i => i[1].id !== id);
            this.byId.set(k, item[k]);
        }
    }

    get citationById(): {[id: string]: Citeproc.Citation} {
        return toJS(this.byId);
    }

    set citationById(obj: {[id: string]: Citeproc.Citation}) {
        this.byId = asMap(obj);
    }

    get citationByIndex(): Citeproc.Citation[] {
        return this.byIndex.slice().map(i => toJS(i));
    }

    set citationByIndex(arr: Citeproc.Citation[]) {
        this.byIndex.replace(arr);
    }

    get citationsByItemId(): {[itemId: string]: Citeproc.Citation[]} {
        return toJS(this.byItemId);
    }

    set citationsByItemId(obj: {[itemId: string]: Citeproc.Citation[]}) {
        this.byItemId = asMap(obj);
    }
}


export class Store {

    bibOptions = {
        heading: '',
        style: <'fixed'|'toggle'>'fixed',
    };

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

    @observable
    bibmeta: ObservableMap<Citeproc.Bibmeta>;

    @observable
    bibliography: IObservableArray<{id: string, html: string}> = observable([]);

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
            cache: this.cache,
            citations: this.citations.data.registry,
            CSL: this.citations.data.CSL,
        });
    }

    get cache() {
        return {
            style: this.citationStyle,
            links: this.links,
            locale: this.locale,
            bibmeta: toJS(this.bibmeta),
        };
    }

    constructor(savedState: SavedState) {
        const { cache, citations, bibOptions, CSL } = savedState;
        this.citations = new CitationStore(citations, CSL);
        this.links = cache.links;
        this.locale = cache.locale;
        this.citationStyle = cache.style;
        this.bibmeta = asMap(<{[id: string]: any}>cache.bibmeta);
        this.bibOptions = bibOptions;
    }
}
