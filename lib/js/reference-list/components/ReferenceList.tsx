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
declare const ABT_Reflist_State;

const { OPEN_REFERENCE_WINDOW, TINYMCE_READY } = EVENTS;

// interface SavedState {
//     readonly bibliography: {
//         readonly id: string;
//         readonly html: string;
//     }[];
//     cache: {
//         style: string;
//         links: 'always'|'urls'|'never';
//         locale: string;
//         bibmeta: Citeproc.Bibmeta;
//         uncited: [string, CSL.Data][];
//     };
//     readonly citations: Citeproc.CitationRegistry;
//     readonly processorState: {
//         readonly [itemID: string]: CSL.Data;
//     };
// }

@observer
export class ReferenceList extends React.Component<{store: any}, {}> {

    editor: TinyMCE.Editor;

    @observable
    processor;

    @observable
    selected: string[] = [];

    @observable
    loading = true;

    @observable
    menuOpen = false;

    @observable
    fixed = false;

    constructor(props) {
        super(props);
        this.props.store.init(ABT_Reflist_State);
        /* TODO: Make into explicit action */
        this.processor = new CSLProcessor(
            this.props.store.cache.locale,
            this.props.store.cache.style,
            this.props.store.processorState,
            this.props.store.citations.citationByIndex
        );
    }

    componentDidMount() {
        addEventListener(TINYMCE_READY, this.initTinyMCE.bind(this));
        addEventListener(OPEN_REFERENCE_WINDOW, this.openReferenceWindow.bind(this));

        addEventListener('scroll', () => {
            const scrollpos = document.body.scrollTop;
            const list = document.getElementById('abt_reflist');

            if (!this.fixed) return list.style.top = '';

            switch (true) {
                case scrollpos === 0:
                    return list.style.top = '98px';
                case scrollpos < 135:
                    return list.style.top = 98 - (scrollpos/3) + 'px';
                default:
                    return list.style.top = '55px';
            }
        });
    }

    initTinyMCE() {
        this.editor = tinyMCE.activeEditor;
        this.loading = !this.loading;
    }

    toggleSelect(id: string, isSelected: boolean) {
        return isSelected
        ? this.selected.filter((i) => i !== id)
        : this.selected = [...this.selected, id];
    }

    clearSelection() {
        this.selected = [];
    }

    toggleMenu(e: Event) {
        e.preventDefault();
        this.menuOpen = !this.menuOpen;
    }

    initProcessor(style: string, citationByIndex: Citeproc.Citation[] = this.props.store.citations.citationByIndex) {
        this.processor.init(style, citationByIndex)
        .then((clusters) => {
            const processorState = this.processor.state.citations;

            const [bibmeta, bibHTML]: Citeproc.Bibliography = this.processor.makeBibliography(this.props.store.cache.links);
            const bibliography = bibHTML.map((h, i) => ({ id: bibmeta.entry_ids[i][0], html: h }));
            const citations = this.processor.citeproc.registry.citationreg;

            MCE.parseInlineCitations(
                this.editor,
                clusters,
                citations.citationByIndex,
                this.processor.citeproc.opt.xclass
            ).then(() => {
                MCE.setBibliography(this.editor, bibliography, this.props.store.bibOptions);
            });


            this.props.store.bibliography = bibliography;
            this.props.store.citations = citations;
            this.props.store.cache = Object.assign({}, this.props.store.cache, {
                bibmeta,
                style,
            });
            this.props.store.processorState = processorState;

            this.clearSelection();
        });
    }

