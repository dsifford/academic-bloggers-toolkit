import * as React from 'react';
import { EVENTS } from '../../utils/Constants';
import * as MCE from '../../utils/TinymceFunctions';
import { CSLProcessor } from '../../utils/CSLProcessor';
import { observable, IObservableArray, reaction, action } from 'mobx';
import { observer } from 'mobx-react';
import { getRemoteData, parseManualData } from '../API';
import * as CSSTransitionGroup from 'react-addons-css-transition-group';
import DevTools, { configureDevtool } from '../../utils/DevTools';

const DevTool = DevTools();
configureDevtool({
    logFilter: change => change.type === 'action',
});

import { Store } from '../Store';
import { Menu } from './Menu';
import { PanelButton } from './PanelButton';
import { ItemList } from './ItemList';
import { Spinner } from '../../components/Spinner';

declare const tinyMCE: TinyMCE.MCE;
const { OPEN_REFERENCE_WINDOW, TINYMCE_READY, TINYMCE_HIDDEN, TINYMCE_VISIBLE } = EVENTS;

@observer
export class ReferenceList extends React.Component<{store: Store}, {}> {

    editor: TinyMCE.Editor;
    processor: CSLProcessor;
    errors = top.ABT_i18n.errors;
    labels = top.ABT_i18n.referenceList.referenceList;

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
        addEventListener(TINYMCE_HIDDEN, () => this.toggleLoading(true));
        addEventListener(TINYMCE_VISIBLE, () => this.toggleLoading(false));
        addEventListener(OPEN_REFERENCE_WINDOW, this.openReferenceWindow);
        addEventListener('scroll', this.handleScroll);
    }

    initReactions = () => {
        /**
         * React to list toggles
         */
        reaction(
            () => [this.citedListUI.isOpen, this.uncitedListUI.isOpen, this.menuOpen],
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
        })
        .catch(err => {
            Rollbar.error('ReferenceList.tsx -> initProcessor', err);
            this.editor.windowManager.alert(
                `${this.errors.unexpected.message}.\n\n` +
                `${err.name}: ${err.message}\n\n` +
                `${this.errors.unexpected.reportInstructions}`
            );
        });
    }

    initTinyMCE = () => {
        this.editor = tinyMCE.editors['content'];
        this.initProcessor().then(() => this.toggleLoading());
    }

    insertStaticBibliography = () => {
        const data: CSL.Data[] = [];
        this.selected.forEach(id => {
            data.push(this.props.store.citations.CSL.get(id));
        });

        const selection = this.editor.selection.getContent({ format: 'html' });
        if (/^<div class=".*?abt-static-bib.*?".+<\/div>$/g.test(selection)) {
            const re = /<div id="(\w{8,9})">/g;
            let m: RegExpExecArray;
            while ((m = re.exec(selection)) !== null) { // tslint:disable-line:no-conditional-assignment
                data.push(this.props.store.citations.CSL.get(m[1]));
            }
        }

        this.processor.createStaticBibliography(data)
        .then(bibliography => {
            this.clearSelection();

            if (typeof bibliography === 'boolean') {
                this.editor.windowManager.alert(
                    `${this.errors.warnings.warning}: ${this.errors.warnings.noBib.message}\n\n` +
                    `${this.errors.warnings.reason}: ${this.errors.warnings.noBib.reason}`
                );
                return;
            }

            // Necessary for a particular edge case that throws errors when no text
            // exists yet in the editor
            let margin: string;
            try {
                margin = this.editor.dom.getStyle(
                    this.editor.dom.doc.querySelector('p'),
                    'margin',
                    true
                ) || '0 0 28px';
            } catch (e) {
                margin = '0 0 28px';
            }

            const bib = this.editor.dom.doc.createElement('div');
            bib.className = 'noselect mceNonEditable abt-static-bib';
            bib.style.margin = margin;

            for (const meta of bibliography) {
                const item = this.editor.dom.doc.createElement('div');
                item.id = meta.id;
                item.innerHTML = meta.html;
                bib.appendChild(item);
            }

            this.editor.insertContent(
                bib.outerHTML
            );
        })
        .catch(err => {
            Rollbar.error('ReferenceList.tsx -> insertStaticBibliography', err);
            this.editor.windowManager.alert(
                `${this.errors.unexpected.message}.\n\n` +
                `${err.name}: ${err.message}\n\n` +
                `${this.errors.unexpected.reportInstructions}`
            );
        });
    }

    insertInlineCitation = (e?: React.MouseEvent<HTMLAnchorElement>, data: CSL.Data[] = []) => {

        if (e) e.preventDefault();
        this.editor.setProgressState(true);

        /**
         * If no data, then this must be a case where we're inserting from the
         *   list selection.
         */
        if (data.length === 0) {
            this.selected.forEach(id => {
                data.push(this.props.store.citations.CSL.get(id));
            });
        }

        /**
         * Checks to see if there is a inline citation selected. If so, extract the ids
         *   from it and push it to data.
         */
        const selection = this.editor.selection.getContent({ format: 'html' });
        if (/<span id="([\d\w]+)" class="(?:abt-citation|abt_cite) ?.+<\/span>/.test(selection)) {
            const re = /&quot;(\w+?)&quot;/g;
            let m: RegExpExecArray;
            while ((m = re.exec(selection)) !== null) { // tslint:disable-line:no-conditional-assignment
                data.push(this.props.store.citations.CSL.get(m[1]));
            }
        }

        let clusters;
        try {
            const {
                currentIndex,
                locations: [citationsBefore, citationsAfter],
            } = MCE.getRelativeCitationPositions(
                this.editor,
                Object.keys(this.processor.citeproc.registry.citationreg.citationById),
            );
            const citationData = this.processor.prepareInlineCitationData(data, currentIndex);
            clusters = this.processor.processCitationCluster(citationData, citationsBefore, citationsAfter);
        }
        catch (err) {
            Rollbar.error('ReferenceList.tsx -> insertInlineCitation', err);
            this.editor.windowManager.alert(
                `${this.errors.unexpected.message}.\n\n` +
                `${err.name}: ${err.message}\n\n` +
                `${this.errors.unexpected.reportInstructions}`
            );
            this.editor.setProgressState(false);
            this.clearSelection();
            return;
        }

        MCE.parseInlineCitations(
            this.editor,
            clusters,
            this.props.store.citations.citationByIndex,
            this.processor.citeproc.opt.xclass,
        )
        .then(() => {
            MCE.setBibliography(
                this.editor,
                this.processor.makeBibliography(),
                this.props.store.bibOptions
            );
            this.editor.setProgressState(false);
        })
        .catch(err => {
            Rollbar.error('ReferenceList.tsx -> insertInlineCitation', err);
            this.editor.windowManager.alert(
                `${this.errors.unexpected.message}.\n\n` +
                `${err.name}: ${err.message}\n\n` +
                `${this.errors.unexpected.reportInstructions}`
            );
            this.editor.setProgressState(false);
        });

        this.clearSelection();
    }

    @action
    deleteCitations = () => {
        if (this.selected.length === 0) return;
        this.editor.setProgressState(true);
        this.props.store.citations.removeItems(this.selected, this.editor.dom.doc);
        this.clearSelection();
        this.initProcessor();
    }

    @action
    openReferenceWindow = () => {
        MCE.referenceWindow(this.editor).then(payload => {
            if (!payload) return;

            const preprocess: Promise<CSL.Data[]> = payload.addManually
                ? parseManualData(payload)
                : getRemoteData(payload.identifierList, this.editor.windowManager);

            preprocess.then((data) => {

                this.props.store.citations.addItems(data);

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
                Rollbar.error('ReferenceList.tsx -> openReferenceWindow', err);
                this.editor.windowManager.alert(
                    `${this.errors.unexpected.message}.\n\n` +
                    `${err.name}: ${err.message}\n\n` +
                    `${this.errors.unexpected.reportInstructions}`
                );
            });
        });
    }

    openImportWindow = () => {
        MCE.importWindow(this.editor).then(data => {
            if (!data) return;
            this.props.store.citations.addItems(data);
        }).catch(err => {
            Rollbar.error('ReferenceList.tsx -> openImportWindow', err);
            this.editor.windowManager.alert(
                `${this.errors.unexpected.message}.\n\n` +
                `${err.name}: ${err.message}\n\n` +
                `${this.errors.unexpected.reportInstructions}`
            );
        });
    }

    handleMenuSelection = (kind: string, data: string) => {
        this.toggleMenu();
        switch (kind) {
            case 'CHANGE_STYLE':
                this.props.store.setStyle(data);
                this.initProcessor();
                return;
            case 'IMPORT_RIS':
                this.openImportWindow();
                return;
            case 'REFRESH_PROCESSOR':
                const citations = this.editor.dom.doc.querySelectorAll('.abt-citation, .abt_cite');
                const IDs = [...citations].map(c => c.id);
                this.props.store.citations.pruneOrphanedCitations(IDs);
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

    @action
    handleScroll = () => {
        const list = document.getElementById('abt-reflist');

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

        /**
         * Offset from top of reference list to top of viewport.
         */
        const topOffset = scrollpos > 134 ? 55 : (scrollpos === 0 ? 95 : 95 - (scrollpos / 3));

        /**
         * Vertical space that is already allocated.
         * 200 = all static, non-participating sections of the list + padding
         */
        const listOffset = 200 + topOffset + (this.menuOpen ? 91 : 0);
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

    @action
    togglePinned = () => {
        document.getElementById('abt-reflist').classList.toggle('fixed');
        this.fixed = !this.fixed;
    }

    @action
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

    @action
    toggleMenu = () => {
        this.menuOpen = !this.menuOpen;
    }

    @action
    toggleSelect = (id: string, isSelected: boolean) => {
        return isSelected
        ? this.selected.remove(id)
        : this.selected.push(id);
    }

    @action
    clearSelection = () => {
        this.selected.clear();
    }

    @action
    reset = () => {
        this.editor.setProgressState(true);
        this.clearSelection();
        this.uncitedListUI.isOpen = false;
        this.citedListUI.isOpen = true;
        this.props.store.reset();
        MCE.reset(this.editor.dom.doc);
        this.initProcessor();
    }

    @action
    toggleLoading = (loadState?: boolean) => {
        this.loading = loadState ? loadState : !this.loading;
    }

    render() {

        if (this.loading) {
            return (
                <div>
                    <Spinner size="40px" height="52px" />
                    <StorageField store={this.props.store} />
                </div>
            );
        }

        return (
            <div>
                <DevTool position={{left: 50, top: 40}} />
                <StorageField store={this.props.store} />
                <div className="abt-panel">
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
                                ? 'dashicons dashicons-admin-post pin-reflist_fixed'
                                : 'dashicons dashicons-admin-post pin-reflist'
                            }
                        />
                    </PanelButton>
                    <PanelButton onClick={this.toggleMenu}>
                        <span
                            className={
                                this.menuOpen
                                ? 'dashicons dashicons-no-alt hamburger-menu'
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
