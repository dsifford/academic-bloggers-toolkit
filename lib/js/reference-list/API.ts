import { getFromPMID } from '../utils/PubmedAPI';
import { getFromDOI } from '../utils/CrossRefAPI';
import { generateID } from '../utils/HelperFunctions';
import { processDate } from '../utils/CSLFieldProcessors';

export function getRemoteData(identifierList: string): Promise<CSL.Data[]|Error> {
    return new Promise((mainResolve, mainReject) => {
        const pmidList: string[] = [];
        const doiList: string[] = [];
        const identifiers = identifierList.replace(/\s/g, '');

        identifiers.split(',').forEach(i => {
            if (i.search(/^10\./) > -1) {
                doiList.push(i);
                return;
            }
            pmidList.push(i);
        });

        const p1: Promise<CSL.Data[]> = new Promise((resolve, reject) => {
            getFromPMID(pmidList.join(','), (res: Error|CSL.Data[]) => {
                if (res instanceof Error) {
                    reject(res);
                    return;
                }
                resolve(res);
            });
        });

        const p2: Promise<CSL.Data[]> = new Promise((resolve, reject) => {
            const promises: Promise<CSL.Data>[] = [];
            doiList.forEach((doi: string, i: number) => {
                promises.push(
                    new Promise((resolveInner, rejectInner) => {
                        getFromDOI(doi, (res: Error|CSL.Data[]) => {
                            if (res instanceof Error) {
                                rejectInner(res);
                                return;
                            }
                            resolveInner(res);
                        });
                    }) as Promise<CSL.Data>
                );
            });

            Promise.all(promises).then((data) => {
                resolve(data.reduce((a, b) => a.concat(b), []));
            }, (err: Error) => {
                reject(err);
            });
        });

        Promise.all([p1, p2]).then((data: [CSL.Data[], CSL.Data[]]) => {
            const combined: CSL.Data[] = data.reduce((a, b) => a.concat(b), []);
            combined.forEach(ref => {
                ref.id = generateID();
            });
            mainResolve(combined);
        }, (err: Error) => {
            mainReject(err);
        });
    });
};

export function parseManualData(payload: ABT.ReferencePayload): Promise<CSL.Data[]|Error> {
    return new Promise((resolve, reject) => {
        payload.people.forEach(person => {
            if (typeof payload.manualData[person.type] === 'undefined') {
                payload.manualData[person.type] = [{ family: person.family, given: person.given, }];
                return;
            }
            payload.manualData[person.type].push({ family: person.family, given: person.given, });
        });

        // Process date fields
        ['accessed', 'event-date', 'issued'].forEach(dateType => {
            payload.manualData[dateType] = processDate(payload.manualData[dateType], 'RIS');
        });

        // Create a unique ID
        payload.manualData.id = generateID();

        Object.keys(payload.manualData).forEach(key => {
            if (payload.manualData[key] === '') delete payload.manualData[key];
            if (['accessed', 'event-date', 'issued'].indexOf(key) > -1) {
                if (payload.manualData[key]['date-parts'][0].length === 0) delete payload.manualData[key];
            }
        });

        resolve([payload.manualData]);
    });
}