    insertInline(data: CSL.Data[], processorState: {[itemID: string]: CSL.Data}, e?: Event) {

        if (e) e.preventDefault();
        this.editor.setProgressState(true);

        /**
         * If no data, then this must be a case where we're inserting from the
         *   list selection.
         */
        let uncited = [...this.props.store.cache.uncited];
        if (data.length === 0) {
            this.selected.forEach(id => {
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


        const [bibmeta, bibHTML]: Citeproc.Bibliography = this.processor.makeBibliography(this.props.store.cache.links);
        const bibliography = bibHTML.map((h, i) => ({ id: bibmeta.entry_ids[i][0], html: h }));
        const citations = this.processor.citeproc.registry.citationreg;

        MCE.parseInlineCitations(
            this.editor,
            clusters,
            citations.citationByIndex,
            this.processor.citeproc.opt.xclass
        ).then(() => {
            MCE.setBibliography(this.editor, bibliography, this.props.store.bibOptions);
            this.editor.setProgressState(false);
        });

        this.props.store.bibliography = bibliography;
        this.props.store.citations = citations;
        this.props.store.cache = Object.assign({}, this.props.store.cache, {
            bibmeta,
            uncited,
        });
        this.props.store.processorState = processorState;
        this.clearSelection();
    }

    deleteCitations(e?: Event) {
        if (e) e.preventDefault();

        if (this.selected.length === 0) return;

        const citedItems: string[] = this.selected.filter(id =>
            this.props.store.citations.citationsByItemId.hasOwnProperty(id)
        );
        const uncited = this.props.store.cache.uncited.filter(item =>
            this.selected.indexOf(item[0]) === -1
        );

        let citationByIndex = [...this.props.store.citations.citationByIndex];
        if (citedItems.length > 0) {
            citationByIndex = this.props.store.citations.citationByIndex.filter(c => {
                c.citationItems = c.citationItems.filter(i => citedItems.indexOf(i.id) === -1);
                if (c.citationItems.length === 0) {
                    const el = this.editor.dom.doc.getElementById(c.citationID);
                    el.parentElement.removeChild(el);
                }
                return c.citationItems.length > 0;
            });
            this.initProcessor(this.props.store.cache.style, citationByIndex);
        }

        const processorState = this.processor.purgeCitations(this.selected);

        this.props.store.citations.citationByIndex = citationByIndex;
        this.props.store.cache.uncited = uncited;
        this.props.store.processorState = processorState;
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
            ...this.props.store.cache.uncited,
        ].sort((a, b) => {
            const A = a[1].title.toLowerCase();
            const B = b[1].title.toLowerCase();
            if ( A < B ) return -1;
            if ( A > B ) return 1;
            return 0;
        });
        this.props.store.cache.uncited = uncited;
        this.props.store.processorState = processorState;
        this.clearSelection();
    }

    handleMenuSelection(kind: string, data?) {
        switch (kind) {
            case 'CHANGE_STYLE':
                return this.initProcessor(data);
            case 'IMPORT_RIS':
                this.menuOpen = false;
                this.openImportWindow();
                return;
            case 'REFRESH_PROCESSOR':
                this.menuOpen = false;
                return this.initProcessor(this.props.store.cache.style);
            case 'DESTROY_PROCESSOR': {
                this.selected = this.props.store.bibliography.map(b => b.id);
                this.deleteCitations();
                this.props.store.bibliography = [];
                this.props.store.cache.bibMeta = {};
                this.props.store.cache.uncited = [];
                this.props.store.processorState = {};
                this.props.store.citations = {
                    citationById: {},
                    citationByIndex: [],
                    citationsByItemId: {},
                };
                this.menuOpen = false;
                this.initProcessor(this.props.store.cache.style, []);
            }
            default:
                return console.error('Menu selection type not recognized');
        }
    }

    pinReferenceList(e) {
        e.preventDefault();
        const container = document.getElementById('abt_reflist');
        container.classList.toggle('fixed');
        this.fixed = !this.fixed;
    }

    render() {

        if (this.loading) {
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
            bibliography: this.props.store.cache.bibliography,
            cache: this.props.store.cache.cache,
            processorState: this.props.store.cache.processorState,
            citations: this.props.store.cache.citations,
        };

        return (
            <div>
                <input
                    type='hidden'
                    name='abt-reflist-state'
                    value={JSON.stringify(saveData)} />
                <div className='panel'>
                    <PanelButton
                        disabled={this.selected.length === 0}
                        onClick={this.insertInline.bind(this, [], this.props.store.cache.processorState)}
                        data-tooltip='Insert selected references'>
                        <span className='dashicons dashicons-migrate insert-inline' />
                    </PanelButton>
                    <PanelButton
                        disabled={this.selected.length !== 0}
                        onClick={this.openReferenceWindow.bind(this)}
                        data-tooltip='Add reference to reference list'>
                        <span className='dashicons dashicons-plus add-reference' />
                    </PanelButton>
                    <PanelButton
                        disabled={this.selected.length === 0}
                        onClick={this.deleteCitations.bind(this)}
                        data-tooltip='Remove selected references from reference list'>
                        <span className='dashicons dashicons-minus remove-reference' />
                    </PanelButton>
                    <PanelButton
                        onClick={this.pinReferenceList.bind(this)}
                        data-tooltip='Pin Reference List to Visible Window'>
                        <span className={
                            this.fixed
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
                        { this.menuOpen &&
                            <Menu
                                key='menu'
                                cslStyle={this.props.store.cache.style}
                                submitData={this.handleMenuSelection.bind(this)}/>
                        }
                    </CSSTransitionGroup>
                <div className='list'>
                    {
                        this.props.store.cache.bibliography.map((r: {id: string, html: string}, i: number) =>
                            <Card
                                key={i}
                                onClick={this.toggleSelect.bind(this, r.id, this.selected.indexOf(r.id) > -1)}
                                isSelected={this.selected.indexOf(r.id) > -1}
                                html={r.html} />
                        )
                    }
                </div>
                { this.props.store.cache.uncited.length > 0 &&
                    <UncitedList
                        uncited={this.props.store.cache.uncited}
                        selected={this.selected}
                        onClick={this.toggleSelect.bind(this)}/>
                }
            </div>
        );
    }
}
