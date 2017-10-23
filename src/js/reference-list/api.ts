import { parseDate } from 'astrocite-core';
import * as hash from 'string-hash';
import { getFromDOI, getFromPubmed } from 'utils/resolvers/';

export async function getRemoteData(identifierList: string): Promise<[CSL.Data[], string]> {
    let pmidList: string[] = [];
    let pmcidList: string[] = [];
    let doiList: string[] = [];
    let errList: string[] = [];
    let promises: Array<Promise<[CSL.Data[], string[]]>> = [];
    const identifiers = identifierList.replace(/\s/g, '');

    identifiers.split(',').forEach(id => {
        switch (true) {
            case /^10\./.test(id):
                doiList = [...doiList, id];
                break;
            case /^\d+$/.test(id):
                pmidList = [...pmidList, id];
                break;
            case /^PMC\d+$/.test(id):
                pmcidList = [...pmcidList, id];
                break;
            default:
                errList = [...errList, id];
        }
    });

    if (pmidList.length > 0) {
        promises = [...promises, getFromPubmed('PMID', pmidList.join(','))];
    }
    if (pmcidList.length > 0) {
        promises = [...promises, getFromPubmed('PMCID', pmcidList.join(','))];
    }
    if (doiList.length > 0) {
        promises = [...promises, getFromDOI(doiList)];
    }

    if (promises.length === 0) {
        return [[], top.ABT.i18n.errors.identifiersNotFound.all];
    }

    const data = await Promise.all(promises);
    const [csl, errs] = data.reduce(
        ([prevCSL, prevErr], [currCSL, currErr]) => {
            currCSL = currCSL.map(item => ({ ...item, id: `${hash(JSON.stringify(item))}` }));
            return [[...prevCSL, ...currCSL], [...prevErr, ...currErr]];
        },
        [[], [...errList]],
    );

    return [
        csl,
        errs.length > 0
            ? `${top.ABT.i18n.errors.identifiersNotFound.some}: ${errs.join(', ')}`
            : '',
    ];
}

export function parseManualData(data: ABT.ManualData): [CSL.Data[], string] {
    let csl: CSL.Data = data.people.reduce(
        (item, person) => {
            const value = [{ family: person.family, given: person.given }];
            return !item[person.type]
                ? { ...item, [person.type]: value }
                : { ...item, [person.type]: [...item[person.type]!, ...value] };
        },
        { ...data.manualData },
    );

    csl = Object.keys(csl).reduce(
        (prev, curr: keyof CSL.Data) => {
            if (!csl[curr]) {
                return prev;
            }
            if (['accessed', 'event-date', 'issued'].includes(curr)) {
                return {
                    ...prev,
                    [curr]: parseDate(<string>csl[curr]),
                };
            }
            return {
                ...prev,
                [curr]: csl[curr],
            };
        },
        <CSL.Data>{},
    );

    return [[{ ...csl, id: `${hash(JSON.stringify(csl))}` }], ''];
}
