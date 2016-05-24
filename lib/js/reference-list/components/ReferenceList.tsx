import * as React from 'react';
import { parseInlineCitationString } from '../../utils/HelperFunctions';
import { EVENTS } from '../../utils/Constants';
import * as MCE from '../../utils/TinymceFunctions';
import { CSLProcessor } from '../../utils/CSLProcessor';
import { getRemoteData, parseManualData } from '../API';
import { Card } from './Card';
import { PanelButton } from './PanelButton';

declare const tinyMCE: TinyMCE.tinyMCE;
declare const ABT_locationInfo: ABT.LocationInfo;
declare const ABT_Reflist_State: string;

const { OPEN_REFERENCE_WINDOW, TINYMCE_READY } = EVENTS;

interface SavedState {
    bibliography: {
        id: string;
        html: string;
    }[];
    cache: {
        style: string;
        locale: string;
    };
    citations: Citeproc.CitationRegistry;
    processorState: {
        [itemID: string]: CSL.Data;
    };
}

interface State extends SavedState {
    selected: string[];
    loading: boolean;
}

export class ReferenceList extends React.Component<{}, State> {

    private editor: TinyMCE.Editor;
    private processor;

    constructor() {
        super();
        const { bibliography, cache, processorState, citations }: SavedState = JSON.parse(ABT_Reflist_State);
        this.processor = new CSLProcessor(
            ABT_locationInfo.locale,
            ABT_locationInfo.preferredCitationStyle,
            processorState,
            citations.citationByIndex
        );
        this.state = {
            bibliography,
            cache,
            processorState,
            citations,
            selected: [],
            loading: true,
        };
    }

    componentDidMount() {
        addEventListener(TINYMCE_READY, this.initTinyMCE.bind(this));
        addEventListener(OPEN_REFERENCE_WINDOW, this.openReferenceWindow.bind(this));
    }

    initTinyMCE() {
        this.editor = tinyMCE.activeEditor;
        this.setState(
            Object.assign({}, this.state, {
                loading: false,
            })
        );
    }

    toggleSelect(id: string, isSelected: boolean, e: MouseEvent) {
        switch (isSelected) {
            case true:
                return this.setState(
                    Object.assign({}, this.state, {
                        selected: this.state.selected.filter((i) => i !== id),
                    })
                );
            case false:
                return this.setState(
                    Object.assign({}, this.state, {
                        selected: [...this.state.selected, id],
                    })
                );
            default:
                return;
        }
    }

    clearSelection() {
        this.setState(
            Object.assign({}, this.state, {
                selected: [],
            })
        );
    }

    insertInline(data: CSL.Data[], processorState: {[itemID: string]: CSL.Data}) {

        if (data.length === 0) {
            this.state.selected.forEach(id => {
                data.push(this.processor.citeproc.sys.retrieveItem(id));
            });
        }

        const { currentIndex, locations: [citationsBefore, citationsAfter] } = MCE.getRelativeCitationPositions(this.editor);
        const citationData = this.processor.prepareInlineCitationData(currentIndex, data);
        const [status, clusters] = this.processor.citeproc.processCitationCluster(citationData, citationsBefore, citationsAfter);
        if (status['citation_errors'].length > 0) {
            console.error(status['citation_errors']);
        }
        const [bibMeta, bibHTML]: Citeproc.Bibliography = this.processor.citeproc.makeBibliography();
        const bibliography = bibHTML.map((h, i) => ({ id: bibMeta.entry_ids[i][0], html: h }));
        const citations = this.processor.citeproc.registry.citationreg;

        MCE.parseInlineCitations(this.editor, clusters);

        this.setState(
            Object.assign({}, this.state, { bibliography, citations, processorState, selected: [] })
        );
    }

    openReferenceWindow(e: Event) {
        e.preventDefault();
        MCE.openReferenceWindow(this.editor, (payload: ABT.ReferencePayload) => {

            let preprocess: Promise<CSL.Data[]|Error>;

            if (!payload.addManually) {
                preprocess = getRemoteData(payload.identifierList);
            }
            else {
                preprocess = parseManualData(payload);
            }

            preprocess
            .then((data): {data: CSL.Data[], processorState: {[itemID: string]: CSL.Data}} => {
                if (data instanceof Error) throw data;
                const processorState: {[itemID: string]: CSL.Data} = this.processor.consumeCitations(data);
                return({data, processorState});
            })
            .then(({data, processorState}) => {
                this.insertInline(data, processorState);
            })
            .catch(err => console.error(err.message));
        });
    }

