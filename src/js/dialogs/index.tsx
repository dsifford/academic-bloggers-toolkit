import { observer } from 'mobx-react';
import * as React from 'react';

import Container from './components/container';

import AddDialog from './add';
import EditDialog from './edit';
import ImportDialog from './import';

export enum DialogType {
    ADD = 'ADD',
    EDIT = 'EDIT',
    IMPORT = 'IMPORT',
    PUBMED = 'PUBMED',
    NONE = '',
}

export interface DialogProps {
    /** Callback to be called when dialog is submitted */
    onSubmit(data: any): void;
    /**
     * Provided automatically by `Container`. Toggles the paused state of the
     * focus trap
     */
    toggleFocusTrap?(): void;
}

export interface DialogDefaultProps {
    /**
     * Provided automatically by `Container`. Toggles the paused state of the
     * focus trap
     */
    toggleFocusTrap(): void;
}

interface Props extends DialogProps {
    currentDialog: DialogType;
    data?: CSL.Data;
}

@observer
export default class DialogRouter extends React.Component<Props> {
    static labels = top.ABT.i18n.dialogs;
    close = (): void => {
        this.props.onSubmit(false);
    };
    render(): JSX.Element | null {
        const { currentDialog, data, onSubmit } = this.props;
        switch (currentDialog) {
            case DialogType.ADD:
                return (
                    <Container title={DialogRouter.labels.add.title} onClose={this.close}>
                        <AddDialog onSubmit={onSubmit} />
                    </Container>
                );
            case DialogType.EDIT:
                return (
                    <Container title={DialogRouter.labels.edit.title} onClose={this.close}>
                        <EditDialog data={data!} onSubmit={onSubmit} />
                    </Container>
                );
            case DialogType.IMPORT:
                return (
                    <Container title={DialogRouter.labels.import.title} onClose={this.close}>
                        <ImportDialog onSubmit={onSubmit} />
                    </Container>
                );
            default:
                return null;
        }
    }
}
