import { action, IObservableArray, IObservableValue, observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Spinner } from 'components/Spinner';
import { EVENTS } from 'utils/Constants';
import { CSLProcessor } from 'utils/CSLProcessor';
import DevTools, { configureDevtool } from 'utils/DevTools';
import * as MCE from 'utils/TinymceFunctions';
import { getRemoteData, parseManualData } from '../API';
import { Store } from '../Store';
import { ItemList } from './ItemList';
import { Menu } from './Menu';
import { PanelButton } from './PanelButton';

import Dialog from 'dialogs';

const DevTool = DevTools();
configureDevtool({ logFilter: change => change.type === 'action' });

declare const tinyMCE: TinyMCE.MCE;
const {
    OPEN_REFERENCE_WINDOW,
    REFERENCE_EDITED,
    TINYMCE_READY,
    TINYMCE_HIDDEN,
    TINYMCE_VISIBLE,
    TOGGLE_PINNED_STATE,
} = EVENTS;

interface Props {
    store: Store;
}

@observer
export class ReferenceList extends React.Component<Props, {}> {
    editor: TinyMCE.Editor;
    processor: CSLProcessor;
    errors = top.ABT_i18n.errors;
    labels = top.ABT_i18n.referenceList.referenceList;

    /**
     * The id of the currently opened modal
     */
    @observable currentDialog: IObservableValue<string> = observable('');

    /**
     * Observable array of selected items
     */
    @observable selected: IObservableArray<string> = observable([]);

    /**
     * Toggles the main loading spinner for the Reference List. Loading is true
     *   until the TinyMCE instance dispatches the `init` event or after TinyMCE
     *   dispatches the `hide` event (meaning the WYSIWYG editor is inactive)
     */
    @observable loading = true;

    /**
     * Controls the visibility of the hamburger menu
     */
    @observable menuOpen = false;

    /**
     * Controls the 'pinned' and 'unpinned' state of the Reference List
     */
    @observable fixed = false;

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

    constructor(props: Props) {
        super(props);
        this.processor = new CSLProcessor(this.props.store);
        this.initReactions();
    }

    componentDidMount() {
        addEventListener(OPEN_REFERENCE_WINDOW, this.openReferenceWindow);
        addEventListener(TINYMCE_HIDDEN, this.toggleLoading.bind(this, true));
        addEventListener(TINYMCE_READY, this.initTinyMCE);
        addEventListener(TINYMCE_VISIBLE, this.toggleLoading.bind(this, false));
        addEventListener(TOGGLE_PINNED_STATE, this.togglePinned);
        addEventListener(REFERENCE_EDITED, this.initProcessor);
        document.addEventListener('scroll', this.handleScroll);
    }

    initReactions = () => {
        /**
         * React to list toggles
         */
        reaction(
            () => [this.citedListUI.isOpen, this.uncitedListUI.isOpen, this.menuOpen],
            this.handleScroll,
            { fireImmediately: false, delay: 200 }
        );

        /**
         * React to list pin/unpin
         */
        reaction(() => this.fixed, this.handleScroll);

        /**
         * React to citedlist changes
         */
        reaction(() => this.props.store.citations.citedIDs.length, this.handleScroll, {
            fireImmediately: false,
            delay: 200,
        });
    };

    initProcessor = async () => {
        this.editor.setProgressState(true);
        try {
            const clusters = await this.processor.init();
            await MCE.parseInlineCitations(
                this.editor,
                clusters,
                this.props.store.citations.citationByIndex,
                this.processor.citeproc.opt.xclass
            );
            await MCE.setBibliography(
                this.editor,
                this.processor.makeBibliography(),
                this.props.store.bibOptions
            );
            this.clearSelection();
        } catch (err) {
            Rollbar.error('ReferenceList.tsx -> initProcessor', err);
            this.editor.windowManager.alert(
                `${this.errors.unexpected.message}.\n\n` +
                    `${err.name}: ${err.message}\n\n` +
                    `${this.errors.unexpected.reportInstructions}`
            );
        }
        this.editor.setProgressState(false);
    };

