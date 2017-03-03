import { generateID } from '../utils/helpers/';
import { parseCSLDate } from '../utils/parsers/';
import { getFromDOI, getFromPubmed } from '../utils/resolvers/';

export function getRemoteData(identifierList: string, mce: TinyMCE.WindowManager): Promise<CSL.Data[]> {
    return new Promise(resolve => {
        const pmidList: string[] = [];
        const pmcidList: string[] = [];
        const doiList: string[] = [];
        const errList: string[] = [];
        const identifiers = identifierList.replace(/\s/g, '');
        const promises: Promise<[CSL.Data[], string[]]>[] = [];

        identifiers.split(',').forEach(id => {
            if (/^10\./.test(id)) {
                doiList.push(id);
                return;
            }
            if (/^\d+$/.test(id)) {
                pmidList.push(id);
                return;
            }
            if (/^PMC\d+$/.test(id)) {
                pmcidList.push(id.substring(3));
                return;
            }
            errList.push(id);
        });

        if (pmidList.length > 0) promises.push(getFromPubmed('PMID', pmidList.join(',')));
        if (pmcidList.length > 0) promises.push(getFromPubmed('PMCID', pmcidList.join(',')));
        if (doiList.length > 0) promises.push(getFromDOI(doiList));

        if (promises.length === 0) {
            mce.alert(`${top.ABT_i18n.errors.identifiersNotFound.all}`);
            resolve([]);
            return;
        }

        Promise.all(promises).then((data: [CSL.Data[], string[]][]) => {
            const [csl, errs] = data.reduce(([prevCSL, prevErr], [currCSL, currErr]) => {
                currCSL.forEach(ref => ref.id = generateID());
                return [
                    [...prevCSL, ...currCSL],
                    [...prevErr, ...currErr],
                ];
            }, [[], [...errList]]);

            if (errs.length > 0) {
                mce.alert(`${top.ABT_i18n.errors.prefix}: ${top.ABT_i18n.errors.identifiersNotFound.some}: ${errs.join(', ')}`); // tslint:disable-line
            }

            resolve(csl);
        });
    });
}

export function parseManualData(data: ABT.ManualData): Promise<CSL.Data[]> {
    return new Promise(resolve => {
        data.people.forEach(person => {
            if (data.manualData[person.type] === undefined) {
                data.manualData[person.type] = [{ family: person.family, given: person.given }];
                return;
            }
            data.manualData[person.type].push({ family: person.family, given: person.given });
        });

        // Process date fields
        ['accessed', 'event-date', 'issued'].forEach(dateType => {
            if (!data.manualData[dateType]) return;
            data.manualData[dateType] = parseCSLDate(data.manualData[dateType], 'RIS');
        });

        // Create a unique ID if one doesn't exist
        if (!data.manualData.id) data.manualData.id = generateID();

        Object.keys(data.manualData).forEach(key => {
            if (data.manualData[key] === '') {
                delete data.manualData[key];
                return;
            }
        });

        resolve([data.manualData]);
    });
}
