import { IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import Container from './container';

import AddDialog from './add/';
import ImportDialog from './import/';

interface Props {
    currentDialog: IObservableValue<string>;
    onSubmit(data: any): void; // FIXME:
}

@observer
export default class DialogRouter extends React.PureComponent<Props, {}> {
    render() {
        const { currentDialog, onSubmit } = this.props;
        switch (currentDialog.get()) {
            case 'ADD':
                return (
                    <Container currentDialog={currentDialog} title="Add References">
                        <AddDialog onSubmit={onSubmit} />
                    </Container>
                );
            case 'IMPORT':
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
