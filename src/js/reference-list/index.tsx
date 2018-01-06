import { stripIndents } from 'common-tags';
import { decode } from 'he';
import { action, observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { getRemoteData, parseManualData } from 'core/api';
import { Processor } from 'core/processor';
import EditorDriver, { EditorDriverConstructor } from 'drivers/base';
import Store from 'stores/data';
import UIStore from 'stores/ui/reference-list';
import { MenuActionType } from 'utils/constants';
import DevTools from 'utils/devtools';

import Button from 'components/button';
import Spinner from 'components/spinner';
import Dialog, { DialogType } from 'dialogs';
import ItemList from 'reference-list/components/item-list';
import Menu, { MenuAction } from 'reference-list/components/menu';

import * as styles from './reference-list.scss';

const Storage = observer(({ data }: { data: string }): JSX.Element => (
    <input type="hidden" name="abt-reflist-state" value={data} />
));

interface Props {
    editor: Promise<typeof EditorDriver & EditorDriverConstructor>;
    store: Store;
    loading?: boolean;
}

interface DefaultProps {
    loading: boolean;
}

@observer
export default class ReferenceList extends React.Component<Props> {
    static readonly errors = top.ABT.i18n.errors;
    static readonly labels = top.ABT.i18n.reference_list;
    static defaultProps: DefaultProps = {
        loading: true,
    };

    /**
     * A boxed observable that can contain anything that a dialog might need.
     */
    dialogProps = observable.box<any>();

    /**
     * The editor instance
     */
    editor: EditorDriver;

    /**
     * The CSLProcessor instance
     */
    processor: Processor;

    ui: UIStore;

    constructor(props: Props & DefaultProps) {
        super(props);
        this.ui = new UIStore(props.loading);
        this.processor = new Processor(props.store);
        this.init().catch(e => {
            Rollbar.error(e.message, e);
            throw e;
        });

        /** React to list toggles */
        reaction(
            () => [
                this.ui.cited.isOpen,
                this.ui.uncited.isOpen,
                this.ui.menuOpen,
            ],
            this.handleScroll,
            { fireImmediately: false, delay: 200 },
        );

        /** React to list pin/unpin */
        reaction(
            () => this.ui.pinned,
            () => {
                document.getElementById('abt-reflist')!.classList.toggle(
                    'fixed',
                );
                this.handleScroll();
            },
        );

        /** React to cited list changes */
        reaction(
            () => this.props.store.citations.citedIDs.length,
            this.handleScroll,
            {
                fireImmediately: false,
                delay: 200,
            },
        );
    }

    componentDidMount(): void {
        addEventListener(
            EditorDriver.events.AVAILABLE,
            this.toggleLoading.bind(this, false),
        );
        addEventListener(
            EditorDriver.events.UNAVAILABLE,
            this.toggleLoading.bind(this, true),
        );
        addEventListener(
            EditorDriver.events.ADD_REFERENCE,
            this.openDialog.bind(this, DialogType.ADD),
        );
        addEventListener(
            EditorDriver.events.TOGGLE_PINNED,
            this.togglePinned.bind(this),
        );
        addEventListener(
            EditorDriver.events.CITATION_DELETED,
            this.handleMenuSelection.bind(this, {
                kind: MenuActionType.REFRESH_PROCESSOR,
            }),
        );
        addEventListener(EditorDriver.events.UNDO, this.handleUndo.bind(this));
        document.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount(): void {
        removeEventListener(
            EditorDriver.events.UNAVAILABLE,
            this.toggleLoading.bind(this, true),
        );
        removeEventListener(
            EditorDriver.events.AVAILABLE,
            this.toggleLoading.bind(this, false),
        );
        removeEventListener(
            EditorDriver.events.ADD_REFERENCE,
            this.openDialog.bind(this, DialogType.ADD),
        );
        removeEventListener(
            EditorDriver.events.TOGGLE_PINNED,
            this.togglePinned.bind(this),
        );
        removeEventListener(
            EditorDriver.events.CITATION_DELETED,
            this.handleMenuSelection.bind(this, {
                kind: MenuActionType.REFRESH_PROCESSOR,
            }),
        );
        removeEventListener(
            EditorDriver.events.UNDO,
            this.handleUndo.bind(this),
        );
        document.removeEventListener('scroll', this.handleScroll);
    }

    init = async (): Promise<void> => {
        this.editor = await this.props.editor.then(driver => new driver());
        await this.editor.init();
        await this.initProcessor();
        this.toggleLoading(false);
    };

    @action
    addReferences = async (payload: any): Promise<void> => {
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
            Rollbar.error(e.message, e);
            this.editor.alert(stripIndents`
                ${ReferenceList.errors.unexpected.message}

                ${e.name}: ${e.message}

                ${ReferenceList.errors.unexpected.report_instructions}
            `);
            return;
        }
        if (data.length === 0) return;
        this.props.store.citations.addItems(data);
        return payload.attachInline
            ? this.insertInlineCitation(undefined, data)
            : void 0;
    };

    @action
    clearSelection = (): void => {
        this.ui.selected.clear();
    };

    @action
    deleteCitations = (): void => {
        if (this.ui.selected.length === 0) return;
        this.editor.setLoadingState(true);
        const toRemove = this.props.store.citations.removeItems(
            this.ui.selected.slice(),
        );
        this.editor.removeItems(toRemove);
        this.clearSelection();
        this.initProcessor();
    };

    @action
    editReference = (referenceId: string): void => {
        const data = this.props.store.citations.CSL.get(referenceId)!;
        this.dialogProps.set(data);
        this.ui.currentDialog = DialogType.EDIT;
    };

    @action
    handleDialogSubmit = (data?: any): void => {
        if (data) {
            switch (this.ui.currentDialog) {
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
        }
        this.ui.currentDialog = DialogType.NONE;
    };

    @action
    handleMenuSelection = (menuAction: MenuAction): void => {
        this.ui.menuOpen = false;
        switch (menuAction.kind) {
            case MenuActionType.CHANGE_STYLE:
                this.props.store.citationStyle.style = menuAction.data;
                this.initProcessor();
                return;
            case MenuActionType.OPEN_IMPORT_DIALOG:
                this.ui.currentDialog = DialogType.IMPORT;
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

    @action.bound
    openDialog(
        e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement> | DialogType,
    ): void {
        if (typeof e === 'string') {
            this.ui.currentDialog = e;
            return;
        }
        const dialog: DialogType =
            (e.currentTarget.dataset.dialog as DialogType | undefined) ||
            DialogType.NONE;
        this.ui.currentDialog = dialog;
    }

    @action
    reset = (): void => {
        this.editor.setLoadingState(true);
        this.clearSelection();
        this.ui.uncited.isOpen = false;
        this.ui.cited.isOpen = true;
        this.props.store.reset();
        this.editor.reset();
        this.initProcessor();
    };

    @action
    toggleLoading = (loadState?: boolean): void => {
        this.ui.loading =
            loadState !== undefined ? loadState : !this.ui.loading;
    };

    @action
    toggleMenu = (): void => {
        this.ui.menuOpen = !this.ui.menuOpen;
    };

    @action
    togglePinned = (): void => {
        this.ui.pinned = !this.ui.pinned;
    };

    initProcessor = async (): Promise<void> => {
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
        } catch (e) {
            Rollbar.error(e.message, e);
            this.editor.alert(stripIndents`
                ${ReferenceList.errors.unexpected.message}

                ${e.name}: ${e.message}

                ${ReferenceList.errors.unexpected.report_instructions}
            `);
        }
        this.editor.setLoadingState(false);
    };

    render(): JSX.Element {
        if (this.ui.loading) {
            return (
                <div className={styles.loading}>
                    <Spinner size="40px" height="52px" bgColor="#f5f5f5" />
                    <Storage data={this.props.store.persistent} />
                </div>
            );
        }

        return (
            <>
                <DevTools position={{ left: 50, top: 40 }} />
                <Dialog
                    data={this.dialogProps.get()}
                    currentDialog={this.ui.currentDialog}
                    onSubmit={this.handleDialogSubmit}
                />
                <Storage data={this.props.store.persistent} />
                <div className={styles.panel}>
                    <Button
                        flat
                        label={ReferenceList.labels.tooltips.insert}
                        icon="migrate"
                        disabled={this.ui.selected.length === 0}
                        onClick={this.insertInlineCitation}
                        tooltip={{
                            text: ReferenceList.labels.tooltips.insert,
                            position: 'bottom',
                        }}
                    />
                    <Button
                        flat
                        data-dialog={DialogType.ADD}
                        disabled={this.ui.selected.length !== 0}
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
                        disabled={this.ui.selected.length === 0}
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
                        icon={this.ui.pinned ? 'sticky' : 'admin-post'}
                        onClick={this.togglePinned}
                        tooltip={{
                            text: ReferenceList.labels.tooltips.pin,
                            position: 'bottom',
                        }}
                    />
                    <Button
                        flat
                        aria-haspopup={true}
                        aria-expanded={this.ui.menuOpen}
                        label={ReferenceList.labels.menu.toggle_label}
                        icon={this.ui.menuOpen ? 'no-alt' : 'menu'}
                        onClick={this.toggleMenu}
                    />
                </div>
                {this.ui.menuOpen && (
                    <Menu
                        data={this.props.store}
                        ui={this.ui}
                        onSubmit={this.handleMenuSelection}
                    />
                )}
                {this.props.store.citations.cited.length > 0 && (
                    <ItemList
                        id="cited"
                        CSL={this.props.store.citations.CSL}
                        items={this.props.store.citations.cited}
                        onEditReference={this.editReference}
                        ui={this.ui}
                    >
                        {ReferenceList.labels.cited_items}
                    </ItemList>
                )}
                {this.props.store.citations.uncited.length > 0 && (
                    <ItemList
                        id="uncited"
                        CSL={this.props.store.citations.CSL}
                        items={this.props.store.citations.uncited}
                        onEditReference={this.editReference}
                        ui={this.ui}
                    >
                        {ReferenceList.labels.uncited_items}
                    </ItemList>
                )}
            </>
        );
    }

    // prettier-ignore
    insertInlineCitation = (e?: React.MouseEvent<HTMLButtonElement>, d: CSL.Data[] | Event = []): void => {
        if (e) {
            e.preventDefault();
        }
        this.editor.setLoadingState(true);

        let data: CSL.Data[] = [
            ...this.ui.selected.map(id => this.props.store.citations.CSL.get(id)!),
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
            Rollbar.error(e.message, e);
            this.editor.alert(stripIndents`
                ${ReferenceList.errors.unexpected.message}

                ${e.name}: ${e.message}

                ${ReferenceList.errors.unexpected.report_instructions}
            `);
        }

        this.editor.setLoadingState(false);
        this.clearSelection();
    };

    insertStaticBibliography = async (): Promise<void> => {
        let data: CSL.Data[] = this.ui.selected.map(
            id => this.props.store.citations.CSL.get(id)!,
        );

        const selectionHasReferences = this.editor.selection.match(
            /^<div.*? class="abt-static-bib.+? data-reflist="(.+?)"[\s\S]+<\/div>$/,
        );
        if (selectionHasReferences && selectionHasReferences[1]) {
            const selectionIds: string[] = JSON.parse(
                decode(selectionHasReferences[1]),
            );
            data = [
                ...data,
                ...selectionIds.map(
                    id => this.props.store.citations.CSL.get(id)!,
                ),
            ];
        }

        try {
            const bibliography = await this.processor.createStaticBibliography(
                data,
            );
            this.clearSelection();
            this.editor.setBibliography(
                this.props.store.bibOptions,
                bibliography,
                true,
            );
        } catch (e) {
            Rollbar.error(e.message, e);
            this.editor.alert(stripIndents`
                ${ReferenceList.errors.unexpected.message}

                ${e.name}: ${e.message}

                ${ReferenceList.errors.unexpected.report_instructions}
            `);
        }
    };

    @action
    private handleScroll = (): void => {
        const list = document.getElementById('abt-reflist')!;

        if (!this.ui.pinned) {
            this.ui.cited.maxHeight = '400px';
            this.ui.uncited.maxHeight = '400px';
            list.style.top = '';
            return;
        }

        const bothOpen: boolean =
            this.ui.cited.isOpen &&
            this.ui.uncited.isOpen &&
            this.props.store.citations.cited.length > 0 &&
            this.props.store.citations.uncited.length > 0;

        const scrollpos = Math.ceil(window.scrollY);

        /**
         * Offset from top of reference list to top of viewport.
         */
        const topOffset =
            scrollpos > 134 ? 55 : scrollpos === 0 ? 93 : 93 - scrollpos / 3;

        /**
         * Vertical space that is already allocated.
         * 180 = all static, non-participating sections of the list + padding
         * 84 = vertical height of menu when open
         */
        const listOffset = 180 + topOffset + (this.ui.menuOpen ? 84 : 0);
        const remainingHeight = window.innerHeight - listOffset;

        list.style.top = `${topOffset}px`;
        if (!bothOpen) {
            this.ui.cited.maxHeight = `calc(100vh - ${listOffset}px)`;
            this.ui.uncited.maxHeight = `calc(100vh - ${listOffset}px)`;
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

        this.ui.cited.maxHeight = `${citedHeight}px`;
        this.ui.uncited.maxHeight = `${uncitedHeight}px`;
    };

    private handleUndo = (): void => {
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
