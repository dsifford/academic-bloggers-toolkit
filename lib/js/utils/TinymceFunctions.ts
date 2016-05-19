declare var ABT_locationInfo;


export const referenceWindow = (editor: TinyMCE.Editor, callback: Function) => {
    editor.windowManager.open({
        title: 'Insert Formatted Reference',
        url: ABT_locationInfo.tinymceViewsURL + 'reference-window.html',
        width: 600,
        height: 10,
        params: {
            baseUrl: ABT_locationInfo.tinymceViewsURL,
            preferredStyle: ABT_locationInfo.preferredCitationStyle,
        },
        onclose: (e) => {
            callback(e.target.params.data as ABT.ReferencePayload);
        },
    } as TinyMCE.WindowMangerObject);
};


// const someFunc = (e) => {
//
//     // If the user presses the exit button, return.
//     if (Object.keys(e.target.params).length === 0) {
//         return;
//     }
//
//     editor.setProgressState(1);
//     let payload: ReferenceWindowPayload = e.target.params.data;
//
//     // Handle PubMed and CrossRef calls
//     if (!payload.addManually) {
//
        // let identifiers: string = payload.identifierList.replace(/\s/g, '');
        //
        // let PMIDlist: string[] = [];
        // let DOIlist: string[] = [];
        //
        // identifiers.split(',').forEach(i => {
        //     if (i.search(/^10\./) > -1) {
        //         DOIlist.push(i);
        //         return;
        //     }
        //     PMIDlist.push(i);
        // });
        //
        //
        // let p1 = new Promise((resolve, reject) => {
        //     getFromPMID(PMIDlist.join(','), (res: Error | { [id: string]: CSL.Data }) => {
        //         if (res instanceof Error) {
        //             reject(res.message);
        //             return;
        //         }
        //
        //         let processor = new CSLPreprocessor(ABT_locationInfo.locale, res, payload.citationStyle, (citeproc) => {
        //             let data = processor.prepare(citeproc);
        //             if (payload.includeLink) {
        //                 data = data.map((ref: string, i: number) =>
        //                     `${ref} PMID: <a href="https://www.ncbi.nlm.nih.gov/pubmed/${PMIDlist[i]}" target="_blank">${PMIDlist[i]}</a>`);
        //             }
        //             resolve(data);
        //         });
        //     });
        // });
        //
        // let p2 = new Promise((resolve, reject) => {
        //     let promises = [];
        //     DOIlist.forEach((doi: string, i: number) => {
        //         promises.push(
        //             new Promise((resolveInner, rejectInner) => {
        //                 getFromDOI(doi, (res: Error | { [id: string]: CSL.Data }) => {
        //                     if (res instanceof Error) {
        //                         rejectInner(res.message);
        //                         return;
        //                     }
        //
        //                     let processor = new CSLPreprocessor(ABT_locationInfo.locale, res, payload.citationStyle, (citeproc) => {
        //                         let data = processor.prepare(citeproc);
        //                         if (payload.includeLink) {
        //                             data = parseReferenceURLs(data);
        //                         }
        //                         resolveInner(data);
        //                     });
        //                 });
        //             })
        //         );
        //     });
        //
        //     Promise.all(promises).then((data) => {
        //         resolve(data.reduce((a, b) => a.concat(b), []));
        //     }, (err) => {
        //         reject(err);
        //     });
        //
        // });
        //
        // Promise.all([p1, p2, ]).then((data: any) => {
        //     let combined = data.reduce((a, b) => a.concat(b), []);
        //     deliverContent(combined, { attachInline: payload.attachInline, });
        // }, (err) => {
        //     editor.setProgressState(0);
        //     editor.windowManager.alert(err);
        // });
//         return;
//     }
//
//     // Process manual name fields
//     payload.people.forEach(person => {
//
//         if (typeof payload.manualData[person.type] === 'undefined') {
//             payload.manualData[person.type] = [{ family: person.family, given: person.given, }, ];
//             return;
//         }
//
//         payload.manualData[person.type].push({ family: person.family, given: person.given, });
//     });
//
//     // Process date fields
//     ['accessed', 'event-date', 'issued', ].forEach(dateType => {
//         payload.manualData[dateType] = processDate(payload.manualData[dateType], 'RIS');
//     });
//
//     let processor = new CSLPreprocessor(ABT_locationInfo.locale, { 0: payload.manualData, }, payload.citationStyle, (citeproc) => {
//         let data = processor.prepare(citeproc);
//         if (payload.includeLink) {
//             data = parseReferenceURLs(data);
//         }
//         deliverContent(data, { attachInline: payload.attachInline, });
//     });
// };
