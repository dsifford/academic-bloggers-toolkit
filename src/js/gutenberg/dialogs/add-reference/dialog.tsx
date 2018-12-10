import { Button, ButtonGroup, Modal } from '@wordpress/components';
import { Component } from '@wordpress/element';
import DialogToolbar from 'gutenberg/components/dialog-toolbar';
import { FormEvent, MouseEvent } from 'react';
import { IdentifierKind } from 'utils/constants';
import { ResponseError } from 'utils/error';
import { DOI, Pubmed } from 'utils/resolvers';

import styles from './dialog.scss';
import IdentifierForm from './identifier-form';
import ManualForm from './manual-form';

const FORM_ID = 'add-reference-form';

enum FormKind {
    IDENTIFIER,
    MANUAL,
}

interface Props {
    onClose: () => void;
    onSubmit: (data: CSL.Data) => void;
    isOpen: boolean;
}

interface State {
    kind: FormKind;
    isBusy: boolean;
}

class Dialog extends Component<Props, State> {
    state: State = {
        kind: FormKind.IDENTIFIER,
        isBusy: false,
    };

    render() {
        const { isOpen, onClose } = this.props;
        if (!isOpen) {
            return null;
        }
        const { kind, isBusy } = this.state;
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
                                isBusy={isBusy}
                                disabled={isBusy}
                                isPrimary={kind === FormKind.IDENTIFIER}
                                value={FormKind.IDENTIFIER}
                                type="button"
                                onClick={this.handleChangeKind}
                            >
                                Add with Identifier
                            </Button>
                            <Button
                                isSmall
                                isBusy={isBusy}
                                disabled={isBusy}
                                isPrimary={kind === FormKind.MANUAL}
                                value={FormKind.MANUAL}
                                type="button"
                                onClick={this.handleChangeKind}
                            >
                                Add Manually
                            </Button>
                        </ButtonGroup>
                        <Button
                            isPrimary
                            isLarge
                            isBusy={isBusy}
                            disabled={isBusy}
                            type="submit"
                            form={FORM_ID}
                        >
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

    private handleSubmit = async (
        e: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        e.preventDefault();
        const { kind } = this.state;
        this.setState({ isBusy: true });
        const form = new FormData(e.currentTarget);
        if (kind === FormKind.IDENTIFIER) {
            return this.handleIdentifierSubmit(form);
        }
        return this.handleManualSubmit(form);
    };

    private async handleIdentifierSubmit(form: FormData): Promise<void> {
        const kind = form.get('identifierKind') as IdentifierKind;
        const identifier = form.get('identifier') as string;
        let response: CSL.Data | ResponseError;
        switch (kind) {
            case IdentifierKind.DOI:
                response = await DOI.get(identifier);
                break;
            case IdentifierKind.PMCID:
                response = await Pubmed.get(identifier, 'pmc');
                break;
            case IdentifierKind.PMID:
                response = await Pubmed.get(identifier, 'pubmed');
                break;
            // TODO:
            default:
                throw new Error(`Invalid indentifier type: ${identifier}`);
        }
        this.setState({ isBusy: false });
        if (response instanceof ResponseError) {
            // FIXME: add notification here
            console.log(response);
            return;
        }
        return this.props.onSubmit(response);
    }

    private handleManualSubmit(form: FormData): void {
        console.log([...form.entries()]);
        return;
    }
}

export default Dialog;
