import { IconButton, KeyboardShortcuts } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { withDispatch } from '@wordpress/data';
import { Component } from '@wordpress/element';

import Dialog from './dialog';

interface DispatchProps {
    addReference(data: CSL.Data): void;
}

interface State {
    isOpen: boolean;
}

class AddReferenceDialog extends Component<DispatchProps, State> {
    state: State = {
        isOpen: false,
    };

    render(): JSX.Element {
        const { isOpen } = this.state;
        return (
            <>
                <KeyboardShortcuts
                    bindGlobal
                    shortcuts={{ 'ctrl+alt+r': this.toggleDialog }}
                />
                {/* TODO: use `displayShortcut` from @wordpress/keycodes */}
                <IconButton
                    icon="insert"
                    label="Add reference"
                    onClick={this.toggleDialog}
                />
                <Dialog
                    isOpen={isOpen}
                    onClose={this.toggleDialog}
                    onSubmit={this.handleSubmit}
                />
            </>
        );
    }

    private toggleDialog = (): void => {
        this.setState(state => ({ isOpen: !state.isOpen }));
    };

    private handleSubmit = (data: CSL.Data): void => {
        this.props.addReference(data);
        this.setState({ isOpen: false });
    };
}

export default compose([
    withDispatch<DispatchProps>(dispatch => ({
        addReference(data: CSL.Data) {
            dispatch('abt/data').addReference(data);
        },
    })),
])(AddReferenceDialog);
