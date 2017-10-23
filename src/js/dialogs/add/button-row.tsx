import { IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { colors, shadows } from 'utils/styles';

import Button from 'components/button';
import ToggleSwitch from 'components/toggle-switch';

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
            <div className="btn-row">
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
                <span className="separator" />
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
                <style jsx>{`
                    .btn-row {
                        display: flex;
                        padding: 10px;
                        align-items: center;
                        background: ${colors.light_gray};
                        box-shadow: ${shadows.top_border};
                        border-radius: 0 0 2px 2px;
                        margin: 0;
                        justify-content: space-between;
                    }
                    span {
                        border-right: solid 2px ${colors.border};
                        height: 30px;
                        display: inline-block;
                    }
                `}</style>
            </div>
        );
    }
}
