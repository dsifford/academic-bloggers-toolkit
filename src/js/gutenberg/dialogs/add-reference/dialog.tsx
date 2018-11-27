import { Button, ButtonGroup, Modal } from '@wordpress/components';
import { Component } from '@wordpress/element';
import { FormEvent, MouseEvent } from 'react';

import DialogToolbar from 'gutenberg/components/dialog-toolbar';
import IdentifierForm from './identifier-form';
import ManualForm from './manual-form';

import styles from './dialog.scss';

const FORM_ID = 'add-reference-form';

enum FormKind {
    IDENTIFIER,
    MANUAL,
}

interface Props {
    onClose: () => void;
    isOpen: boolean;
}

interface State {
    kind: FormKind;
}

class Dialog extends Component<Props, State> {
    state: State = {
        kind: FormKind.IDENTIFIER,
    };

    render() {
        const { isOpen, onClose } = this.props;
        if (!isOpen) {
            return null;
        }
        const { kind } = this.state;
        return (
            <Modal
                className={styles.modal}
                title="Add Reference"
                onRequestClose={onClose}
            >
                <form onSubmit={this.handleSubmit} id={FORM_ID}>
                    {kind === FormKind.IDENTIFIER && <IdentifierForm />}
                    {kind === FormKind.MANUAL && <ManualForm />}
                </form>
                <DialogToolbar>
                    <div className={styles.toolbar}>
                        <ButtonGroup>
                            <Button
                                isSmall
                                isPrimary={kind === FormKind.IDENTIFIER}
                                value={FormKind.IDENTIFIER}
                                type="button"
                                onClick={this.handleChangeKind}
                            >
                                Add with Identifier
                            </Button>
                            <Button
                                isSmall
                                isPrimary={kind === FormKind.MANUAL}
                                value={FormKind.MANUAL}
                                type="button"
                                onClick={this.handleChangeKind}
                            >
                                Add Manually
                            </Button>
                        </ButtonGroup>
                        <Button isPrimary isLarge type="submit" form={FORM_ID}>
                            Add Reference
                        </Button>
                    </div>
                </DialogToolbar>
            </Modal>
        );
    }

    private handleChangeKind = (e: MouseEvent<HTMLButtonElement>): void => {
        const kind: FormKind = parseInt(e.currentTarget.value, 10);
        this.setState(this.state.kind !== kind ? { kind } : null);
    };

    private handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        console.log([...form.entries()]);
    };
}

export default Dialog;
