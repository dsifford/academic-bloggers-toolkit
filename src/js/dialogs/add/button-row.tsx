import { IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import Button from 'components/button';
import ToggleSwitch from 'components/toggle-switch';
import ActionBar from 'dialogs/components/action-bar';

interface Props {
    /** Loading state of parent. Used to control disabled state of toggle switch. */
    readonly isLoading: boolean;
    /** Describes whether or not ManualEntryContainer is currently active */
    addManually: IObservableValue<boolean>;
    /** Describes the checked state of the toggle switch */
    attachInline: IObservableValue<boolean>;
    /** Function to call when attach inline toggle switch is toggled */
    onAttachInlineToggle(): void;
    /** Function to call when Search Pubmed button is clicked */
    onSearchPubmedClick(): void;
    /** Function to call when Add Manually button is clicked */
    onToggleManual(e: React.MouseEvent<HTMLButtonElement>): void;
}

@observer
export default class ButtonRow extends React.Component<Props> {
    static readonly labels = top.ABT.i18n.dialogs.add.buttonRow;
    render(): JSX.Element {
        const {
            addManually,
            attachInline,
            isLoading,
            onAttachInlineToggle,
            onSearchPubmedClick,
            onToggleManual,
        } = this.props;
        return (
            <ActionBar>
                <Button
                    flat
                    focusable
                    label={
                        addManually.get()
                            ? ButtonRow.labels.addWithIdentifier
                            : ButtonRow.labels.addManually
                    }
                    onClick={onToggleManual}
                />
                <Button
                    flat
                    focusable
                    disabled={addManually.get()}
                    label={ButtonRow.labels.searchPubmed}
                    onClick={onSearchPubmedClick}
                />
                <ActionBar.Separator />
                <ToggleSwitch
                    disabled={isLoading}
                    onChange={onAttachInlineToggle}
                    tooltip={{
                        text: ButtonRow.labels.insertInline,
                        position: 'left',
                    }}
                    checked={attachInline.get()}
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
