import * as React from 'react';
import { EVENTS } from '../../utils/Constants';
import * as MCE from '../../utils/TinymceFunctions';
import { CSLProcessor } from '../../utils/CSLProcessor';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { getRemoteData, parseManualData } from '../API';
import * as CSSTransitionGroup from 'react-addons-css-transition-group';

import { Menu } from './Menu';
import { Card } from './Card';
import { PanelButton } from './PanelButton';
import { UncitedList } from './UncitedList';

declare const tinyMCE: TinyMCE.MCE;
declare const ABT_meta: ABT.AdminMeta;
declare const ABT_Reflist_State: string;

const { OPEN_REFERENCE_WINDOW, TINYMCE_READY } = EVENTS;

interface SavedState {
    readonly bibliography: {
        readonly id: string;
        readonly html: string;
    }[];
    cache: {
        style: string;
        links: 'always'|'urls'|'never';
        locale: string;
        bibmeta: Citeproc.Bibmeta;
        uncited: [string, CSL.Data][];
    };
    readonly citations: Citeproc.CitationRegistry;
    readonly processorState: {
        readonly [itemID: string]: CSL.Data;
    };
}

interface State extends SavedState {
    readonly selected: string[];
    readonly loading: boolean;
    readonly menuOpen: boolean;
    readonly fixed: boolean;
    readonly bibOptions: {
        readonly heading: string;
        readonly style: 'fixed'|'toggle';
    };
}

class StateNew {

    @observable
    bibliography: {
        id: string;
        html: string;
    }[] = [];

    @observable
    bibOptions: {
        heading: string;
        style: 'fixed'|'toggle';
    } = {
        heading: '',
        style: 'fixed',
    };

    @observable
    cache: {
        style: string;
        links: 'always'|'urls'|'never';
        locale: string;
        bibmeta: Citeproc.Bibmeta;
        uncited: [string, CSL.Data][];
    };

    @observable
    citations: Citeproc.CitationRegistry;

    @observable
    isFixed: boolean = false;

    @observable
    menuOpen: boolean = false;

    @observable
    isLoading: boolean = true;

    @observable
    processorState: {
        [itemID: string]: CSL.Data;
    } = {};

}

@observer
export class ReferenceList extends React.Component<{}, State> {

    private editor: TinyMCE.Editor;
    private processor: ABT.CSLProcessor;

    constructor() {
        super();
        const { bibliography, cache, processorState, citations }: SavedState = JSON.parse(ABT_Reflist_State);

        if (!cache.locale) {
            cache.style = ABT_meta.style;
            cache.links = ABT_meta.links;
            cache.locale = ABT_meta.locale;
            cache.bibmeta = null;
            cache.uncited = [];
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
            fixed: false,
            bibOptions: {
                heading: ABT_meta.bibHeading,
                style: ABT_meta.bibStyle,
            },
        };
    }

    componentDidMount() {
        addEventListener(TINYMCE_READY, this.initTinyMCE.bind(this));
        addEventListener(OPEN_REFERENCE_WINDOW, this.openReferenceWindow.bind(this));
        addEventListener('scroll', () => {
            const scrollpos = document.body.scrollTop;
            const list = document.getElementById('abt_reflist');

            if (!this.state.fixed) return list.style.top = '';

            switch (true) {
                case scrollpos === 0:
                    return list.style.top = '98px';
                case scrollpos < 135:
                    return list.style.top = 98 - (scrollpos/3) + 'px';
                default:
                    return list.style.top = '55px';
            }
        })
    }

    initTinyMCE() {
        this.editor = tinyMCE.activeEditor;
        this.setState(
            Object.assign({}, this.state, {
                loading: false,
            })
        );
    }

