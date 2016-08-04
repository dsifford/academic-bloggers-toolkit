import * as React from 'react';
import { EVENTS } from '../../utils/Constants';
import * as MCE from '../../utils/TinymceFunctions';
import { CSLProcessor } from '../../utils/CSLProcessor';
import { observable, IObservableArray } from 'mobx';
import { observer } from 'mobx-react';
import { getRemoteData, parseManualData } from '../API';
import * as CSSTransitionGroup from 'react-addons-css-transition-group';
import DevTools from 'mobx-react-devtools';

import { Store } from '../Store';
import { Menu } from './Menu';
import { PanelButton } from './PanelButton';
import { ItemList } from './ItemList';

declare const tinyMCE: TinyMCE.MCE;
const { OPEN_REFERENCE_WINDOW, TINYMCE_READY } = EVENTS;

@observer
export class ReferenceList extends React.Component<{store: Store}, {}> {

    editor: TinyMCE.Editor;
    processor: CSLProcessor;

    @observable
    selected: IObservableArray<string> = observable([]);

    @observable
    loading = true;

    @observable
    menuOpen = false;

    @observable
    fixed = false;

    constructor(props) {
        super(props);

        this.processor = new CSLProcessor(this.props.store);

        this.insertInline = this.insertInline.bind(this);
        this.openReferenceWindow = this.openReferenceWindow.bind(this);
        this.deleteCitations = this.deleteCitations.bind(this);
        this.handleMenuSelection = this.handleMenuSelection.bind(this);
    }

    componentDidMount() {
        addEventListener(TINYMCE_READY, this.initTinyMCE.bind(this));
        addEventListener(OPEN_REFERENCE_WINDOW, this.openReferenceWindow.bind(this));
        addEventListener('scroll', this.scrollHandler);
    }

    initTinyMCE() {
        this.editor = tinyMCE.activeEditor;
        this.initProcessor().then(() => this.loading = !this.loading);
    }

    initProcessor() {
        return this.processor.init()
        .then((clusters) => {

            const [bibmeta, bibliography] = this.processor.makeBibliography(this.props.store.links);
            this.props.store.bibmeta = bibmeta;
            this.props.store.bibliography.replace(bibliography);

            MCE.parseInlineCitations(
                this.editor,
                clusters,
                this.props.store.citations.citationByIndex,
                this.processor.citeproc.opt.xclass
            ).then(() => {
                MCE.setBibliography(this.editor, this.props.store.bibliography, this.props.store.bibOptions);
            });

            this.clearSelection();
        });
    }

    insertInline(e?: React.MouseEvent<HTMLButtonElement>, data?: CSL.Data[]) {

        if (e) e.preventDefault();
        this.editor.setProgressState(true);

        /**
         * If no data, then this must be a case where we're inserting from the
         *   list selection.
         */
        if (!data || data.length === 0) {
            data = [];
            this.selected.forEach(id => {
                data.push(this.props.store.citations.CSL.get(id));
            });
        }

        const { locations: [citationsBefore, citationsAfter] } = MCE.getRelativeCitationPositions(this.editor);
        const citationData = this.processor.prepareInlineCitationData(data);
        const [status, clusters] = this.processor.citeproc.processCitationCluster(citationData, citationsBefore, citationsAfter);
        if (status['citation_errors'].length > 0) {
            console.error(status['citation_errors']);
        }

        const [bibmeta, bibliography] = this.processor.makeBibliography(this.props.store.links);
        this.props.store.bibmeta = bibmeta;
        this.props.store.bibliography.replace(bibliography);

        MCE.parseInlineCitations(
            this.editor,
            clusters,
            this.props.store.citations.citationByIndex,
            this.processor.citeproc.opt.xclass,
        ).then(() => {
            MCE.setBibliography(this.editor, this.props.store.bibliography, this.props.store.bibOptions);
            this.editor.setProgressState(false);
        });

        this.clearSelection();
    }

    deleteCitations(e?: React.MouseEvent<HTMLButtonElement>) {
        if (e) e.preventDefault();

        if (this.selected.length === 0) return;

        this.editor.setProgressState(true);

        const citedItems: string[] = this.selected.filter(id => {
            const index = this.props.store.bibliography.findIndex(item => item.id === id);
            return index !== -1
            ? this.props.store.bibliography.remove(this.props.store.bibliography[index])
            : false;
        });

        this.selected.forEach(id => this.props.store.citations.CSL.delete(id));

        if (citedItems.length === 0) {
            this.editor.setProgressState(false);
            return;
        }

        this.props.store.citations.citationByIndex = this.props.store.citations.citationByIndex.filter(c => {
            c.citationItems = c.citationItems.filter(i => citedItems.indexOf(i.id) === -1);
            if (c.citationItems.length === 0) {
                const el = this.editor.dom.doc.getElementById(c.citationID);
                el.parentElement.removeChild(el);
            }
            return c.citationItems.length > 0;
        });
        this.initProcessor().then(() => this.editor.setProgressState(false));
    }

