import * as React from 'react';
import { parseInlineCitationString, } from '../../utils/HelperFunctions';
import { abtGlobalEvents, } from '../../utils/Constants';
import { Card, } from './Card';
import { referenceWindow, } from '../../utils/TinymceFunctions';
import { CSLProcessor, } from '../../utils/CSLProcessor';
import { getRemoteData } from '../API';

declare var tinyMCE: TinyMCE.tinyMCE, ABT_locationInfo;

interface State {
    loading: boolean;
    references: string[];
    selected: number[];
}

export class ReferenceList extends React.Component<{}, State> {

    private editor: TinyMCE.Editor;
    private processor = new CSLProcessor(ABT_locationInfo.locale, ABT_locationInfo.preferredCitationStyle);

    constructor() {
        super();
        this.state = {
            loading: true,
            references: [],
            selected: [],
        };
        console.log(this.processor);
    }

    componentDidMount() {
        addEventListener(abtGlobalEvents.TINYMCE_READY, this.gatherReferences.bind(this));
        addEventListener(abtGlobalEvents.REFERENCE_ADDED, this.addReference.bind(this));
    }

    componentWillUnmount() {
        removeEventListener(abtGlobalEvents.REFERENCE_ADDED, this.addReference);
    }

    gatherReferences() {
        this.editor = tinyMCE.activeEditor;
        let bib = this.editor.dom.doc.getElementById('abt-smart-bib');

        if (!bib) {
            this.setState({
                loading: false,
                references: [],
                selected: [],
            });
            return;
        }

        let children = bib.children;
        let references: string[] = [];
        for (let i = 0; i < children.length; i++) {
            references.push(children[i].innerHTML);
        }
        this.setState({
            loading: false,
            references,
            selected: [],
        });
    }

    addReference(e: CustomEvent) {
        this.setState(
            Object.assign({}, this.state, {
                references: [
                    ...this.state.references,
                    e.detail,
                ],
            })
        );
    }

    removeReference(e: InputEvent) {
        let references = [...this.state.references, ];
        let removeList: number[] = [];
        this.state.selected.forEach((ref) => {
            removeList.push(ref);
        });

        for (let i = 0; i < removeList.length; i++) {
            references = [
                ...references.slice(0, removeList[i] - i),
                ...references.slice((removeList[i] - i) + 1),
            ];
        }

        this.correctForDeletion(removeList);

        this.setState(
            Object.assign({}, this.state, {
                references,
                selected: [],
            })
        );
        this.adjustBibliography(references);


    }

    handleClick(e: MouseEvent) {
        let num = parseInt((e.target as HTMLDivElement).dataset['num']);
        let newSelected = [...this.state.selected, ];
        let i = newSelected.indexOf(num);

        switch (i) {
            case -1:
                newSelected.push(num);
                newSelected.sort((a, b) => a - b);
                break;
            default:
                newSelected = [
                    ...newSelected.slice(0, i),
                    ...newSelected.slice(i + 1),
                ];
        }

        this.setState(
            Object.assign({}, this.state, {
                selected: newSelected,
            })
        );
    }

    clearSelection() {
        this.setState(
            Object.assign({}, this.state, {
                selected: [],
            })
        );
    }

    insertInline() {
        let citeString = parseInlineCitationString(this.state.selected.map(i => i + 1));
        this.editor.insertContent(
            `<span class="abt_cite noselect mceNonEditable" contenteditable="false" data-reflist="[${this.state.selected}]">[${citeString}]</span>`
        );
        this.clearSelection();
    }

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

    createTooltip(e: InputEvent) {
        e.stopPropagation();
        this.destroyTooltip();

        let tooltip = generateTooltip(e.target.dataset['tooltip']);
        document.body.appendChild(tooltip);

        let targetRect = e.target.getBoundingClientRect();
        let tooltipRect = tooltip.getBoundingClientRect();

        tooltip.style.left = (targetRect.left + 20 - (tooltipRect.width / 2)) + 'px';
        tooltip.style.top = (targetRect.top + targetRect.height + window.scrollY) + 'px';
        tooltip.style.visibility = '';
    }

    destroyTooltip() {
        let existingTooltip = document.getElementById('abt-reflist-tooltip');
        if (existingTooltip) { existingTooltip.remove(); }
    }

