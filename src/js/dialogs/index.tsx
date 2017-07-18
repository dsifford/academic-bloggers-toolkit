import { IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { DialogType } from 'utils/constants';
import Container from './container';

import AddDialog from './add/';
import EditDialog from './edit/';
import ImportDialog from './import/';

export interface DialogProps {
    onSubmit(data: any): void;
}

interface Props extends DialogProps {
    currentDialog: IObservableValue<string>;
    data?: CSL.Data;
}

@observer
export default class DialogRouter extends React.PureComponent<Props> {
    render() {
        const { currentDialog, data, onSubmit } = this.props;
        switch (currentDialog.get()) {
            case DialogType.ADD:
                return (
                    <Container currentDialog={currentDialog} title="Add References">
                        <AddDialog onSubmit={onSubmit} />
                    </Container>
                );
            case DialogType.EDIT:
                return (
                    <Container currentDialog={currentDialog} title="Edit Reference">
                        <EditDialog data={data!} onSubmit={onSubmit} />
                    </Container>
                )
            case DialogType.IMPORT:
                return (
                    <Container currentDialog={currentDialog} title="Import References">
                        <ImportDialog onSubmit={onSubmit} />
                    </Container>
                );
            default:
                return null;
        }
    }
}
