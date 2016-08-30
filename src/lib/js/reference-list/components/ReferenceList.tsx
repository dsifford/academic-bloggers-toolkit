import * as React from 'react';
import { EVENTS } from '../../utils/Constants';
import * as MCE from '../../utils/TinymceFunctions';
import { CSLProcessor } from '../../utils/CSLProcessor';
import { observable, IObservableArray, reaction } from 'mobx';
import { observer } from 'mobx-react';
import { getRemoteData, parseManualData } from '../API';
import * as CSSTransitionGroup from 'react-addons-css-transition-group';
// import DevTools from 'mobx-react-devtools';

import { Store } from '../Store';
import { Menu } from './Menu';
import { PanelButton } from './PanelButton';
import { ItemList } from './ItemList';

declare const tinyMCE: TinyMCE.MCE;
declare const ABT_i18n: BackendGlobals.ABT_i18n;
const { OPEN_REFERENCE_WINDOW, TINYMCE_READY, TINYMCE_HIDDEN, TINYMCE_VISIBLE } = EVENTS;

@observer
export class ReferenceList extends React.Component<{store: Store}, {}> {

    editor: TinyMCE.Editor;
    processor: CSLProcessor;
    labels = ABT_i18n.referenceList.referenceList;

    /**
     * Observable array of selected items
     */
    @observable
    selected: IObservableArray<string> = observable([]);

    /**
     * Toggles the main loading spinner for the Reference List. Loading is true
     *   until the TinyMCE instance dispatches the `init` event or after TinyMCE
     *   dispatches the `hide` event (meaning the WYSIWYG editor is inactive)
     */
    @observable
    loading = true;

    /**
     * Controls the visibility of the hamburger menu
     */
    @observable
    menuOpen = false;

    /**
     * Controls the 'pinned' and 'unpinned' state of the Reference List
     */
    @observable
    fixed = false;

    /**
     * UI state for the 'Cited Items' list
     */
    @observable
    citedListUI = {
        isOpen: true,
        maxHeight: '400px',
    };

    /**
     * UI state for the 'Uncited Items list'
     */
    @observable
    uncitedListUI = {
        isOpen: false,
        maxHeight: '400px',
    };

    constructor(props) {
        super(props);
        this.processor = new CSLProcessor(this.props.store);
        this.initReactions();
    }

    componentDidMount() {
        addEventListener(TINYMCE_READY, this.initTinyMCE);
        addEventListener(TINYMCE_HIDDEN, () => this.loading = true);
        addEventListener(TINYMCE_VISIBLE, () => this.loading = false);
        addEventListener(OPEN_REFERENCE_WINDOW, this.openReferenceWindow);
        addEventListener('scroll', this.handleScroll);
    }

    initReactions = () => {
        /**
         * React to list toggles
         */
        reaction(
            () => [this.citedListUI.isOpen, this.uncitedListUI.isOpen],
            this.handleScroll,
            false,
            200,
        );

        /**
         * React to list pin/unpin
         */
        reaction(
            () => this.fixed,
            this.handleScroll,
        );

        /**
         * React to citedlist changes
         */
        reaction(
            () => this.props.store.citations.citedIDs.length,
            this.handleScroll,
            false,
            200,
        );
    }

    initProcessor = () => {
        this.editor.setProgressState(true);
        return this.processor.init()
        .then((clusters) => {
            MCE.parseInlineCitations(
                this.editor,
                clusters,
                this.props.store.citations.citationByIndex,
                this.processor.citeproc.opt.xclass
            ).then(() => {
                MCE.setBibliography(
                    this.editor,
                    this.processor.makeBibliography(),
                    this.props.store.bibOptions
                );
                this.editor.setProgressState(false);
            });
            this.clearSelection();
        });
    }

    initTinyMCE = () => {
        this.editor = tinyMCE.editors['content'];
        this.initProcessor().then(() => this.loading = !this.loading);
    }

    insertStaticBibliography = () => {
        const data: CSL.Data[] = [];
        this.selected.forEach(id => {
            data.push(this.props.store.citations.CSL.get(id));
        });
        this.processor.createStaticBibliography(data)
        .then(h => {
            const margin: string = this.editor.dom.getStyle(
                this.editor.dom.doc.querySelector('p'),
                'margin',
                true
            ) || '0 0 28px';
            this.editor.insertContent(
                `<div class="noselect mceNonEditable abt-static-bib" style="margin: ${margin}">` +
                    `${h.map(a => a.html).join('')}` +
                `</div>`
            );
            this.clearSelection();
        });
    }