    toggleSelect(id: string, isSelected: boolean) {
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
                return console.error('Could not determine if item is selected');
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

    initProcessor(style: string, citationByIndex: Citeproc.Citation[] = this.state.citations.citationByIndex) {
        this.processor.init(style, citationByIndex)
        .then((clusters) => {
            const processorState = this.processor.state.citations;

            const [bibmeta, bibHTML]: Citeproc.Bibliography = this.processor.makeBibliography(this.state.cache.links);
            const bibliography = bibHTML.map((h, i) => ({ id: bibmeta.entry_ids[i][0], html: h }));
            const citations = this.processor.citeproc.registry.citationreg;

            MCE.parseInlineCitations(
                this.editor,
                clusters,
                citations.citationByIndex,
                this.processor.citeproc.opt.xclass
            ).then(() => {
                MCE.setBibliography(this.editor, bibliography, this.state.bibOptions);
            });

            this.setState(
                Object.assign({}, this.state, {
                    bibliography,
                    citations,
                    cache: Object.assign({}, this.state.cache, {
                        bibmeta,
                        style,
                    }),
                    processorState,
                    selected: [],
                 })
            );
        });
    }

    insertInline(data: CSL.Data[], processorState: {[itemID: string]: CSL.Data}, e?: Event) {

        if (e) e.preventDefault();
        this.editor.setProgressState(true);

        /**
         * If no data, then this must be a case where we're inserting from the
         *   list selection.
         */
        let uncited = [...this.state.cache.uncited];
        if (data.length === 0) {
            this.state.selected.forEach(id => {
                data.push(this.processor.citeproc.sys.retrieveItem(id));
                uncited = uncited.filter(c => c[0] !== id);
            });
        }

        const { locations: [citationsBefore, citationsAfter] } = MCE.getRelativeCitationPositions(this.editor);
        const citationData = this.processor.prepareInlineCitationData(data);
        const [status, clusters] = this.processor.citeproc.processCitationCluster(citationData, citationsBefore, citationsAfter);
        if (status['citation_errors'].length > 0) {
            console.error(status['citation_errors']);
        }


        const [bibmeta, bibHTML]: Citeproc.Bibliography = this.processor.makeBibliography(this.state.cache.links);
        const bibliography = bibHTML.map((h, i) => ({ id: bibmeta.entry_ids[i][0], html: h }));
        const citations = this.processor.citeproc.registry.citationreg;

        MCE.parseInlineCitations(
            this.editor,
            clusters,
            citations.citationByIndex,
            this.processor.citeproc.opt.xclass
        ).then(() => {
            MCE.setBibliography(this.editor, bibliography, this.state.bibOptions);
            this.editor.setProgressState(false);
        });

        this.setState(
            Object.assign({}, this.state, {
                bibliography,
                citations,
                cache: Object.assign({}, this.state.cache, {
                    bibmeta,
                    uncited,
                }),
                processorState,
                selected: [],
             })
        );
    }

    deleteCitations(e?: Event) {
        if (e) e.preventDefault();

        if (this.state.selected.length === 0) return;

        const citedItems: string[] = this.state.selected.filter(id =>
            this.state.citations.citationsByItemId.hasOwnProperty(id)
        );
        const uncited = this.state.cache.uncited.filter(item =>
            this.state.selected.indexOf(item[0]) === -1
        );

        let citationByIndex = [...this.state.citations.citationByIndex];
        if (citedItems.length > 0) {
            citationByIndex = this.state.citations.citationByIndex.filter(c => {
                c.citationItems = c.citationItems.filter(i => citedItems.indexOf(i.id) === -1);
                if (c.citationItems.length === 0) {
                    const el = this.editor.dom.doc.getElementById(c.citationID);
                    el.parentElement.removeChild(el);
                }
                return c.citationItems.length > 0;
            });
            this.initProcessor(this.state.cache.style, citationByIndex);
        }

        const processorState = this.processor.purgeCitations(this.state.selected);

        this.setState(
            Object.assign({}, this.state, {
                citations: Object.assign({}, this.state.citations, {
                    citationByIndex,
                }),
                cache: Object.assign({}, this.state.cache, {
                    uncited,
                }),
                processorState,
            })
        );
    }

    openReferenceWindow(e: Event) {
        e.preventDefault();
        MCE.referenceWindow(this.editor)
        .then(payload => {
            if (!payload) return;

            let preprocess: Promise<CSL.Data[]|Error>;

            if (!payload.addManually) {
                preprocess = getRemoteData(payload.identifierList);
            }
            else {
                preprocess = parseManualData(payload);
            }

            preprocess
            .then((data) => {
                if (data instanceof Error) throw data;
                const processorState: {[itemID: string]: CSL.Data} = this.processor.consumeCitations(data);
                return { data, processorState };
            })
            .then(({data, processorState}) => {
                if (!payload.attachInline) {
                    const uncited: [string, CSL.Data][] = [];
                    data.forEach(d => uncited.push([d.id, d]));
                    return this.addToUncitedList(uncited, processorState);
                };
                this.insertInline(data, processorState);
            })
            .catch(err => console.error(err.message));
        });
    }

    openImportWindow() {
        MCE.importWindow(this.editor)
        .then(data => {
            if (!data) return;
            const processorState: {[itemID: string]: CSL.Data} = this.processor.consumeCitations(data.payload.map(r => r[1]));
            this.addToUncitedList(data.payload, processorState);
        });
    }

    addToUncitedList(data: [string, CSL.Data][], processorState): void {
        const uncited = [
            ...data,
            ...this.state.cache.uncited,
        ].sort((a, b) => {
            const A = a[1].title.toLowerCase();
            const B = b[1].title.toLowerCase();
            if ( A < B ) return -1;
            if ( A > B ) return 1;
            return 0;
        });
        this.setState(
            Object.assign({}, this.state, {
                cache: Object.assign({}, this.state.cache, {
                    uncited,
                }),
                processorState,
                selected: [],
             })
        );
    }

    handleMenuSelection(kind: string, data?) {
        switch (kind) {
            case 'CHANGE_STYLE':
                return this.initProcessor(data);
            case 'IMPORT_RIS':
                this.setState(Object.assign({}, this.state, { menuOpen: false }));
                this.openImportWindow();
                return;
            case 'REFRESH_PROCESSOR':
                this.setState(Object.assign({}, this.state, { menuOpen: false }));
                return this.initProcessor(this.state.cache.style);
            case 'DESTROY_PROCESSOR': {
                return this.setState(
                    Object.assign({}, this.state, {
                        selected: this.state.bibliography.map(b => b.id)
                    }),
                    () => {
                        this.deleteCitations();
                        /* HACK: This is very temporary and hacky. Will need to refactor and fix this soon */
                        setTimeout(() => {
                            this.setState(
                                Object.assign({}, this.state, {
                                    bibliography: [],
                                    cache: Object.assign({}, this.state.cache, {
                                        bibmeta: null,
                                        uncited: [],
                                    }),
                                    processorState: {},
                                    citations: {
                                        citationById: {},
                                        citationByIndex: [],
                                        citationsByItemId: {},
                                    },
                                    menuOpen: false,
                                }),
                                () => this.initProcessor(this.state.cache.style, [])
                            )
                        }, 500);
                    }
                );
            }
            default:
                return console.error('Menu selection type not recognized');
        }
    }

    pinReferenceList(e) {
        e.preventDefault();
        const container = document.getElementById('abt_reflist');
        container.classList.toggle('fixed');
        this.setState(Object.assign({}, this.state, { fixed: !this.state.fixed }));
    }

    render() {

        if (this.state.loading) {
            return(
                <div style={{ marginTop: -6, background: '#f5f5f5' }}>
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
                        data-tooltip='Insert selected references'>
                        <span className='dashicons dashicons-migrate insert-inline' />
                    </PanelButton>
                    <PanelButton
                        disabled={this.state.selected.length !== 0}
                        onClick={this.openReferenceWindow.bind(this)}
                        data-tooltip='Add reference to reference list'>
                        <span className='dashicons dashicons-plus add-reference' />
                    </PanelButton>
                    <PanelButton
                        disabled={this.state.selected.length === 0}
                        onClick={this.deleteCitations.bind(this)}
                        data-tooltip='Remove selected references from reference list'>
                        <span className='dashicons dashicons-minus remove-reference' />
                    </PanelButton>
                    <PanelButton
                        onClick={this.pinReferenceList.bind(this)}
                        data-tooltip='Pin Reference List to Visible Window'>
                        <span className={
                            this.state.fixed
                            ? 'dashicons dashicons-admin-post pin-reflist fixed'
                            : 'dashicons dashicons-admin-post pin-reflist'
                        } />
                    </PanelButton>
                    <PanelButton
                        onClick={this.toggleMenu.bind(this)}
                        data-tooltip='Toggle Menu'>
                        <span className='dashicons dashicons-menu hamburger-menu' />
                    </PanelButton>
                </div>
                    <CSSTransitionGroup
                        transitionName='menu'
                        transitionEnterTimeout={200}
                        transitionLeaveTimeout={200} >
                        { this.state.menuOpen &&
                            <Menu
                                key='menu'
                                cslStyle={this.state.cache.style}
                                submitData={this.handleMenuSelection.bind(this)}/>
                        }
                    </CSSTransitionGroup>
                <div className='list'>
                    {
                        this.state.bibliography.map((r: {id: string, html: string}, i: number) =>
                            <Card
                                key={i}
                                onClick={this.toggleSelect.bind(this, r.id, this.state.selected.indexOf(r.id) > -1)}
                                isSelected={this.state.selected.indexOf(r.id) > -1}
                                html={r.html} />
                        )
                    }
                </div>
                { this.state.cache.uncited.length > 0 &&
                    <UncitedList
                        uncited={this.state.cache.uncited}
                        selected={this.state.selected}
                        onClick={this.toggleSelect.bind(this)}/>
                }
            </div>
        );
    }
}
