import { parseDate } from 'astrocite-core';
import { generateID } from 'utils/helpers/';
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
    data.people.forEach(person => {
        if (data.manualData[person.type] === undefined) {
            data.manualData[person.type] = [{ family: person.family, given: person.given }];
            return;
        }
        data.manualData[person.type]!.push({
            family: person.family,
            given: person.given,
        });
    });

    // Process date fields
    ['accessed', 'event-date', 'issued'].forEach(dateType => {
        if (!data.manualData[dateType]) return;
        data.manualData[dateType] = parseDate(data.manualData[dateType]);
    });

    // Create a unique ID if one doesn't exist
    if (!data.manualData.id) data.manualData.id = generateID();

    Object.keys(data.manualData).forEach(key => {
        if (data.manualData[key] === '') {
            delete data.manualData[key];
            return;
        }
    });

    return [[data.manualData], ''];
}
