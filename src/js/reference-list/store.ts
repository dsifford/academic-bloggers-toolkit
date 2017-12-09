import { action, computed, IObservableArray, observable, ObservableMap, toJS } from 'mobx';
import { localeMapper as locales } from 'utils/constants';

class CitationStore {
    @observable CSL: ObservableMap<CSL.Data>;
    @observable private byIndex: IObservableArray<Citeproc.Citation>;

    constructor(byIndex: Citeproc.CitationByIndex, CSL: { [id: string]: CSL.Data }) {
        this.byIndex = observable(byIndex);
        this.CSL = this.cleanCSL(CSL);
    }

    /**
     * Returns an array of CSL.Data for all uncited references
     */
    @computed
    get uncited(): CSL.Data[] {
        return this.CSL.keys()
            .reduce(
                (data, currentId) => {
                    if (!this.citedIDs.includes(currentId)) {
                        data = [...data, this.CSL.get(currentId)!];
                    }
                    return data;
                },
                <CSL.Data[]>[],
            )
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
        return Array.from(
            new Set(
                this.byIndex
                    .map(citation => citation.citationItems.map(item => item.id))
                    .reduce((data, item) => data.concat(item), [])
                    .slice(),
            ),
        );
    }

    /**
     * Given an array of CSL.Data, merge the array into this.CSL
     * @param data - Array of CSL.Data to be merged
     */
    @action
    addItems(data: CSL.Data[]): void {
        this.CSL.merge(
            data.reduce(
                (cslObj, item) => ({
                    ...cslObj,
                    [item.id]: item,
                }),
                <{ [id: string]: CSL.Data }>{},
            ),
        );
    }

    @action
    init(byIndex: Citeproc.CitationByIndex): void {
        this.byIndex.replace(JSON.parse(JSON.stringify(byIndex)));
    }

    /**
     * Given an array of current citationIds, remove all elements from byIndex where
     * the citationId of the index does not exist in the given array of citationIds
     * @param citationIds - Array of current citationIds
     */
    @action
    pruneOrphanedCitations(citationIds: string[]): void {
        this.byIndex.replace(
            this.byIndex.filter(citation => citationIds.includes(citation.citationID)),
        );
    }

    /**
     * Given an array of CSL citation IDs, delete all matching CSL from this.CSL and prune this.byIndex.
     * @param idList - String of CSL IDs to be removed
     * @return Array of HTML element IDs to remove from the document
     */
    @action
    removeItems(idList: string[]): string[] {
        const citedIDs = this.citedIDs;
        for (const id of idList) {
            if (!citedIDs.includes(id)) {
                this.CSL.delete(id);
            }
        }
        const toRemove: Set<string> = new Set();
        const byIndex = this.citationByIndex
            .map(i => ({
                ...i,
                citationItems: i.citationItems.filter(j => !idList.includes(j.id)),
            }))
            .reduce(
                (prev, curr) => {
                    if (curr.citationItems.length === 0 && curr.citationID) {
                        toRemove.add(curr.citationID);
                        return prev;
                    }
                    return [...prev, curr];
                },
                <Citeproc.Citation[]>[],
            );
        this.init(byIndex);
        return Array.from(toRemove);
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

    private cleanCSL(csl: { [id: string]: CSL.Data }): ObservableMap<CSL.Data> {
        const cleaned: Array<[string, CSL.Data]> = Object.entries(csl).reduce(
            (arr, [key, value]): Array<[string, CSL.Data]> => {
                const item = {
                    ...value,
                    language:
                        value.language && locales[value.language]
                            ? locales[value.language]
                            : 'en-US',
                };
                return [...arr, [key, item]];
            },
            <Array<[string, CSL.Data]>>[],
        );
        return observable.map(new Map(cleaned));
    }
}

export default class Store {
    bibOptions = {
        heading: '',
        headingLevel: <'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'>'h3',
        links: <ABT.LinkStyle>'always',
        style: <'fixed' | 'toggle'>'fixed',
    };

    @observable citations: CitationStore;

    /**
     * The selected citation style
     */
    citationStyle = observable('');

    /**
     * The user's locale provided by WordPress.
     */
    locale: string;

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