    initTinyMCE = async () => {
        this.editor = (tinyMCE.editors as any)['content'];
        await this.initProcessor();
        this.toggleLoading();
    };

    insertStaticBibliography = async () => {
        const data: CSL.Data[] = [];
        this.selected.forEach(id => {
            data.push(this.props.store.citations.CSL.get(id)!);
        });

        const selection = this.editor.selection.getContent({ format: 'html' });
        if (/^<div class=".*?abt-static-bib.*?".+<\/div>$/g.test(selection)) {
            const re = /<div id="(\w{8,9})">/g;
            let m: RegExpExecArray | null;
            // tslint:disable-next-line
            while ((m = re.exec(selection)) !== null) {
                data.push(this.props.store.citations.CSL.get(m[1])!);
            }
        }

        try {
            const bibliography = await this.processor.createStaticBibliography(data);
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
                margin =
                    this.editor.dom.getStyle(
                        this.editor.dom.doc.querySelector('p')!,
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

            this.editor.insertContent(bib.outerHTML);
        } catch (err) {
            Rollbar.error('ReferenceList.tsx -> insertStaticBibliography', err);
            this.editor.windowManager.alert(
                `${this.errors.unexpected.message}.\n\n` +
                    `${err.name}: ${err.message}\n\n` +
                    `${this.errors.unexpected.reportInstructions}`
            );
        }
    };

    // prettier-ignore
    insertInlineCitation = async (e?: React.MouseEvent<HTMLAnchorElement>, d: CSL.Data[] | Event = []) => {
        let data: CSL.Data[] = [];
        if (e) e.preventDefault();
        this.editor.setProgressState(true);

        /**
         * If no data, then this must be a case where we're inserting from the
         *   list selection.
         */
        if (d instanceof Event || d.length === 0) {
            this.selected.forEach(id => {
                data.push(this.props.store.citations.CSL.get(id)!);
            });
        } else {
            data = d;
        }

        /**
         * Checks to see if there is a inline citation selected. If so, extract the ids
         *   from it and push it to data.
         */
        const selection = this.editor.selection.getContent({ format: 'html' });
        if (/<span.+class="(?:abt-citation|abt_cite).+?<\/span>/.test(selection)) {
            const re = /&quot;(\w+?)&quot;/g;
            let m: RegExpExecArray | null;
            // tslint:disable-next-line
            while ((m = re.exec(selection)) !== null) {
                data.push(this.props.store.citations.CSL.get(m[1])!);
            }
        }

        let clusters;
        try {
            const {
                currentIndex,
                locations: [citationsBefore, citationsAfter],
            } = MCE.getRelativeCitationPositions(
                this.editor,
                Object.keys(
                    this.processor.citeproc.registry.citationreg.citationById
                )
            );
            const citationData = this.processor.prepareInlineCitationData(
                data,
                currentIndex
            );
            clusters = this.processor.processCitationCluster(
                citationData,
                citationsBefore,
                citationsAfter
            );
        } catch (err) {
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

        try {
            await MCE.parseInlineCitations(
                this.editor,
                clusters,
                this.props.store.citations.citationByIndex,
                this.processor.citeproc.opt.xclass
            );
            MCE.setBibliography(
                this.editor,
                this.processor.makeBibliography(),
                this.props.store.bibOptions
            );
        } catch (err) {
            Rollbar.error('ReferenceList.tsx -> insertInlineCitation', err);
            this.editor.windowManager.alert(
                `${this.errors.unexpected.message}.\n\n` +
                    `${err.name}: ${err.message}\n\n` +
                    `${this.errors.unexpected.reportInstructions}`
            );
        }
        this.editor.setProgressState(false);
        this.clearSelection();
    };

    @action
    deleteCitations = () => {
        if (this.selected.length === 0) return;
        this.editor.setProgressState(true);
        this.props.store.citations.removeItems(this.selected, this.editor.dom.doc);
        this.clearSelection();
        this.initProcessor();
    };

    @action
    openReferenceWindow = async () => {
        let payload: ABT.ReferenceWindowPayload;
        let data: CSL.Data[];

        try {
            payload = await MCE.referenceWindow(this.editor);
        } catch (e) {
            if (!e) return; // User exited early
            return Rollbar.error('ReferenceList.tsx -> openReferenceWindow', e);
        }

        try {
            data = payload.addManually
                ? await parseManualData(payload)
                : await getRemoteData(payload.identifierList, this.editor.windowManager);
        } catch (e) {
            Rollbar.error('ReferenceList.tsx -> openReferenceWindow', e);
            this.editor.windowManager.alert(
                `${this.errors.unexpected.message}.\n\n` +
                    `${e.name}: ${e.message}\n\n` +
                    `${this.errors.unexpected.reportInstructions}`
            );
            return;
        }

        if (data.length === 0) return;
        this.props.store.citations.addItems(data);

        data = data.reduce((prev, curr) => {
            let matchingKey = '';
            const title = curr.title!.toLowerCase();

            for (const [key, value] of this.props.store.citations.CSL.entries()) {
                if (value.title!.toLowerCase() !== title) continue;

                const deepMatch = Object.keys(value).every(k => {
                    const isComplexDataType =
                        typeof value[k] !== 'string' && typeof value[k] !== 'number';
                    const isVariableKey = k === 'id' || k === 'language';
                    return isComplexDataType || isVariableKey ? true : value[k] === curr[k];
                });

                if (deepMatch) {
                    matchingKey = key;
                    break;
                }
            }

            return matchingKey !== ''
                ? [...prev, this.props.store.citations.CSL.get(matchingKey)]
                : [...prev, curr];
        }, []) as CSL.Data[];

        return payload.attachInline ? this.insertInlineCitation(undefined, data) : void 0;
    };

    // TODO:
    // openImportWindow = async () => {
    //     let data: CSL.Data[];
    //     try {
    //         data = await MCE.importWindow(this.editor);
    //     } catch (e) {
    //         if (!e) return; // User exited early
    //         Rollbar.error('ReferenceList.tsx -> openImportWindow', e);
    //         this.editor.windowManager.alert(
    //             `${this.errors.unexpected.message}.\n\n` +
    //                 `${e.name}: ${e.message}\n\n` +
    //                 `${this.errors.unexpected.reportInstructions}`
    //         );
    //         return;
    //     }
    //     if (!data) return;
    //     this.props.store.citations.addItems(data);
    // };

    @action
    handleMenuSelection = (kind: string, data: string) => {
        this.toggleMenu();
        switch (kind) {
            case 'CHANGE_STYLE':
                this.props.store.setStyle(data);
                this.initProcessor();
                return;
            case 'IMPORT_RIS':
                // this.openImportWindow();
                this.currentDialog.set('IMPORT');
                return;
            case 'REFRESH_PROCESSOR':
                const citations = this.editor.dom.doc.querySelectorAll('.abt-citation, .abt_cite');
                const IDs = Array.from(citations).map(c => c.id);
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
    };

    @action
    handleScroll = () => {
        const list = document.getElementById('abt-reflist')!;

        if (!this.fixed) {
            this.citedListUI.maxHeight = '400px';
            this.uncitedListUI.maxHeight = '400px';
            list.style.top = '';
            return;
        }

        const bothOpen: boolean =
            this.citedListUI.isOpen &&
            this.uncitedListUI.isOpen &&
            this.props.store.citations.cited.length > 0 &&
            this.props.store.citations.uncited.length > 0;

        const scrollpos = document.body.scrollTop;

        /**
         * Offset from top of reference list to top of viewport.
         */
        const topOffset = scrollpos > 134 ? 55 : scrollpos === 0 ? 95 : 95 - scrollpos / 3;

        /**
         * Vertical space that is already allocated.
         * 180 = all static, non-participating sections of the list + padding
         * 84 = vertical height of menu when open
         */
        const listOffset = 180 + topOffset + (this.menuOpen ? 84 : 0);
        const remainingHeight = window.innerHeight - listOffset;

        list.style.top = `${topOffset}px`;
        if (!bothOpen) {
            this.citedListUI.maxHeight = `calc(100vh - ${listOffset}px)`;
            this.uncitedListUI.maxHeight = `calc(100vh - ${listOffset}px)`;
            return;
        }

        const cited = document.getElementById('cited')!;
        const uncited = document.getElementById('uncited')!;
        let citedHeight = 0;
        let uncitedHeight = 0;

        for (const child of Array.from(cited.children)) {
            citedHeight += child.clientHeight + 1;
            if (citedHeight > remainingHeight / 2) {
                citedHeight = remainingHeight / 2;
                break;
            }
        }

        for (const child of Array.from(uncited.children)) {
            uncitedHeight += child.clientHeight + 1;
            if (uncitedHeight > remainingHeight / 2) {
                uncitedHeight = remainingHeight / 2;
                break;
            }
        }

        const allocatedHeight = citedHeight + uncitedHeight;

        if (allocatedHeight < remainingHeight) {
            if (citedHeight > uncitedHeight) {
                citedHeight += remainingHeight - allocatedHeight;
            } else {
                uncitedHeight += remainingHeight - allocatedHeight;
            }
        }

        this.citedListUI.maxHeight = `${citedHeight}px`;
        this.uncitedListUI.maxHeight = `${uncitedHeight}px`;
    };

    @action
    togglePinned = () => {
        document.getElementById('abt-reflist')!.classList.toggle('fixed');
        this.fixed = !this.fixed;
    };

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
    };

    @action
    toggleMenu = () => {
        this.menuOpen = !this.menuOpen;
    };

    @action
    toggleSelect = (id: string, isSelected: boolean) => {
        return isSelected ? this.selected.remove(id) : this.selected.push(id);
    };

    @action
    clearSelection = () => {
        this.selected.clear();
    };

    @action
    reset = () => {
        this.editor.setProgressState(true);
        this.clearSelection();
        this.uncitedListUI.isOpen = false;
        this.citedListUI.isOpen = true;
        this.props.store.reset();
        MCE.reset(this.editor.dom.doc);
        this.initProcessor();
    };

    @action
    toggleLoading = (loadState?: boolean) => {
        this.loading = loadState ? loadState : !this.loading;
    };

    @action
    openDialog = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        const dialog = e.currentTarget.dataset.dialog || '';
        this.currentDialog.set(dialog);
    }

    @action
    handleDialogSubmit = (data: any) => {
        // tslint:disable-next-line:no-console
        console.log(data);
        this.currentDialog.set('');
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
                <DevTool position={{ left: 50, top: 40 }} />
                <Dialog currentDialog={this.currentDialog} onSubmit={this.handleDialogSubmit} />
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
                        onClick={this.openDialog}
                        data-dialog="ADD"
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
                <Menu
                    isOpen={this.menuOpen}
                    itemsSelected={this.selected.length > 0}
                    cslStyle={this.props.store.citationStyle}
                    submitData={this.handleMenuSelection}
                />
                {this.props.store.citations.cited.length > 0 &&
                    <ItemList
                        id="cited"
                        CSL={this.props.store.citations.CSL}
                        items={this.props.store.citations.cited}
                        selectedItems={this.selected}
                        isOpen={this.citedListUI.isOpen}
                        maxHeight={this.citedListUI.maxHeight}
                        toggle={this.toggleList}
                        click={this.toggleSelect}
                        children={this.labels.citedItems}
                    />}
                {this.props.store.citations.uncited.length > 0 &&
                    <ItemList
                        id="uncited"
                        CSL={this.props.store.citations.CSL}
                        items={this.props.store.citations.uncited}
                        selectedItems={this.selected}
                        isOpen={this.uncitedListUI.isOpen}
                        maxHeight={this.uncitedListUI.maxHeight}
                        toggle={this.toggleList}
                        click={this.toggleSelect}
                        children={this.labels.uncitedItems}
                    />}
            </div>
        );
    }
}

@observer
class StorageField extends React.Component<{ store: Store }, {}> {
    render() {
        return <input type="hidden" name="abt-reflist-state" value={this.props.store.persistent} />;
    }
}
