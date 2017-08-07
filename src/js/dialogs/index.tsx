import { IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { DialogType } from 'utils/constants';
import Container from './container';

import AddDialog from './add/';
import EditDialog from './edit/';
import ImportDialog from './import/';

export interface DialogProps {
    /**
     * Provided automatically by `Container`. Describes paused state of dialog's
     * focus trap
     */
    focusTrapPaused?: IObservableValue<boolean>;
    /** Callback to be called when dialog is submitted */
    onSubmit(data: any): void;
}

interface Props extends DialogProps {
    currentDialog: IObservableValue<string>;
    data?: CSL.Data;
}

@observer
export default class DialogRouter extends React.PureComponent<Props> {
    static labels = top.ABT_i18n.dialogs;
    render() {
        const { currentDialog, data, onSubmit } = this.props;
        switch (currentDialog.get()) {
            case DialogType.ADD:
                return (
                    <Container currentDialog={currentDialog} title={DialogRouter.labels.add.title}>
                        <AddDialog onSubmit={onSubmit} />
                    </Container>
                );
            case DialogType.EDIT:
                return (
                    <Container currentDialog={currentDialog} title={DialogRouter.labels.edit.title}>
                        <EditDialog data={data!} onSubmit={onSubmit} />
                    </Container>
                );
            case DialogType.IMPORT:
                return (
                    <Container
                        currentDialog={currentDialog}
                        title={DialogRouter.labels.import.title}
                    >
                        <ImportDialog onSubmit={onSubmit} />
                    </Container>
                );
            default:
                return null;
        }
    }
}
