import { PubmedGet } from './utils/PubmedAPI';
import { getFromDOI } from './utils/CrossRefAPI';
import { CSLPreprocessor } from './utils/CSLPreprocessor';
import { processDate } from './utils/CSLFieldProcessors';
import { parseInlineCitationString, parseReferenceURLs } from './utils/HelperFunctions';
import { ABTGlobalEvents } from './utils/Constants';

declare var tinyMCE: TinyMCE.tinyMCE, ABT_locationInfo, wpActiveEditor

tinyMCE.PluginManager.add('abt_main_menu', (editor: TinyMCE.Editor, url: string) => {

    // Fixes issues created if other plugins spawn separate TinyMCE instances
    if (editor.id !== wpActiveEditor) { return; }

    interface ReferenceWindowPayload {
        identifierList: string
        citationStyle: string
        showCitationSelect: boolean
        includeLink: boolean
        attachInline: boolean
        addManually: boolean
        people: CSL.TypedPerson[]
        manualData: CSL.Data
    }


    const openFormattedReferenceWindow = () => {
        editor.windowManager.open(<TinyMCE.WindowMangerObject>{
            title: 'Insert Formatted Reference',
            url: ABT_locationInfo.tinymceViewsURL + 'reference-window.html',
            width: 600,
            height: 10,
            params: {
                baseUrl: ABT_locationInfo.tinymceViewsURL,
                preferredStyle: ABT_locationInfo.preferredCitationStyle,
            },
            onclose: (e: any) => {

                // If the user presses the exit button, return.
                if (Object.keys(e.target.params).length === 0) {
                    return;
                }

                editor.setProgressState(1);
                let payload: ReferenceWindowPayload = e.target.params.data;

                // Handle PubMed and CrossRef calls
                if (!payload.addManually) {

                    let identifiers: string = payload.identifierList.replace(/\s/g, '');

                    let PMIDlist: string[] = [];
                    let DOIlist: string[] = [];

                    identifiers.split(',').forEach(i => {
                        if (i.search(/^10\./) > -1) {
                            DOIlist.push(i);
                            return;
                        }
                        PMIDlist.push(i);
                    });


                    let p1 = new Promise((resolve, reject) => {
                        PubmedGet(PMIDlist.join(','), (res: Error | { [id: string]: CSL.Data }) => {
                            if (res instanceof Error) {
                                reject(res.message);
                                return;
                            }

                            let processor = new CSLPreprocessor(ABT_locationInfo.locale, res, payload.citationStyle, (citeproc) => {
                                let data = processor.prepare(citeproc);
                                if (payload.includeLink) {
                                    data = data.map((ref: string, i: number) =>
                                        `${ref} PMID: <a href="https://www.ncbi.nlm.nih.gov/pubmed/${PMIDlist[i]}" target="_blank">${PMIDlist[i]}</a>`);
                                }
                                resolve(data);
                            });
                        });
                    });

                    let p2 = new Promise((resolve, reject) => {
                        let promises = [];
                        DOIlist.forEach((doi: string, i: number) => {
                            promises.push(
                                new Promise((resolveInner, rejectInner) => {
                                    getFromDOI(doi, (res: Error | { [id: string]: CSL.Data }) => {
                                        if (res instanceof Error) {
                                            rejectInner(res.message);
                                            return;
                                        }

                                        let processor = new CSLPreprocessor(ABT_locationInfo.locale, res, payload.citationStyle, (citeproc) => {
                                            let data = processor.prepare(citeproc);
                                            if (payload.includeLink) {
                                                data = parseReferenceURLs(data);
                                            }
                                            resolveInner(data);
                                        });
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

                    Promise.all([p1, p2]).then((data: any) => {
                        let combined = data.reduce((a, b) => a.concat(b), []);
                        deliverContent(combined, { attachInline: payload.attachInline });
                    }, (err) => {
                        editor.setProgressState(0);
                        editor.windowManager.alert(err);
                    });
                    return;
                }

                // Process manual name fields
                payload.people.forEach(person => {

                    if (typeof payload.manualData[person.type] === 'undefined') {
                        payload.manualData[person.type] = [{ family: person.family, given: person.given }];
                        return;
                    }

                    payload.manualData[person.type].push({ family: person.family, given: person.given });
                });

                // Process date fields
                ['accessed', 'event-date', 'issued'].forEach(dateType => {
                    payload.manualData[dateType] = processDate(payload.manualData[dateType], 'RIS');
                });

                let processor = new CSLPreprocessor(ABT_locationInfo.locale, { 0: payload.manualData }, payload.citationStyle, (citeproc) => {
                    let data = processor.prepare(citeproc);
                    if (payload.includeLink) {
                        data = parseReferenceURLs(data);
                    }
                    deliverContent(data, { attachInline: payload.attachInline });
                });
            },
        });
    };
    editor.addShortcut('meta+alt+r', 'Insert Formatted Reference', openFormattedReferenceWindow);


    interface RefImportPayload {
        filename: string
        payload: { [id: string]: CSL.Data }
        format: string
        links: boolean
    }

    const importRefs: TinyMCE.MenuItem = {
        text: 'Import RIS file',
        onclick: () => {
            editor.windowManager.open(<TinyMCE.WindowMangerObject>{
                title: 'Import References from RIS File',
                url: ABT_locationInfo.tinymceViewsURL + 'import-window.html',
                width: 600,
                height: 10,
                params: {
                    preferredStyle: ABT_locationInfo.preferredCitationStyle,
                },
                onclose: (e: any) => {
                    // If the user presses the exit button, return.
                    if (Object.keys(e.target.params).length === 0) {
                        return;
                    }

                    editor.setProgressState(1);
                    let data: RefImportPayload = e.target.params.data;

                    let processor = new CSLPreprocessor(ABT_locationInfo.locale, data.payload, data.format, (citeproc) => {
                        let payload = processor.prepare(citeproc);

                        if (data.links) {
                            payload = parseReferenceURLs(payload);
                        }

                        deliverContent(payload, { attachInline: false });
                    });
                },
            });
        },
    }


    /**
     * Responsible for serving the reference payload once generated.
     *
     * @param  {Error|string[]} data Either an array of formatted references or
     *   an error, depending on if one was received from an external request.
     * @param  {Object}  payload     An object containing an inner boolean
     *   property who's key is `attachInline`. This determines wheter or not a
     *   URL is generated and served after the citation.
     */
    function deliverContent(data: string[], payload: { attachInline: boolean }): void {
        let smartBib = generateSmartBib();
        let reflist: number[] = [];

        data.forEach((ref) => {
            let li = document.createElement('LI') as HTMLLIElement;
            li.innerHTML = ref;
            smartBib.appendChild(li);
            reflist.push(smartBib.children.length - 1);
            dispatchEvent(new CustomEvent(ABTGlobalEvents.REFERENCE_ADDED, { detail: ref }));
        });

        if (payload.attachInline) {
            editor.insertContent(
                `<span class="abt_cite noselect mceNonEditable" contenteditable="false" data-reflist="[${reflist}]">` +
                `[${parseInlineCitationString(reflist.map(i => i + 1))}]</span>`
            );
        }

        editor.setProgressState(0);
    }


    /**
     * Generates a Smart Bibliography in the editor and returns the associated
     *   HTMLOListElement.
     * @return {HTMLOListElement} The Smart Bibliography Ordered List.
     */
    function generateSmartBib(): HTMLOListElement {
        let doc: HTMLDocument = editor.dom.doc;
        let existingSmartBib: HTMLOListElement = <HTMLOListElement>doc.getElementById('abt-smart-bib');

        if (!existingSmartBib) {
            let container = doc.createElement('DIV') as HTMLDivElement;
            let smartBib = doc.createElement('OL') as HTMLOListElement;
            let horizontalRule = doc.createElement('HR') as HTMLHRElement;
            let comment = doc.createComment(`Smart Bibliography Generated By Academic Blogger's Toolkit`);

            container.id = 'abt-smart-bib-container';
            container.className = 'mceNonEditable';
            container.contentEditable = 'false';
            smartBib.id = 'abt-smart-bib';
            horizontalRule.className = 'abt_editor-only';

            container.appendChild(comment);
            container.appendChild(horizontalRule);
            container.appendChild(smartBib);

            doc.body.appendChild(container);

            return smartBib;
        }

        return existingSmartBib;
    }


    // TinyMCE Menu Items
    const separator: TinyMCE.MenuItem = { text: '-' };

    const requestTools: TinyMCE.MenuItem = {
        text: 'Request More Tools',
        onclick: () => {
            editor.windowManager.open({
                title: 'Request More Tools',
                body: [{
                    type: 'container',
                    html:
                    `<div style="text-align: center;">` +
                    `Have a feature or tool in mind that isn't available?<br>` +
                    `<a ` +
                    `href="https://github.com/dsifford/academic-bloggers-toolkit/issues" ` +
                    `style="color: #00a0d2;" ` +
                    `target="_blank">Open an issue</a> on the GitHub repository and let me know!` +
                    `</div>`,
                }],
                buttons: [],
            });
        }
    }

    const keyboardShortcuts: TinyMCE.MenuItem = {
        text: 'Keyboard Shortcuts',
        onclick: () => {
            editor.windowManager.open({
                title: 'Keyboard Shortcuts',
                url: ABT_locationInfo.tinymceViewsURL + 'keyboard-shortcuts.html',
                width: 400,
                height: 70,
            });
        }
    }

    // Event Handlers
    editor.on('init', () => {
        addEventListener(ABTGlobalEvents.INSERT_REFERENCE, openFormattedReferenceWindow);
        dispatchEvent(new CustomEvent(ABTGlobalEvents.TINYMCE_READY));
    });

    editor.on('remove', () => {
        removeEventListener(ABTGlobalEvents.INSERT_REFERENCE, openFormattedReferenceWindow);
    });


    // Register Button
    const ABT_Button = {
        id: 'abt_menubutton',
        type: 'menubutton',
        icon: 'abt_menu dashicons-welcome-learn-more',
        title: 'Academic Blogger\'s Toolkit',
        menu: [
            importRefs,
            separator,
            keyboardShortcuts,
            requestTools,
        ],
    };
    editor.addButton('abt_main_menu', ABT_Button);

});
