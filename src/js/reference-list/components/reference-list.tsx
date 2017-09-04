import { stripIndents } from 'common-tags';
import { decode } from 'he';
import { action, observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import EditorDriver, { EditorDriverConstructor } from 'drivers/base';
import { DialogType, MenuActionType } from 'utils/constants';
import { CSLProcessor } from 'utils/CSLProcessor';
import DevTools from 'utils/devtools';
import { colors, shadows } from 'utils/styles';
import { getRemoteData, parseManualData } from '../api';
import Store from '../store';

import Button from 'components/button';
import Spinner from 'components/spinner';
import Dialog from 'dialogs';
import ItemList from './item-list';
import Menu, { MenuAction } from './menu';

const DevTool = DevTools();

interface Props {
    editor: Promise<typeof EditorDriver & EditorDriverConstructor>;
    store: Store;
}

@observer
export default class ReferenceList extends React.Component<Props> {
    static readonly errors = top.ABT_i18n.errors;
    static readonly labels = top.ABT_i18n.referenceList;

    /**
     * The id of the currently opened modal
     */
    currentDialog = observable(DialogType.NONE);

    /**
     * A boxed observable that can contain anything that a dialog might need.
     */
    dialogProps = observable.box<any>();

    /**
     * The editor instance
     */
    editor: EditorDriver;

    /**
     * Toggles the main loading spinner for the Reference List. Loading is true
     * until the editor driver's `init()` method resolves and also during any
     * circumstance where the editor becomes hidden or unavailable.
     */
    loading = observable(true);

    /**
     * The CSLProcessor instance
     */
    processor: CSLProcessor;

    /**
     * Observable array of selected item IDs
     */
    selected = observable<string>([]);

    /**
     * UI State
     */
    ui = {
        loading: observable(true),
        pinned: observable(false),
        menuOpen: observable(false),
        cited: {
            isOpen: observable(true),
            maxHeight: observable('400px'),
        },
        uncited: {
            isOpen: observable(false),
            maxHeight: observable('400px'),
        },
    };

    constructor(props: Props) {
        super(props);
        this.processor = new CSLProcessor(this.props.store);
        this.init().catch(e => {
            Rollbar.error(e.message, e);
            throw e;
        });

        /** React to list toggles */
        reaction(
            () => [
                this.ui.cited.isOpen.get(),
                this.ui.uncited.isOpen.get(),
                this.ui.menuOpen.get(),
            ],
            this.handleScroll,
            { fireImmediately: false, delay: 200 },
        );

        /** React to list pin/unpin */
        reaction(
            () => this.ui.pinned.get(),
            () => {
                document.getElementById('abt-reflist')!.classList.toggle('fixed');
                this.handleScroll();
            },
        );

        /** React to cited list changes */
        reaction(() => this.props.store.citations.citedIDs.length, this.handleScroll, {
            fireImmediately: false,
            delay: 200,
        });
    }

    componentDidMount() {
        addEventListener(EditorDriver.events.AVAILABLE, this.toggleLoading.bind(this, false));
        addEventListener(EditorDriver.events.UNAVAILABLE, this.toggleLoading.bind(this, true));
        addEventListener(EditorDriver.events.ADD_REFERENCE, this.openDialog.bind(this, 'ADD'));
        addEventListener(EditorDriver.events.TOGGLE_PINNED, this.togglePinned.bind(this));
        addEventListener(
            EditorDriver.events.CITATION_DELETED,
            this.handleMenuSelection.bind(this, {
                kind: MenuActionType.REFRESH_PROCESSOR,
            }),
        );
        addEventListener(EditorDriver.events.UNDO, this.handleUndo.bind(this));
        document.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        removeEventListener(EditorDriver.events.UNAVAILABLE, this.toggleLoading.bind(this, true));
        removeEventListener(EditorDriver.events.AVAILABLE, this.toggleLoading.bind(this, false));
        removeEventListener(EditorDriver.events.ADD_REFERENCE, this.openDialog.bind(this, 'ADD'));
        removeEventListener(EditorDriver.events.TOGGLE_PINNED, this.togglePinned.bind(this));
        removeEventListener(
            EditorDriver.events.CITATION_DELETED,
            this.handleMenuSelection.bind(this, {
                kind: MenuActionType.REFRESH_PROCESSOR,
            }),
        );
        removeEventListener(EditorDriver.events.UNDO, this.handleUndo.bind(this));
        document.removeEventListener('scroll', this.handleScroll);
    }

    init = async () => {
        this.editor = await this.props.editor.then(driver => new driver());
        await this.editor.init();
        await this.initProcessor();
        this.toggleLoading(false);
    };

    @action
    addReferences = async (payload: any) => {
        let data: CSL.Data[];
        let err: string;
        try {
            [data, err] = payload.addManually
                ? parseManualData(payload)
                : await getRemoteData(payload.identifierList);
            if (err) {
                this.editor.alert(err);
            }
        } catch (e) {
            Rollbar.error('ReferenceList.tsx -> addReferences', e);
            this.editor.alert(stripIndents`
                ${ReferenceList.errors.unexpected.message}

                ${e.name}: ${e.message}

                ${ReferenceList.errors.unexpected.reportInstructions}
            `);
            return;
        }
        if (data.length === 0) return;
        data = this.props.store.citations.addItems(data);
        return payload.attachInline ? this.insertInlineCitation(undefined, data) : void 0;
    };

    @action
    clearSelection = () => {
        this.selected.clear();
    };

    @action
    deleteCitations = () => {
        if (this.selected.length === 0) return;
        this.editor.setLoadingState(true);
        const toRemove = this.props.store.citations.removeItems(this.selected.slice());
        this.editor.removeItems(toRemove);
        this.clearSelection();
        this.initProcessor();
    };

    @action
    editReference = (referenceId: string) => {
        const data = this.props.store.citations.CSL.get(referenceId)!;
        this.dialogProps.set(data);
        this.currentDialog.set(DialogType.EDIT);
    };

    @action
    handleDialogSubmit = (data: any) => {
        switch (this.currentDialog.get()) {
            case DialogType.ADD:
                this.addReferences(data);
                break;
            case DialogType.IMPORT:
                this.props.store.citations.addItems(data);
                break;
            case DialogType.EDIT:
                this.props.store.citations.CSL.set(data.id, data);
                this.initProcessor();
        }
        this.currentDialog.set(DialogType.NONE);
    };

    @action
    handleMenuSelection = (menuAction: MenuAction) => {
        switch (menuAction.kind) {
            case MenuActionType.CHANGE_STYLE:
                this.props.store.setStyle(menuAction.data);
                this.initProcessor();
                return;
            case MenuActionType.OPEN_IMPORT_DIALOG:
                this.currentDialog.set(DialogType.IMPORT);
                return;
            case MenuActionType.REFRESH_PROCESSOR:
                const IDs = this.editor.citationIds;
                this.props.store.citations.pruneOrphanedCitations(IDs);
                this.initProcessor();
                return;
            case MenuActionType.DESTROY_PROCESSOR: {
                this.reset();
                return;
            }
            case MenuActionType.INSERT_STATIC_BIBLIOGRAPHY: {
                this.insertStaticBibliography();
                return;
            }
            default:
                return;
        }
    };

    @action
    openDialog = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement> | string) => {
        if (typeof e === 'string') {
            return this.currentDialog.set(e);
        }
        const dialog = e.currentTarget.dataset.dialog || '';
        this.currentDialog.set(dialog);
    };

    @action
    reset = () => {
        this.editor.setLoadingState(true);
        this.clearSelection();
        this.ui.uncited.isOpen.set(false);
        this.ui.cited.isOpen.set(true);
        this.props.store.reset();
        this.editor.reset();
        this.initProcessor();
    };

    @action
    toggleLoading = (loadState?: boolean) => {
        this.loading.set(loadState !== undefined ? loadState : !this.loading.get());
    };

    @action
    toggleMenu = () => {
        this.ui.menuOpen.set(!this.ui.menuOpen.get());
    };

    @action
    togglePinned = () => {
        this.ui.pinned.set(!this.ui.pinned.get());
    };

    initProcessor = async () => {
        this.editor.setLoadingState(true);
        try {
            const clusters = await this.processor.init();
            this.editor.composeCitations(
                clusters,
                this.props.store.citations.citationByIndex,
                this.processor.citeproc.opt.xclass,
            );
            this.editor.setBibliography(
                this.props.store.bibOptions,
                this.processor.makeBibliography(),
            );
            this.clearSelection();
        } catch (err) {
            Rollbar.error('ReferenceLissett.tsx -> initProcessor', err);
            this.editor.alert(stripIndents`
                ${ReferenceList.errors.unexpected.message}

                ${err.name}: ${err.message}

                ${ReferenceList.errors.unexpected.reportInstructions}
            `);
        }
        this.editor.setLoadingState(false);
    };

    render() {
        if (this.loading.get()) {
            return (
                <div>
                    <Spinner size="40px" height="52px" bgColor="#f5f5f5" />
                    <StorageField store={this.props.store} />
                    <style jsx>{`
                        div {
                            box-shadow: ${shadows.depth_1}, ${shadows.top_border};
                        }
                    `}</style>
                </div>
            );
        }

        return (
            <div>
                <DevTool position={{ left: 50, top: 40 }} />
                <Dialog
                    data={this.dialogProps.get()}
                    currentDialog={this.currentDialog}
                    onSubmit={this.handleDialogSubmit}
                />
                <StorageField store={this.props.store} />
                <div className="panel">
                    <Button
                        flat
                        label={ReferenceList.labels.tooltips.insert}
                        icon="migrate"
                        disabled={this.selected.length === 0}
                        onClick={this.insertInlineCitation}
                        tooltip={{
                            text: ReferenceList.labels.tooltips.insert,
                            position: 'bottom',
                        }}
                    />
                    <Button
                        flat
                        data-dialog="ADD"
                        disabled={this.selected.length !== 0}
                        icon="plus"
                        label={ReferenceList.labels.tooltips.add}
                        onClick={this.openDialog}
                        tooltip={{
                            text: ReferenceList.labels.tooltips.add,
                            position: 'bottom',
                        }}
                    />
                    <Button
                        flat
                        disabled={this.selected.length === 0}
                        icon="minus"
                        label={ReferenceList.labels.tooltips.remove}
                        onClick={this.deleteCitations}
                        tooltip={{
                            text: ReferenceList.labels.tooltips.remove,
                            position: 'bottom',
                        }}
                    />
                    <Button
                        flat
                        label={ReferenceList.labels.tooltips.pin}
                        icon={this.ui.pinned.get() ? 'sticky' : 'admin-post'}
                        onClick={this.togglePinned}
                        tooltip={{
                            text: ReferenceList.labels.tooltips.pin,
                            position: 'bottom',
                        }}
                    />
                    <Button
                        flat
                        aria-haspopup={true}
                        aria-expanded={this.ui.menuOpen.get()}
                        label={ReferenceList.labels.menu.toggleLabel}
                        icon={this.ui.menuOpen.get() ? 'no-alt' : 'menu'}
                        onClick={this.toggleMenu}
                    />
                </div>
                <Menu
                    isOpen={this.ui.menuOpen}
                    itemsSelected={this.selected.length > 0}
                    cslStyle={this.props.store.citationStyle}
                    onSubmit={this.handleMenuSelection}
                />
                {this.props.store.citations.cited.length > 0 && (
                    <ItemList
                        id="cited"
                        CSL={this.props.store.citations.CSL}
                        items={this.props.store.citations.cited}
                        onEditReference={this.editReference}
                        selectedItems={this.selected}
                        ui={this.ui}
                        children={ReferenceList.labels.citedItems}
                    />
                )}
                {this.props.store.citations.uncited.length > 0 && (
                    <ItemList
                        id="uncited"
                        CSL={this.props.store.citations.CSL}
                        items={this.props.store.citations.uncited}
                        onEditReference={this.editReference}
                        selectedItems={this.selected}
                        ui={this.ui}
                        children={ReferenceList.labels.uncitedItems}
                    />
                )}
                <style jsx>{`
                    .panel {
                        display: flex;
                        width: 100%;
                        padding: 8px 0;
                        background: ${colors.light_gray};
                        box-shadow: ${shadows.depth_1}, ${shadows.top_border};
                        justify-content: space-around;
                    }
                `}</style>
            </div>
        );
    }

    // prettier-ignore
    insertInlineCitation = (e?: React.MouseEvent<HTMLButtonElement>, d: CSL.Data[] | Event = []) => {
        if (e) {
            e.preventDefault();
        }
        this.editor.setLoadingState(true);

        let data: CSL.Data[] = [
            ...this.selected.map(id => this.props.store.citations.CSL.get(id)!),
            ...(d instanceof Event ? [] : d),
        ]

        // Checks to see if there is a inline citation selected. If so, extract the ids from it and
        // push the associated CSL from the store to data.
        const selectionHasReferences = this.editor.selection.match(
            /<span.+class=".*abt-citation.+? data-reflist="(.+?)".+<\/span>/
        );
        if (selectionHasReferences && selectionHasReferences[1]) {
            const selectionIds: string[] = JSON.parse(
                decode(selectionHasReferences[1])
            )
            data = [
                ...data,
                ...selectionIds.map(id => this.props.store.citations.CSL.get(id)!),
            ]
        }

        try {
            const { itemsPreceding, itemsFollowing } = this.editor.relativeCitationPositions;
            const citation = this.processor.prepareInlineCitationData(data);
            const clusters = this.processor.processCitationCluster(
                citation,
                itemsPreceding,
                itemsFollowing
            );
            this.editor.composeCitations(clusters, this.props.store.citations.citationByIndex, this.processor.citeproc.opt.xclass);
            this.editor.setBibliography(this.props.store.bibOptions, this.processor.makeBibliography());
        } catch (e) {
            Rollbar.error('ReferenceList.tsx -> insertInlineCitation', e);
            this.editor.alert(stripIndents`
                ${ReferenceList.errors.unexpected.message}

                ${e.name}: ${e.message}

                ${ReferenceList.errors.unexpected.reportInstructions}
            `);
        }

        this.editor.setLoadingState(false);
        this.clearSelection();
    };

    insertStaticBibliography = async () => {
        let data: CSL.Data[] = this.selected.map(id => this.props.store.citations.CSL.get(id)!);

        const selectionHasReferences = this.editor.selection.match(
            /^<div.*? class="abt-static-bib.+? data-reflist="(.+?)"[\s\S]+<\/div>$/,
        );
        if (selectionHasReferences && selectionHasReferences[1]) {
            const selectionIds: string[] = JSON.parse(decode(selectionHasReferences[1]));
            data = [...data, ...selectionIds.map(id => this.props.store.citations.CSL.get(id)!)];
        }

        try {
            const bibliography = await this.processor.createStaticBibliography(data);
            this.clearSelection();
            this.editor.setBibliography(this.props.store.bibOptions, bibliography, true);
        } catch (e) {
            Rollbar.error('ReferenceList.tsx -> insertStaticBibliography', e);
            this.editor.alert(stripIndents`
                ${ReferenceList.errors.unexpected.message}

                ${e.name}: ${e.message}

                ${ReferenceList.errors.unexpected.reportInstructions}
            `);
        }
    };

    @action
    private handleScroll = () => {
        const list = document.getElementById('abt-reflist')!;

        if (!this.ui.pinned.get()) {
            this.ui.cited.maxHeight.set('400px');
            this.ui.uncited.maxHeight.set('400px');
            list.style.top = '';
            return;
        }

        const bothOpen: boolean =
            this.ui.cited.isOpen.get() &&
            this.ui.uncited.isOpen.get() &&
            this.props.store.citations.cited.length > 0 &&
            this.props.store.citations.uncited.length > 0;

        const scrollpos = Math.ceil(window.scrollY);

        /**
         * Offset from top of reference list to top of viewport.
         */
        const topOffset = scrollpos > 134 ? 55 : scrollpos === 0 ? 93 : 93 - scrollpos / 3;

        /**
         * Vertical space that is already allocated.
         * 180 = all static, non-participating sections of the list + padding
         * 84 = vertical height of menu when open
         */
        const listOffset = 180 + topOffset + (this.ui.menuOpen.get() ? 84 : 0);
        const remainingHeight = window.innerHeight - listOffset;

        list.style.top = `${topOffset}px`;
        if (!bothOpen) {
            this.ui.cited.maxHeight.set(`calc(100vh - ${listOffset}px)`);
            this.ui.uncited.maxHeight.set(`calc(100vh - ${listOffset}px)`);
            return;
        }

        const cited = document.getElementById('cited');
        const uncited = document.getElementById('uncited');
        let citedHeight = 0;
        let uncitedHeight = 0;

        if (cited) {
            for (const child of Array.from(cited.children)) {
                citedHeight += child.clientHeight + 1;
                if (citedHeight > remainingHeight / 2) {
                    citedHeight = remainingHeight / 2;
                    break;
                }
            }
        }

        if (uncited) {
            for (const child of Array.from(uncited.children)) {
                uncitedHeight += child.clientHeight + 1;
                if (uncitedHeight > remainingHeight / 2) {
                    uncitedHeight = remainingHeight / 2;
                    break;
                }
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

        this.ui.cited.maxHeight.set(`${citedHeight}px`);
        this.ui.uncited.maxHeight.set(`${uncitedHeight}px`);
    };

    private handleUndo = () => {
        const citationsByIndex = this.editor.citationsByIndex.reduce(
            (prev, item) => {
                const citationItems = item.citationItems.map(citation => ({
                    ...citation,
                    item: this.props.store.citations.CSL.get(citation.id),
                }));
                return [
                    ...prev,
                    {
                        ...item,
                        citationItems,
                    },
                ];
            },
            [] as Citeproc.CitationByIndex,
        );
        this.props.store.citations.init(citationsByIndex);
        this.initProcessor();
    };
}

@observer
export class StorageField extends React.Component<{ store: Store }> {
    render() {
        return <input type="hidden" name="abt-reflist-state" value={this.props.store.persistent} />;
    }
}
