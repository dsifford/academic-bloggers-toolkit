import { IconButton, Modal } from '@wordpress/components';
import { Component } from '@wordpress/element';

interface State {
    isOpen: boolean;
}

export default class ImportDialog extends Component<{}, State> {
    state: State = {
        isOpen: false,
    };

    render(): JSX.Element {
        const { isOpen } = this.state;
        return (
            <>
                <IconButton
                    icon="welcome-add-page"
                    label="Import references"
                    onClick={this.toggleDialog}
                />
                {isOpen && (
                    <Modal
                        title="Import References"
                        onRequestClose={this.toggleDialog}
                    >
                        <h1>Hey</h1>
                        <h2>What's up?</h2>
                        <h3>Hello</h3>
                    </Modal>
                )}
            </>
        );
    }

    private toggleDialog = () =>
        this.setState(state => ({ isOpen: !state.isOpen }));
}
