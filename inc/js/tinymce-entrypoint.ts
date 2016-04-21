import { PubmedGet } from './utils/PubmedAPI';
import { getFromDOI } from './utils/CrossRefAPI';
import { CSLPreprocessor } from './utils/CSLPreprocessor';
import { parseInlineCitationString } from './utils/HelperFunctions';
import ABTEvent from './utils/Events';

declare var tinyMCE: TinyMCE.tinyMCE, ABT_locationInfo

tinyMCE.PluginManager.add('abt_main_menu', (editor: TinyMCE.Editor, url: string) => {


    interface ReferenceWindowPayload {
        identifierList: string
        citationStyle: string
        showCitationSelect: boolean
        includeLink: boolean
        attachInline: boolean
        addManually: boolean
        people: CSL.Person[]
        manualData: CSL.Data
    }

    /**
     * Responsible for opening the formatted reference window and serving the reference
     * @type {Function}
     */
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

                if (payload.identifierList !== '') {

                    let identifiers: string = payload.identifierList.replace(/\s/g, '');

                    if (identifiers.search(/^10\./) > -1) {

                        getFromDOI(identifiers, (res) => {

                            let processor = new CSLPreprocessor(ABT_locationInfo.locale, res, payload.citationStyle, (citeproc) => {

                                citeproc.updateItems(Object.keys(processor.citations));
                                let bib = citeproc.makeBibliography();

                                let data = [];
                                bib[1].forEach(ref => {
                                    data.push(ref.match(/.+class="csl-right-inline">(.+?)<\/div>/)[1]);
                                });

                                deliverContent(data, { attachInline: payload.attachInline });

                            });

                        });
                        return;
                    }

                    PubmedGet(identifiers, (res) => {
                        console.log(res);
                        let processor = new CSLPreprocessor(ABT_locationInfo.locale, res, payload.citationStyle, (citeproc) => {

                            citeproc.updateItems(Object.keys(processor.citations));
                            let bib = citeproc.makeBibliography();

                            let data = [];
                            bib[1].forEach(ref => {
                                data.push(ref.match(/.+class="csl-right-inline">(.+?)<\/div>/)[1]);
                            });

                            deliverContent(data, { attachInline: payload.attachInline });

                        });

                    });
                }
            },
        });
    };
    editor.addShortcut('meta+alt+r', 'Insert Formatted Reference', openFormattedReferenceWindow);

    /**
     * Responsible for serving the reference payload once generated
     * @type {Function}
     */
    const deliverContent = (data: Error|string[], payload: { attachInline: boolean }) => {
        if (data instanceof Error) {
            editor.windowManager.alert(data.message);
            editor.setProgressState(0);
            return;
        }
        else {
            let smartBib = generateSmartBib();
            let reflist: number[] = [];

            data.forEach((ref) => {
                let li = document.createElement('LI') as HTMLLIElement;
                li.innerHTML = ref;
                smartBib.appendChild(li);
                reflist.push(smartBib.children.length - 1);
                dispatchEvent(new CustomEvent(ABTEvent.REFERENCE_ADDED, { detail: ref }));
            });

            if (payload.attachInline) {
                editor.insertContent(
                    `<span class="abt_cite noselect mceNonEditable" contenteditable="false" data-reflist="[${reflist}]">` +
                    `[${parseInlineCitationString(reflist.map(i => i + 1))}]</span>`
                );
            }

            editor.setProgressState(0);
        }
    }

    /**
     * Generates a Smart Bibliography in the editor and returns the list element.
     * @type {Function}
     * @return {HTMLOListElement}  The Smart Bibliography OL element.
     */
    const generateSmartBib = (): HTMLOListElement => {
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

    const importRefs: TinyMCE.MenuItem = {
        text: 'Import References',
        onclick: () => {
            editor.windowManager.open(<TinyMCE.WindowMangerObject>{
                title: 'Import References',
                url: ABT_locationInfo.tinymceViewsURL + 'import-window.html',
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

                    let data: {
                        filename: string,
                        payload: { [id: string]:CSL.Data },
                        format: 'ama'|'apa',
                    } = e.target.params.data;

                    let payload = data.payload;
                    console.log(payload);

                    let processor = new CSLPreprocessor(ABT_locationInfo.locale, payload, 'american-medical-association', (citeproc) => {

                        citeproc.updateItems(Object.keys(processor.citations));
                        let bib = citeproc.makeBibliography();

                        let payload = [];
                        bib[1].forEach(ref => {
                            payload.push(ref.match(/.+class="csl-right-inline">(.+?)<\/div>/)[1]);
                        });

                        deliverContent(payload, { attachInline: false });

                    });
                },
            });
        },
    }


    // Event Handlers
    editor.on('init', () => {
        addEventListener(ABTEvent.INSERT_REFERENCE, openFormattedReferenceWindow);
        dispatchEvent(new CustomEvent(ABTEvent.TINYMCE_READY));
    });

    editor.on('remove', () => {
        removeEventListener(ABTEvent.INSERT_REFERENCE, openFormattedReferenceWindow);
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