    insertInlineCitation = (e?: React.MouseEvent<HTMLAnchorElement>, data?: CSL.Data[]) => {

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

        const { locations: [citationsBefore, citationsAfter], currentIndex } =
            MCE.getRelativeCitationPositions(this.editor);
        const citationData = this.processor.prepareInlineCitationData(data, currentIndex);
        const clusters = this.processor.processCitationCluster(citationData, citationsBefore, citationsAfter);

        MCE.parseInlineCitations(
            this.editor,
            clusters,
            this.props.store.citations.citationByIndex,
            this.processor.citeproc.opt.xclass,
        ).then(() => {
            MCE.setBibliography(
                this.editor,
                this.processor.makeBibliography(),
                this.props.store.bibOptions
            );
            this.editor.setProgressState(false);
        });

        this.clearSelection();
    }

    deleteCitations = (e?: React.MouseEvent<HTMLAnchorElement>) => {
        if (e) e.preventDefault();
        if (this.selected.length === 0) return;
        this.editor.setProgressState(true);
        this.props.store.citations.removeItems(this.selected, this.editor.dom.doc);
        this.clearSelection();
        this.initProcessor();
    }

    openReferenceWindow = () => {
        MCE.referenceWindow(this.editor).then(payload => {
            if (!payload) return;

            const preprocess: Promise<CSL.Data[]> = payload.addManually
                ? parseManualData(payload)
                : getRemoteData(payload.identifierList, this.editor.windowManager);

            preprocess.then((data) => {

                this.props.store.citations.CSL.merge(
                    data.reduce((prev, curr) => {
                        prev[curr.id] = curr;
                        return prev;
                    }, {} as {[itemId: string]: CSL.Data})
                );

                data = data.reduce((prev, curr) => {
                    const index = this.props.store.citations.lookup.titles.indexOf(curr.title);
                    if (index > -1) {
                        return [
                            ...prev,
                            this.props.store.citations.CSL.get(
                                this.props.store.citations.lookup.ids[index]
                            ),
                        ];
                    }
                    return [...prev, curr];
                }, []);
                if (!payload.attachInline) return;
                this.insertInlineCitation(null, data);
            })
            .catch(err => {
                console.error(err.message);
                this.editor.windowManager.alert(err.message);
            });
        });
    }

    openImportWindow = () => {
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

    handleMenuSelection = (kind: string, data: string) => {
        this.menuOpen = false;
        switch (kind) {
            case 'CHANGE_STYLE':
                this.props.store.citationStyle = data;
                this.initProcessor();
                return;
            case 'IMPORT_RIS':
                this.openImportWindow();
                return;
            case 'REFRESH_PROCESSOR':
                this.initProcessor();
                return;
            case 'DESTROY_PROCESSOR': {
                this.reset();
                return;
            }
            case 'INSERT_STATIC_BIBLIOGRAPHY': {
                this.insertStaticBibliography();
                return;
            }
            default:
                return;
        }
    }

    handleScroll = () => {
        const list = document.getElementById('abt_reflist');

        if (!this.fixed) {
            this.citedListUI.maxHeight = '400px';
            this.uncitedListUI.maxHeight = '400px';
            list.style.top = '';
            return;
        }

        const bothOpen: boolean =
            this.citedListUI.isOpen
            && this.uncitedListUI.isOpen
            && this.props.store.citations.cited.length > 0
            && this.props.store.citations.uncited.length > 0;

        const scrollpos = document.body.scrollTop;
        const topOffset = scrollpos > 134 ? 55 : (scrollpos === 0 ? 95 : 95 - (scrollpos / 3));
        const listOffset = (200 + topOffset);
        const remainingHeight = window.innerHeight - listOffset;

        list.style.top = `${topOffset}px`;
        if (!bothOpen) {
            this.citedListUI.maxHeight = `calc(100vh - ${listOffset}px + 38px)`;
            this.uncitedListUI.maxHeight = `calc(100vh - ${listOffset}px + 38px)`;
            return;
        }

        const cited = document.getElementById('cited');
        const uncited = document.getElementById('uncited');
        let citedHeight = 0;
        let uncitedHeight = 0;

        for (let i = 0; i < cited.children.length; i++) {
            citedHeight += cited.children[i].clientHeight + 1;
            if (citedHeight > (remainingHeight / 2)) {
                citedHeight = remainingHeight / 2;
                break;
            }
        }

        for (let i = 0; i < uncited.children.length; i++) {
            uncitedHeight += uncited.children[i].clientHeight + 1;
            if (uncitedHeight > (remainingHeight / 2)) {
                uncitedHeight = remainingHeight / 2;
                break;
            }
        }

        const allocatedHeight = citedHeight + uncitedHeight;

        if (allocatedHeight < remainingHeight) {
            if (citedHeight > uncitedHeight) {
                citedHeight += remainingHeight - allocatedHeight;
            }
            else {
                uncitedHeight += remainingHeight - allocatedHeight;
            }
        }

        this.citedListUI.maxHeight = `${citedHeight}px`;
        this.uncitedListUI.maxHeight = `${uncitedHeight}px`;
    }

    togglePinned = (e) => {
        e.preventDefault();
        document.getElementById('abt_reflist').classList.toggle('fixed');
        this.fixed = !this.fixed;
    }

    toggleList = (id: string, explode: boolean = false) => {
        switch (id) {
            case 'cited':
                if (explode) {
                    this.citedListUI.isOpen = true;
                    this.uncitedListUI.isOpen = false;
                    break;
                }
                this.citedListUI.isOpen = !this.citedListUI.isOpen;
                break;
            case 'uncited':
                if (explode) {
                    this.citedListUI.isOpen = false;
                    this.uncitedListUI.isOpen = true;
                    break;
                }
                this.uncitedListUI.isOpen = !this.uncitedListUI.isOpen;
                break;
            default:
                break;
        }
    }

    toggleMenu = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        this.menuOpen = !this.menuOpen;
    }

