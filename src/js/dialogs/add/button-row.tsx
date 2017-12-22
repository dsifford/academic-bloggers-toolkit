import { action } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import Store from 'stores/ui/add-dialog';

import Button from 'components/button';
import ToggleSwitch from 'components/toggle-switch';
import ActionBar from 'dialogs/components/action-bar';

interface Props {
    store: Store;
    /** Function to call when Search Pubmed button is clicked */
    onSearchPubmedClick(): void;
}

@observer
export default class ButtonRow extends React.Component<Props> {
    static readonly labels = top.ABT.i18n.dialogs.add.buttonRow;

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
        return (
            <ActionBar>
                <Button
                    flat
                    focusable
                    label={
                        store.addManually
                            ? ButtonRow.labels.addWithIdentifier
                            : ButtonRow.labels.addManually
                    }
                    onClick={this.toggleAddManual}
                />
                <Button
                    flat
                    focusable
                    disabled={store.addManually}
                    label={ButtonRow.labels.searchPubmed}
                    onClick={onSearchPubmedClick}
                />
                <ActionBar.Separator />
                <ToggleSwitch
                    disabled={store.isLoading}
                    onChange={this.toggleAttachInline}
                    tooltip={{
                        text: ButtonRow.labels.insertInline,
                        position: 'left',
                    }}
                    checked={store.attachInline}
                />
                <Button
                    primary
                    focusable
                    form="add-reference"
                    type="submit"
                    label={ButtonRow.labels.addReference}
                />
            </ActionBar>
        );
    }
}