    render() {

        if (this.state.loading) {
            return(
                <div style={{ marginTop: -6, background: '#f5f5f5', }}>
                    <div className='sk-circle'>
                        {
                            [...Array(13).keys()].map(k => k !== 0 ?
                                <div key={k} className={`sk-circle${k} sk-child`} /> :
                                null
                            )
                        }
                    </div>
                </div>
            );
        }

        const saveData = {
            bibliography: this.state.bibliography,
            cache: this.state.cache,
            processorState: this.state.processorState,
            citations: this.state.citations,
        };

        return (
            <div>
                <input
                    type='hidden'
                    name='abt-reflist-state'
                    value={JSON.stringify(saveData)} />
                <div className='panel'>
                    <PanelButton
                        disabled={this.state.selected.length === 0}
                        onClick={this.insertInline.bind(this, [], this.state.processorState)}
                        tooltip='Insert selected references'>
                        <span className='dashicons dashicons-migrate insert-inline' />
                    </PanelButton>
                    <PanelButton
                        disabled={this.state.selected.length !== 0}
                        onClick={this.openReferenceWindow.bind(this)}
                        tooltip='Add reference to reference list'>
                        <span className='dashicons dashicons-plus add-reference' />
                    </PanelButton>
                    <PanelButton
                        disabled={this.state.selected.length === 0}
                        onClick={(e) => {e.preventDefault(); console.log(e);}}
                        tooltip='Remove selected references from reference list'>
                        <span className='dashicons dashicons-minus remove-reference' />
                    </PanelButton>
                    <input
                        type='button'
                        className='button'
                        value='Clear Selection'
                        disabled={this.state.selected.length === 0}
                        onClick={this.clearSelection.bind(this)} />
                </div>
                <div className='list'>
                    {
                        this.state.bibliography.map((r: {id: string, html: string}, i: number) =>
                            <Card
                                key={i}
                                onClick={this.toggleSelect.bind(this, r.id, this.state.selected.indexOf(r.id) > -1)}
                                isSelected={this.state.selected.indexOf(r.id) > -1}
                                num={i}
                                html={r.html} />
                        )
                    }
                </div>
            </div>
        );
    }
}

/*
============ LEGACY OPENREFERENCEWINDOW ===================
const { currentIndex, locations: [citationsBefore, citationsAfter] } = MCE.getRelativeCitationPositions(this.editor);
const citationData = this.processor.prepareInlineCitationData(currentIndex, data);

const [status, clusters] = this.processor.citeproc.processCitationCluster(citationData, citationsBefore, citationsAfter);
if (status['citation_errors'].length > 0) {
    console.error(status['citation_errors']);
}


const bibliography = this.processor.citeproc.makeBibliography()[1];
const citations = this.processor.citeproc.registry.citationreg;

MCE.parseInlineCitations(this.editor, clusters);

this.setState(
    Object.assign({}, this.state, { bibliography, citations, processorState })
);
 */

/*
================ LEGACY MANUAL DATA PROCESSING ======================
// Process manual name fields
payload.people.forEach(person => {

    if (typeof payload.manualData[person.type] === 'undefined') {
        payload.manualData[person.type] = [{ family: person.family, given: person.given, }, ];
        return;
    }

    payload.manualData[person.type].push({ family: person.family, given: person.given, });
});

// Process date fields
['accessed', 'event-date', 'issued', ].forEach(dateType => {
    payload.manualData[dateType] = processDate(payload.manualData[dateType], 'RIS');
});

let processor = new CSLPreprocessor(ABT_locationInfo.locale, { 0: payload.manualData, }, payload.citationStyle, (citeproc) => {
    let data = processor.prepare(citeproc);
    if (payload.includeLink) {
        data = parseReferenceURLs(data);
    }
    deliverContent(data, { attachInline: payload.attachInline, });
});
 */


