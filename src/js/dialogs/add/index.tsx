import { action, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { DialogProps, DialogType } from 'dialogs';
import Store from 'stores/ui/add-dialog';
import { getFromISBN, getFromURL } from 'utils/resolvers';
import { AutociteKind } from './autocite';

import Spinner from 'components/spinner';
import Container from 'dialogs/components/container';
import PubmedDialog from 'dialogs/pubmed';
import ButtonRow from './button-row';
import IdentifierInput from './identifier-input';
import ManualInput from './manual-input';

@observer
export default class AddDialog extends React.Component<DialogProps> {
    static readonly pubmedLabel = top.ABT.i18n.dialogs.pubmed.title;

    /** Reference to the identifier input field in `IdentifierInput`. Used for focus/refocus */
    identifierInputField: HTMLInputElement | null | undefined;

    store = new Store('webpage');

    @action
    appendPMID = (pmid: string): void => {
        const ids = new Set(
            this.store.identifierList
                .split(',')
                .map(i => i.trim())
                .concat(pmid)
                .filter(Boolean),
        );
        this.store.identifierList = Array.from(ids).join(', ');
        this.store.currentDialog = DialogType.NONE;
        if (this.identifierInputField) this.identifierInputField.focus();
    };

    @action
    closePubmedDialog = (): void => {
        this.props.focusTrapPaused!.set(false);
        this.store.currentDialog = DialogType.NONE;
    };

    @action
    openPubmedDialog = (): void => {
        this.props.focusTrapPaused!.set(true);
        this.store.currentDialog = DialogType.PUBMED;
    };

    @action
    setErrorMessage = (msg?: string): void => {
        this.store.errorMessage = msg || '';
    };

    @action
    toggleLoadingState = (state?: boolean): void => {
        this.store.isLoading = state ? state : !this.store.isLoading;
    };

    captureInputField = (el: HTMLInputElement | null): void => {
        this.identifierInputField = el;
        if (el) el.focus();
    };

    handleAutocite = async (kind: AutociteKind, query: string): Promise<void> => {
        this.toggleLoadingState();
        try {
            const data =
                kind === 'webpage' ? await getFromURL(query) : await getFromISBN(query, kind);
            runInAction(() => this.store.data.merge(data));
        } catch (e) {
            this.setErrorMessage(e.message);
        }
        this.toggleLoadingState();
    };

    handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        this.props.onSubmit(this.store.payload);
    };

    render(): JSX.Element {
        return (
            <>
                {this.store.isLoading && <Spinner overlay size="40px" height="calc(100% - 40px)" />}
                {this.store.currentDialog === DialogType.PUBMED && (
                    <Container
                        overlayOpacity={0.2}
                        title={AddDialog.pubmedLabel}
                        onClose={this.closePubmedDialog}
                    >
                        <PubmedDialog onSubmit={this.appendPMID} />
                    </Container>
                )}
                <form id="add-reference" onSubmit={this.handleSubmit}>
                    {!this.store.addManually && (
                        <IdentifierInput fieldRef={this.captureInputField} store={this.store} />
                    )}
                    {this.store.addManually && (
                        <ManualInput store={this.store} onAutoCite={this.handleAutocite} />
                    )}
                </form>
                <ButtonRow onSearchPubmedClick={this.openPubmedDialog} store={this.store} />
            </>
        );
    }
}
