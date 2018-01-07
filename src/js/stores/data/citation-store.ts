import { action, computed, observable, toJS } from 'mobx';
import * as hash from 'string-hash';

import { localeMapper } from 'utils/constants';

export default class CitationStore {
    CSL = observable.map<CSL.Data>();
    private byIndex = observable<Citeproc.Citation>([]);

    constructor(byIndex: Citeproc.CitationByIndex, CSL: Citeproc.RefHash) {
        this.byIndex.replace(byIndex);
        this.CSL.replace(this.cleanCSL(CSL));
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
                    .map(citation =>
                        citation.citationItems.map(item => item.id),
                    )
                    .reduce((data, item) => data.concat(item), [])
                    .slice(),
            ),
        );
    }

    /**
     * Given an array of CSL.Data, merge the array into this.CSL after first
     * creating unique IDs for the data using a hash of the data's contents.
     * @param data - Array of CSL.Data to be merged
     */
    @action
    addItems(data: CSL.Data[]): CSL.Data[] {
        const hashedData = data.map(item => {
            const { id, ...rest } = item;
            const hashedId = `${hash(JSON.stringify(rest))}`;
            return {
                ...rest,
                id: hashedId,
            };
        });
        this.CSL.merge(hashedData.map(item => [item.id, item]));
        return hashedData;
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
            this.byIndex.filter(citation =>
                citationIds.includes(citation.citationID),
            ),
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
                citationItems: i.citationItems.filter(
                    j => !idList.includes(j.id),
                ),
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

    private cleanCSL(csl: Citeproc.RefHash): Array<[string, CSL.Data]> {
        return Object.entries(csl).reduce(
            (arr, [key, value]): Array<[string, CSL.Data]> => {
                const item = {
                    ...value,
                    language:
                        value.language && localeMapper[value.language]
                            ? localeMapper[value.language]
                            : 'en-US',
                };
                return [...arr, [key, item]];
            },
            <Array<[string, CSL.Data]>>[],
        );
    }
}