/*
============== LEGACY ================

dragStart(e: DragEvent) {
    this.setState(
        Object.assign({}, this.state, {
            selected: [],
        })
    );
    e.dataTransfer.setData('text/plain', (e.target as HTMLDivElement).dataset['num']);
    e.dataTransfer.dropEffect = 'move';
}

dragOver(e: DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    (e.target as HTMLDivElement).style.backgroundColor = '#0073AA';
    (e.target as HTMLDivElement).style.color = '#FFF';
}


dragLeave(e: DragEvent) {
    e.preventDefault();
    (e.target as HTMLDivElement).style.backgroundColor = '';
    (e.target as HTMLDivElement).style.color = 'inherit';
}

drop(e: DragEvent) {
    e.preventDefault();
    (e.target as HTMLDivElement).style.backgroundColor = '';
    (e.target as HTMLDivElement).style.color = 'inherit';
    let before = parseInt(e.dataTransfer.getData('text'));
    let after = parseInt((e.target as HTMLDivElement).dataset['num']);
    let refCard = this.state.references[before];
    let newRefList = [
        ...this.state.references.slice(0, before),
        ...this.state.references.slice(before + 1),
    ];

    newRefList = [
        ...newRefList.slice(0, after),
        refCard,
        ...newRefList.slice(after),
    ];

    this.setState(
        Object.assign({}, this.state, {
            references: newRefList,
        })
    );

    this.adjustInlineCitations(before, after);
    this.adjustBibliography(newRefList);

}

adjustInlineCitations(before: number, after: number) {

    let citations = (tinyMCE.activeEditor.dom.doc as HTMLDocument).getElementsByClassName('abt_cite');

    for (let cite of Array.from(citations)) {
        let reflist: number[] = JSON.parse((cite as HTMLSpanElement).dataset['reflist']);
        let incrementer: number = before > after ? 1 : -1;
        reflist.forEach((ref: number, i: number) => {
            switch (true) {
                case after <= ref && ref < before:
                    reflist[i] = reflist[i] + incrementer;
                    break;
                case before < ref && ref <= after:
                    reflist[i] = reflist[i] + incrementer;
                    break;
                case before === ref:
                    reflist[i] = after;
            }
        });
        reflist = reflist.sort((a, b) => a - b);
        (cite as HTMLSpanElement).dataset['reflist'] = JSON.stringify(reflist);
        (cite as HTMLSpanElement).innerText = `[${parseInlineCitationString(reflist.map(i => i + 1))}]`;
    }

}

correctForDeletion(deletionList: number[]) {
    let citations = (tinyMCE.activeEditor.dom.doc as HTMLDocument).getElementsByClassName('abt_cite');

    for (let cite of Array.from(citations)) {
        let reflist: number[] = JSON.parse((cite as HTMLSpanElement).dataset['reflist']);
        let newRefList: number[] = [...reflist, ];
        let removeList: number[] = [];
        reflist.forEach((ref: number, i: number) => {
            deletionList.forEach((ind: number) => {
                switch (true) {
                    case ref === ind:
                        removeList.push(ref);
                        break;
                    case ref > ind && deletionList.indexOf(ref) === -1:
                        newRefList[i] = newRefList[i] - 1;
                }
            });
        });

        if (removeList.length > 0) {
            for (let i = 0; i < removeList.length; i++) {
                let removeIndex = newRefList.indexOf(removeList[i]);
                newRefList = [
                    ...newRefList.slice(0, removeIndex),
                    ...newRefList.slice(removeIndex + 1),
                ];
            }
        }

        if (newRefList.length === 0) {
            cite.remove();
            continue;
        }

        (cite as HTMLSpanElement).dataset['reflist'] = JSON.stringify(newRefList);
        (cite as HTMLSpanElement).innerText = `[${parseInlineCitationString(newRefList.map(i => i + 1))}]`;
    }

}

adjustBibliography(refs: string[]) {
    let doc: HTMLDocument = this.editor.dom.doc;
    let bib = doc.getElementById('abt-smart-bib') as HTMLOListElement;
    bib.innerHTML = refs.map(r => `<li>${r}</li>`).join('');
}
 */
