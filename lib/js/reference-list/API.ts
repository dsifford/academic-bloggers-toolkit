import { getFromPMID, } from '../utils/PubmedAPI';
import { getFromDOI, } from '../utils/CrossRefAPI';

export function getRemoteData(identifierList: string, callback: Function): void {
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

    const p1 = new Promise((resolve, reject) => {
        getFromPMID(pmidList.join(','), (res: Error|CSL.Data[]) => {
            if (res instanceof Error) {
                reject(res);
                return;
            }
            resolve(res);
        });
    });

    const p2 = new Promise((resolve, reject) => {
        const promises = [];
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
                })
            );
        });

        Promise.all(promises).then((data) => {
            resolve(data.reduce((a, b) => a.concat(b), []));
        }, (err) => {
            reject(err);
        });
    });

    Promise.all([p1, p2]).then((data: [CSL.Data[], CSL.Data[]]) => {
        const combined = data.reduce((a, b) => a.concat(b), []);
        let rand: number = Math.round(Math.random() * Date.now());
        combined.forEach(ref => {
            ref.id = Math.round(Math.random() * Date.now()).toString(30);
        });
        callback(combined);
    }, (err) => {
        callback(err);
    });

};