    testTinymce(e) {
        e.preventDefault();
        referenceWindow(this.editor, (data: ABT.ReferencePayload) => {
            if (!data.addManually) {
                getRemoteData(data.identifierList, (res: CSL.Data[]|Error) => {
                    if (res instanceof Error) {
                        console.log(res.message);
                        return;
                    }
                    this.processor.consumeCitations(res);
                    this.processor.citeproc.updateItems(this.processor.state.toJS().citationIDs);
                    this.setState(Object.assign({}, this.state, {
                        references: this.processor.citeproc.makeBibliography()[1],
                    }));
                });
            }
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

        // Destroys existing tooltips on re-renders
        this.destroyTooltip();

        return (
            <div>
                <div id='abt-reflist-tooltip' />
                <div style={{
                    display: 'flex',
                    padding: '10px 0',
                    marginTop: -6,
                    background: '#f5f5f5',
                    borderBottom: '1px solid #ddd',
                    borderTop: '1px solid #ddd',
                    clear: 'both',
                    justifyContent: 'space-around',
                }}>
                    <button
                        className='abt-reflist-button'
                        disabled={this.state.selected.length === 0}
                        onClick={this.insertInline.bind(this)}
                        onMouseOver={this.createTooltip.bind(this)}
                        onMouseLeave={this.destroyTooltip}
                        data-tooltip='Insert selected references'>
                        <span
                            className='dashicons dashicons-migrate'
                            style={{
                                transform: 'rotateY(180deg)',
                                width: 18,
                                height: 18,
                                paddingLeft: 2,
                                pointerEvents: 'none',
                            }}/>
                    </button>
                    <button
                        className='abt-reflist-button'
                        disabled={this.state.selected.length !== 0}
                        // onClick={(e) => {
                        //     e.preventDefault();
                        //     dispatchEvent(new CustomEvent(abtGlobalEvents.INSERT_REFERENCE));
                        // }}
                        onClick={this.testTinymce.bind(this)}
                        onMouseOver={this.createTooltip.bind(this)}
                        onMouseLeave={this.destroyTooltip}
                        data-tooltip='Add reference to reference list'>
                        <span
                            className='dashicons dashicons-plus'
                            style={{
                                lineHeight: '22px',
                                width: 20,
                                height: 18,
                                paddingRight: 2,
                                pointerEvents: 'none',
                            }}/>
                    </button>
                    <button
                        className='abt-reflist-button'
                        disabled={this.state.selected.length === 0}
                        onClick={this.removeReference.bind(this)}
                        onMouseOver={this.createTooltip.bind(this)}
                        onMouseLeave={this.destroyTooltip}
                        data-tooltip='Remove selected references from reference list'>
                        <span
                            className='dashicons dashicons-minus'
                            style={{
                                fontWeight: 900,
                                height: 18,
                                width: 18,
                                paddingRight: 2,
                                pointerEvents: 'none',
                            }}/>
                    </button>
                    <input
                        type='button'
                        className='button'
                        value='Clear Selection'
                        disabled={this.state.selected.length === 0}
                        onClick={this.clearSelection.bind(this)} />
                </div>
                <div style={{
                    maxHeight: 1000,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                }}>
                    {
                        this.state.references.map((r: string, i: number) =>
                            <Card
                                key={i}
                                dragLeave={this.dragLeave.bind(this)}
                                dragStart={this.dragStart.bind(this)}
                                dragOver={this.dragOver.bind(this)}
                                drop={this.drop.bind(this)}
                                onClick={this.handleClick.bind(this)}
                                isSelected={this.state.selected}
                                num={i}
                                html={r} />
                        )
                    }
                </div>
            </div>
        );
    }
}

function generateTooltip(text: string): HTMLDivElement {
    let container = document.createElement('DIV') as HTMLDivElement;
    let arrow = document.createElement('DIV') as HTMLDivElement;
    let tooltip = document.createElement('DIV') as HTMLDivElement;

    container.id = 'abt-reflist-tooltip';
    container.className = 'mce-widget mce-tooltip mce-tooltip-n';
    container.style.zIndex = '131070';
    container.style.visibility = 'hidden';

    arrow.className = 'mce-tooltip-arrow';
    tooltip.className = 'mce-tooltip-inner';
    tooltip.innerText = text;

    container.appendChild(arrow);
    container.appendChild(tooltip);

    return container;
}
