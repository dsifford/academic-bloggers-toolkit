import { action } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';

import { DialogDefaultProps, DialogProps, DialogType } from '_legacy/dialogs';
import Store from '_legacy/stores/ui/add-dialog';

import Spinner from '_legacy/components/spinner';
import Container from '_legacy/dialogs/components/container';
import PubmedDialog from '_legacy/dialogs/pubmed';

import ButtonRow from './button-row';
import IdentifierInput from './identifier-input';
import ManualInput from './manual-input';

type Props = DialogProps & DialogDefaultProps;

@observer
export default class AddDialog extends React.Component<DialogProps> {
    static readonly pubmedLabel = top.ABT.i18n.dialogs.pubmed.title;

    /**
     * Reference to the identifier input field in `IdentifierInput`.
     * Used for focus/refocus.
     */
    identifierInputField: HTMLInputElement | null = null;

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
        this.captureInputField(this.identifierInputField);
    };

    @action
    closePubmedDialog = (): void => {
        (this.props as Props).toggleFocusTrap();
        this.store.currentDialog = DialogType.NONE;
    };

    @action
    openPubmedDialog = (): void => {
        (this.props as Props).toggleFocusTrap();
        this.store.currentDialog = DialogType.PUBMED;
    };

    captureInputField = (el: HTMLInputElement | null): void => {
        this.identifierInputField = el;
        el && el.focus();
    };

    handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        this.props.onSubmit(this.store.payload);
    };

    render(): JSX.Element {
        return (
            <>
                {this.store.isLoading && (
                    <Spinner overlay size="40px" height="calc(100% - 40px)" />
                )}
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
                        <IdentifierInput
                            fieldRef={this.captureInputField}
                            store={this.store}
                        />
                    )}
                    {this.store.addManually && (
                        <ManualInput store={this.store} />
                    )}
                </form>
                <ButtonRow
                    onSearchPubmedClick={this.openPubmedDialog}
                    store={this.store}
                />
            </>
        );
    }
}
