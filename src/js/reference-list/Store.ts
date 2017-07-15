import {
    action,
    computed,
    intercept,
    IObservableArray,
    observable,
    ObservableMap,
    toJS,
} from 'mobx';
import { localeMapper as locales } from 'utils/Constants';

class CitationStore {
    @observable CSL: ObservableMap<CSL.Data>;
    @observable private byIndex: IObservableArray<Citeproc.Citation>;

    constructor(byIndex: Citeproc.CitationByIndex, CSL: { [id: string]: CSL.Data }) {
        this.byIndex = observable(byIndex);
        this.CSL = this.cleanCSL(CSL);
        intercept(this.CSL, change => {
            if (change.type !== 'add') return change;
            if (!change.newValue!.title) return null;

            const title = change.newValue!.title!.toLowerCase();
            const matchIndex: number = this.CSL
                .values()
                .findIndex(v => v.title!.toLowerCase() === title);

            if (matchIndex > -1) {
                const match = toJS(this.CSL.get(this.CSL.keys()[matchIndex]));
                const deepMatch = Object.keys(change.newValue).every(k => {
                    const isComplexDataType =
                        typeof change.newValue![k] !== 'string' &&
                        typeof change.newValue![k] !== 'number';
                    const isVariableKey = k === 'id' || k === 'language';
                    return isComplexDataType || isVariableKey
                        ? true
                        : change.newValue![k] === match![k];
                });
                if (deepMatch) return null;
            }

            return change;
        });
    }

    /**
     * Returns an array of CSL.Data for all uncited references
     */
    @computed
    get uncited(): CSL.Data[] {
        return this.CSL
            .keys()
            .reduce((prev, curr) => {
                if (this.citedIDs.indexOf(curr) === -1) prev.push(this.CSL.get(curr)!);
                return prev;
            }, <CSL.Data[]>[])
            .slice();
    }

    /**
     * Returns an array of CSL.Data for all cited references
     */
    @computed
    get cited(): CSL.Data[] {
        return this.citedIDs.map(id => this.CSL.get(id)!).slice();
    }

    /**
     * Returns an array of CSL IDs for all cited CSL
     */
    @computed
    get citedIDs(): string[] {
        return this.citationByIndex
            .map(i => i.citationItems.map(j => j.id))
            .reduce((prev, curr) => [...prev, ...curr], [])
            .reduce((p, c) => (p.indexOf(c) === -1 ? [...p, c] : p), <string[]>[])
            .slice();
    }

    @action
    init(byIndex: Citeproc.CitationByIndex) {
        this.byIndex.replace(JSON.parse(JSON.stringify(byIndex)));
    }

    /**
     * Given an array of CSL citation IDs, delete all matching CSL from this.CSL and prune this.byIndex
     * @param idList - String of CSL IDs to be removed
     * @param doc    - TinyMCE editor document
     */
    @action
    removeItems(idList: string[], doc: HTMLDocument): void {
        idList.forEach(id => {
            if (this.citedIDs.indexOf(id) === -1) this.CSL.delete(id);
        });
        const byIndex = this.citationByIndex
            .map(i => ({
                ...i,
                citationItems: i.citationItems.filter(j => idList.indexOf(j.id) === -1),
                sortedItems: i.sortedItems!.filter(j => idList.indexOf(j[1].id) === -1),
            }))
            .reduce((prev, curr) => {
                if (curr.citationItems.length === 0) {
                    const el = doc.getElementById(curr.citationID!)!;
                    el.parentNode!.removeChild(el);
                    return prev;
                }
                return [...prev, curr];
            }, []);
        this.init(byIndex);
    }

    /**
     * Given an array of CSL.Data, merge the array into this.CSL
     * @param data - Array of CSL.Data to be merged
     */
    @action
    addItems(data: CSL.Data[]): void {
        this.CSL.merge(
            data.reduce((prev, curr) => {
                prev[curr.id!] = curr;
                return prev;
            }, {})
        );
    }

    /**
     * Given an array of current citationIds, remove all elements from byIndex where
     * the citationId of the index does not exist in the given array of citationIds
     * @param citationIds - Array of current citationIds
     */
    @action
    pruneOrphanedCitations(citationIds: string[]): void {
        if (this.byIndex.length === citationIds.length) return;
        const index = this.byIndex.findIndex(a => citationIds.indexOf(a.citationID!) === -1);
        this.byIndex.replace([...this.byIndex.slice(0, index), ...this.byIndex.slice(index + 1)]);
    }

    /**
     * Returns an object of ids and titles from the CSL map for easy consumption
     */
    get lookup(): { ids: string[]; titles: string[] } {
        return {
            ids: this.CSL.keys(),
            titles: this.CSL.values().map(v => v.title!),
        };
    }

    /**
     * Returns a JS object of byIndex
     */
    get citationByIndex(): Citeproc.CitationByIndex {
        return toJS(this.byIndex);
    }

    private cleanCSL(CSL: { [id: string]: CSL.Data }): ObservableMap<CSL.Data> {
        for (const key of Object.keys(CSL)) {
            CSL[key].language = locales[CSL[key].language!] || 'en-US';
        }
        return observable.map(CSL);
    }
}

export class Store {
    bibOptions = {
        heading: '',
        headingLevel: <'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'>'h3',
        style: <'fixed' | 'toggle'>'fixed',
    };

    @observable citations: CitationStore;

    /**
     * The user's locale provided by WordPress.
     */
    locale: string;

    /**
     * The user's selected link format.
     */
    links: 'always' | 'urls' | 'never' | 'always-full-surround';

    /**
     * The selected citation style
     */
    citationStyle = observable('');

    constructor(savedState: BackendGlobals.ABT_Reflist_State) {
        const { cache, citationByIndex, bibOptions, CSL } = savedState;
        this.citations = new CitationStore(citationByIndex, CSL);
        this.links = cache.links;
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
    reset() {
        this.citations = new CitationStore([], {});
    }

    @action
    setStyle(style: string) {
        this.citationStyle.set(style);
    }

    get cache() {
        return {
            links: this.links,
            locale: this.locale,
            style: this.citationStyle,
        };
    }
}
