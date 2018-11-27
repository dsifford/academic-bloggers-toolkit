import { IconButton, KeyboardShortcuts } from '@wordpress/components';
import { Component } from '@wordpress/element';

import Dialog from './dialog';

interface State {
    isOpen: boolean;
}

class AddReferenceDialog extends Component<{}, State> {
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
                <IconButton
                    icon="insert"
                    label="Add reference"
                    onClick={this.toggleDialog}
                />
                <Dialog isOpen={isOpen} onClose={this.toggleDialog} />
            </>
        );
    }

    private toggleDialog = (): void => {
        this.setState(state => ({ isOpen: !state.isOpen }));
    };
}

export default AddReferenceDialog;
