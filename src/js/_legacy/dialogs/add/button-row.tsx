import { action } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';

import Store from '_legacy/stores/ui/add-dialog';

import ActionBar from '_legacy/components/action-bar';
import Button from '_legacy/components/button';
import ToggleSwitch from '_legacy/components/toggle-switch';

interface Props {
    store: Store;
    /**
     * Function to call when Search Pubmed button is clicked
     */
    onSearchPubmedClick(): void;
}

@observer
export default class ButtonRow extends React.Component<Props> {
    static readonly labels = top.ABT.i18n.dialogs.add.button_row;

    @action
    toggleAddManual = (): void => {
        this.props.store.addManually = !this.props.store.addManually;
        this.props.store.data.init('webpage');
    };

    @action
    toggleAttachInline = (): void => {
        this.props.store.attachInline = !this.props.store.attachInline;
    };

    render(): JSX.Element {
        const { store, onSearchPubmedClick } = this.props;
        const addManuallyText = store.addManually
            ? ButtonRow.labels.add_with_identifier
            : ButtonRow.labels.add_manually;
        return (
            <ActionBar>
                <Button
                    flat
                    focusable
                    label={addManuallyText}
                    onClick={this.toggleAddManual}
                >
                    {addManuallyText}
                </Button>
                <Button
                    flat
                    focusable
                    disabled={store.addManually}
                    label={ButtonRow.labels.search_pubmed}
                    onClick={onSearchPubmedClick}
                >
                    {ButtonRow.labels.search_pubmed}
                </Button>
                <ActionBar.Separator />
                <ToggleSwitch
                    disabled={store.isLoading}
                    onChange={this.toggleAttachInline}
                    tooltip={{
                        text: ButtonRow.labels.insert_inline,
                        position: 'left',
                    }}
                    checked={store.attachInline}
                />
                <Button
                    primary
                    focusable
                    form="add-reference"
                    type="submit"
                    label={ButtonRow.labels.add_reference}
                >
                    {ButtonRow.labels.add_reference}
                </Button>
            </ActionBar>
        );
    }
}