    openReferenceWindow(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        MCE.referenceWindow(this.editor).then(payload => {
            if (!payload) return;

            let preprocess: Promise<CSL.Data[]|Error> = payload.addManually
                ? parseManualData(payload)
                : getRemoteData(payload.identifierList);

            preprocess.then((data) => {
                if (data instanceof Error) throw data;

                this.props.store.citations.CSL.merge(
                    data.reduce((prev, curr) => {
                        prev[curr.id] = curr;
                        return prev;
                    }, {} as {[itemId: string]: CSL.Data})
                );

                if (!payload.attachInline) return;
                this.insertInline(null, data);
            })
            .catch(err => {
                console.error(err.message);
                this.editor.windowManager.alert(err.message);
            });
        });
    }

    openImportWindow() {
        MCE.importWindow(this.editor).then(data => {
            if (!data) return;

            this.props.store.citations.CSL.merge(
                data.payload.reduce((prev, curr) => {
                    prev[curr[0]] = curr[1];
                    return prev;
                }, {} as {[itemId: string]: CSL.Data})
            );
        });
    }

    handleMenuSelection(kind: string, data?) {
        switch (kind) {
            case 'CHANGE_STYLE':
                this.props.store.citationStyle = data;
                this.menuOpen = false;
                this.initProcessor();
                return;
            case 'IMPORT_RIS':
                this.menuOpen = false;
                this.openImportWindow();
                return;
            case 'REFRESH_PROCESSOR':
                this.menuOpen = false;
                this.initProcessor();
                return;
            case 'DESTROY_PROCESSOR': {
                // this.selected = this.props.store.bibliography.map(b => b.id);
                // this.deleteCitations();
                // this.props.store.bibliography = [];
                // this.props.store.cache.bibMeta = {};
                // this.props.store.cache.uncited = [];
                // this.props.store.processorState = {};
                // this.props.store.citations = {
                //     citationById: {},
                //     citationByIndex: [],
                //     citationsByItemId: {},
                // };
                // this.menuOpen = false;
                // this.initProcessor();
            }
            default:
                return console.error('Menu selection type not recognized');
        }
    }

    clearSelection = () => {
        this.selected.clear();
    }

    toggleSelect = (id: string, isSelected: boolean) => {
        return isSelected
        ? this.selected.remove(id)
        : this.selected.push(id);
    }

    toggleMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        this.menuOpen = !this.menuOpen;
    }

    pinReferenceList = (e) => {
        e.preventDefault();
        document.getElementById('abt_reflist').classList.toggle('fixed');
        this.fixed = !this.fixed;
    }

    scrollHandler = () => {
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

        return (
            <div>
                <DevTools position={{top: 40, left: 50}}/>
                <StorageField store={this.props.store} />
                <div className='panel'>
                    <PanelButton
                        disabled={this.selected.length === 0}
                        onClick={this.insertInline}
                        data-tooltip='Insert selected references'>
                        <span className='dashicons dashicons-migrate insert-inline' />
                    </PanelButton>
                    <PanelButton
                        disabled={this.selected.length !== 0}
                        onClick={this.openReferenceWindow}
                        data-tooltip='Add reference to reference list'>
                        <span className='dashicons dashicons-plus add-reference' />
                    </PanelButton>
                    <PanelButton
                        disabled={this.selected.length === 0}
                        onClick={this.deleteCitations}
                        data-tooltip='Remove selected references from reference list'>
                        <span className='dashicons dashicons-minus remove-reference' />
                    </PanelButton>
                    <PanelButton
                        onClick={this.pinReferenceList}
                        data-tooltip='Pin Reference List to Visible Window'>
                        <span className={
                            this.fixed
                            ? 'dashicons dashicons-admin-post pin-reflist fixed'
                            : 'dashicons dashicons-admin-post pin-reflist'
                        } />
                    </PanelButton>
                    <PanelButton
                        onClick={this.toggleMenu}
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
                                cslStyle={this.props.store.citationStyle}
                                submitData={this.handleMenuSelection}/>
                        }
                    </CSSTransitionGroup>
                { this.props.store.cited.length > 0 &&
                    <ItemList
                        items={this.props.store.cited}
                        selectedItems={this.selected}
                        startVisible={true}
                        click={this.toggleSelect}
                        className='list'>
                        Cited Items
                    </ItemList>
                }
                { this.props.store.uncited.length > 0 &&
                    <ItemList
                        items={this.props.store.uncited}
                        selectedItems={this.selected}
                        startVisible={false}
                        click={this.toggleSelect}
                        className='list uncited'>
                        Uncited Items
                    </ItemList>
                }
            </div>
        );
    }
}

@observer
class StorageField extends React.Component<{store: Store},{}> {
    render() {
        return (
            <input
                type='hidden'
                name='abt-reflist-state'
                value={this.props.store.persistent} />
        )
    }
}
