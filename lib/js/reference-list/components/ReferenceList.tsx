import * as React from 'react';
import { parseInlineCitationString } from '../../utils/HelperFunctions';
import { EVENTS } from '../../utils/Constants';
import * as MCE from '../../utils/TinymceFunctions';
import { CSLProcessor } from '../../utils/CSLProcessor';
import { getRemoteData, parseManualData } from '../API';
import * as CSSTransitionGroup from 'react-addons-css-transition-group';

import { Menu } from './Menu';
import { Card } from './Card';
import { PanelButton } from './PanelButton';
import { SingleChild } from './SingleChild';

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
        bibmeta: Citeproc.Bibmeta
    };
    citations: Citeproc.CitationRegistry;
    processorState: {
        [itemID: string]: CSL.Data;
    };
}

interface State extends SavedState {
    selected: string[];
    loading: boolean;
    menuOpen: boolean;
}

export class ReferenceList extends React.Component<{}, State> {

    private editor: TinyMCE.Editor;
    private processor;

    constructor() {
        super();
        const { bibliography, cache, processorState, citations }: SavedState = JSON.parse(ABT_Reflist_State);

        if (!cache.style) {
            cache.style = ABT_locationInfo.preferredCitationStyle;
            cache.locale = ABT_locationInfo.locale;
            cache.bibmeta = null;
        }

        this.processor = new CSLProcessor(
            cache.locale,
            cache.style,
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
            menuOpen: false,
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

    toggleMenu(e: Event) {
        e.preventDefault();
        this.setState(
            Object.assign({}, this.state, {
                menuOpen: !this.state.menuOpen,
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
        const [bibmeta, bibHTML]: Citeproc.Bibliography = this.processor.makeBibliography();
        const bibliography = bibHTML.map((h, i) => ({ id: bibmeta.entry_ids[i][0], html: h }));
        const citations = this.processor.citeproc.registry.citationreg;

        MCE.parseInlineCitations(this.editor, clusters);

        this.setState(
            Object.assign({}, this.state, {
                bibliography,
                citations,
                cache: Object.assign({}, this.state.cache, {
                    bibmeta,
                }),
                processorState,
                selected: [],
             })
        );
    }

    deleteCitations(e: Event) {
        e.preventDefault();

        const newProcessorState: {[itemID: string]: CSL.Data} = {};
        Object.keys(this.state.processorState).forEach(key => {
            if (this.state.selected.indexOf(key) === -1) {
                newProcessorState[key] = this.state.processorState[key];
            }
        });

        this.setState(
            Object.assign({}, this.state, {
                citations: Object.assign({}, this.state.citations, {
                    citationByIndex: this.state.citations.citationByIndex.filter(citationObj => {
                        citationObj.citationItems = citationObj.citationItems.filter(item =>
                            this.state.selected.indexOf(item.id as string) === -1
                        );
                        if (citationObj.citationItems.length === 0) {
                            this.editor.dom.doc.getElementById(citationObj.citationID).remove();
                        }
                        return citationObj.citationItems.length > 0;
                    }),
                }),
                processorState: newProcessorState,
            }), afterStateChange.bind(this)
        );

        function afterStateChange() {
            this.processor.state.citations = Object.assign({}, this.state.processorState);
            this.processor.init(this.state.cache.style, this.state.citations.citationByIndex)
            .then((clusters) => {
                MCE.parseInlineCitations(this.editor, clusters, true);
                const processorState = this.processor.state.citations;
                const [bibmeta, bibHTML]: Citeproc.Bibliography = this.processor.makeBibliography();
                const bibliography = bibHTML.map((h, i) => ({ id: bibmeta.entry_ids[i][0], html: h }));
                const citations = this.processor.citeproc.registry.citationreg;
                this.setState(
                    Object.assign({}, this.state, {
                        bibliography,
                        citations,
                        cache: Object.assign({}, this.state.cache, {
                            bibmeta,
                        }),
                        processorState,
                        selected: [],
                     })
                );
            });
        }

    }

    openReferenceWindow(e: Event) {
        e.preventDefault();
        MCE.openReferenceWindow(this.editor, this.state.cache.style, (payload: ABT.ReferencePayload) => {

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

                if (payload.citationStyle !== this.state.cache.style) {
                    this.setState(
                        Object.assign({}, this.state, {
                            cache: Object.assign({}, this.state.cache, {
                                style: payload.citationStyle,
                            }),
                        })
                    );
                    return (
                        this.processor.init(payload.citationStyle, this.state.citations.citationByIndex)
                        .then((clusters) => {
                            MCE.parseInlineCitations(this.editor, clusters, true);
                            const processorState: {[itemID: string]: CSL.Data} = this.processor.consumeCitations(data);
                            return { data, processorState };
                        })
                    );
                }

                const processorState: {[itemID: string]: CSL.Data} = this.processor.consumeCitations(data);
                return { data, processorState };
            })
            .then(({data, processorState}) => {
                this.insertInline(data, processorState);
            })
            .catch(err => console.error(err.message));
        });
    }

    handleMenuSubmit(data: {style: string}) {
        this.processor.init(data.style, this.state.citations.citationByIndex)
        .then((clusters) => {
            MCE.parseInlineCitations(this.editor, clusters, true);
            const processorState = this.processor.state.citations;
            const [bibmeta, bibHTML]: Citeproc.Bibliography = this.processor.makeBibliography();
            const bibliography = bibHTML.map((h, i) => ({ id: bibmeta.entry_ids[i][0], html: h }));
            const citations = this.processor.citeproc.registry.citationreg;
            this.setState(
                Object.assign({}, this.state, {
                    bibliography,
                    citations,
                    cache: Object.assign({}, this.state.cache, {
                        bibmeta,
                        style: data.style,
                    }),
                    processorState,
                    selected: [],
                 })
            );
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
                        onClick={this.deleteCitations.bind(this)}
                        tooltip='Remove selected references from reference list'>
                        <span className='dashicons dashicons-minus remove-reference' />
                    </PanelButton>
                    <PanelButton
                        onClick={this.toggleMenu.bind(this)}
                        tooltip='Toggle Menu'>
                        <span className='dashicons dashicons-menu hamburger-menu' />
                    </PanelButton>
                </div>
                    <CSSTransitionGroup
                        transitionName='menu'
                        transitionEnterTimeout={200}
                        transitionLeaveTimeout={200}
                        component={SingleChild}>
                        { this.state.menuOpen &&
                            <Menu
                                key='menu'
                                cslStyle={this.state.cache.style}
                                submitData={this.handleMenuSubmit.bind(this)}/>
                        }
                    </CSSTransitionGroup>
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