    toggleSelect = (id: string, isSelected: boolean) => {
        return isSelected
        ? this.selected.remove(id)
        : this.selected.push(id);
    }

    clearSelection = () => {
        this.selected.clear();
    }

    reset = () => {
        this.editor.setProgressState(true);
        this.clearSelection();
        this.uncitedListUI.isOpen = false;
        this.citedListUI.isOpen = true;
        this.props.store.reset();
        MCE.reset(this.editor.dom.doc);
        this.initProcessor();
    }

    render() {

        if (this.loading) {
            return(
                <div id="abt-loading">
                    <div className="sk-circle">
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
                {/*<DevTools position={{left: 50, top: 40}} />*/}
                <StorageField store={this.props.store} />
                <div className="panel">
                    <PanelButton
                        disabled={this.selected.length === 0}
                        onClick={this.insertInlineCitation}
                        data-tooltip={this.labels.tooltips.insert}
                    >
                        <span className="dashicons dashicons-migrate insert-inline" />
                    </PanelButton>
                    <PanelButton
                        disabled={this.selected.length !== 0}
                        onClick={this.openReferenceWindow}
                        data-tooltip={this.labels.tooltips.add}
                    >
                        <span className="dashicons dashicons-plus add-reference" />
                    </PanelButton>
                    <PanelButton
                        disabled={this.selected.length === 0}
                        onClick={this.deleteCitations}
                        data-tooltip={this.labels.tooltips.remove}
                    >
                        <span className="dashicons dashicons-minus remove-reference" />
                    </PanelButton>
                    <PanelButton
                        onClick={this.togglePinned}
                        data-tooltip={this.labels.tooltips.pin}
                    >
                        <span
                            className={
                                this.fixed
                                ? 'dashicons dashicons-admin-post pin-reflist fixed'
                                : 'dashicons dashicons-admin-post pin-reflist'
                            }
                        />
                    </PanelButton>
                    <PanelButton onClick={this.toggleMenu}>
                        <span
                            className={
                                this.menuOpen
                                ? 'dashicons dashicons-no-alt hamburger-menu open'
                                : 'dashicons dashicons-menu hamburger-menu'
                            }
                        />
                    </PanelButton>
                </div>
                <CSSTransitionGroup
                    transitionName="menu"
                    transitionEnterTimeout={200}
                    transitionLeaveTimeout={200}
                >
                    { this.menuOpen &&
                        <Menu
                            key="menu"
                            itemsSelected={this.selected.length > 0}
                            cslStyle={this.props.store.citationStyle}
                            submitData={this.handleMenuSelection}
                        />
                    }
                </CSSTransitionGroup>
                { this.props.store.citations.cited.length > 0 &&
                    <ItemList
                        id="cited"
                        items={this.props.store.citations.cited}
                        selectedItems={this.selected}
                        isOpen={this.citedListUI.isOpen}
                        maxHeight={this.citedListUI.maxHeight}
                        toggle={this.toggleList}
                        click={this.toggleSelect}
                        children={this.labels.citedItems}
                    />
                }
                { this.props.store.citations.uncited.length > 0 &&
                    <ItemList
                        id="uncited"
                        items={this.props.store.citations.uncited}
                        selectedItems={this.selected}
                        isOpen={this.uncitedListUI.isOpen}
                        maxHeight={this.uncitedListUI.maxHeight}
                        toggle={this.toggleList}
                        click={this.toggleSelect}
                        children={this.labels.uncitedItems}
                    />
                }
            </div>
        );
    }
}

@observer
class StorageField extends React.Component<{store: Store}, {}> {
    render() {
        return (
            <input
                type="hidden"
                name="abt-reflist-state"
                value={this.props.store.persistent}
            />
        );
    }
}
