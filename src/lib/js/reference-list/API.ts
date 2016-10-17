import { getFromDOI, getFromPMID } from '../utils/resolvers/';
import { generateID, processCSLDate } from '../utils/HelperFunctions';

export function getRemoteData(identifierList: string, mce: TinyMCE.WindowManager): Promise<CSL.Data[]> {
    return new Promise(resolve => {
        const pmidList: string[] = [];
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
            errList.push(id);
        });

        if (pmidList.length > 0) promises.push(getFromPMID(pmidList.join(',')));
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

export function parseManualData(payload: ABT.ReferenceWindowPayload): Promise<CSL.Data[]|Error> {
    return new Promise(resolve => {
        payload.people.forEach(person => {
            if (payload.manualData[person.type] === undefined) {
                payload.manualData[person.type] = [{ family: person.family, given: person.given }];
                return;
            }
            payload.manualData[person.type].push({ family: person.family, given: person.given });
        });

        // Process date fields
        ['accessed', 'event-date', 'issued'].forEach(dateType => {
            if (!payload.manualData[dateType]) return;
            payload.manualData[dateType] = processCSLDate(payload.manualData[dateType], 'RIS');
        });

        // Create a unique ID
        payload.manualData.id = generateID();

        Object.keys(payload.manualData).forEach(key => {
            if (payload.manualData[key] === '') {
                delete payload.manualData[key];
                return;
            }
        });

        resolve([payload.manualData]);
    });
}
