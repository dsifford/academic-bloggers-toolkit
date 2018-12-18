import {
    Button,
    Modal,
    ToggleControl,
    withNotices,
} from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { Component } from '@wordpress/element';
import classNames from 'classnames';
import { FormEvent } from 'react';

import DialogToolbar from 'gutenberg/components/dialog-toolbar';
import { SidebarNotice } from 'gutenberg/sidebar/toolbar';
import { IdentifierKind } from 'utils/constants';
import { ResponseError } from 'utils/error';
import { DOI, Pubmed } from 'utils/resolvers';

import styles from './dialog.scss';
import IdentifierForm from './identifier-form';
import ManualForm from './manual-form';

const FORM_ID = 'add-reference-form';

interface Props extends withNotices.Props {
    onClose: () => void;
    onSubmit: (data: CSL.Data) => void;
    isOpen: boolean;
}

interface State {
    isAddingManually: boolean;
    isBusy: boolean;
}

class Dialog extends Component<Props, State> {
    state: State = {
        isAddingManually: false,
        isBusy: false,
    };

    render() {
        const { isOpen, noticeUI, onClose } = this.props;
        const { isAddingManually, isBusy } = this.state;
        return (
            <>
                <SidebarNotice>{noticeUI}</SidebarNotice>
                {isOpen && (
                    <Modal
                        className={styles.modal}
                        title="Add Reference"
                        onRequestClose={onClose}
                    >
                        <form
                            id={FORM_ID}
                            className={classNames(styles.form, {
                                [styles.manualForm]: isAddingManually,
                            })}
                            onSubmit={this.handleSubmit}
                        >
                            {!isAddingManually && <IdentifierForm />}
                            {isAddingManually && <ManualForm />}
                        </form>
                        <DialogToolbar>
                            <div className={styles.toolbar}>
                                <ToggleControl
                                    label="Add manually"
                                    checked={isAddingManually}
                                    onChange={this.handleToggleManually}
                                />
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
                )}
            </>
        );
    }

    private handleToggleManually = (isAddingManually: boolean) =>
        this.setState(this.state.isBusy ? null : { isAddingManually });

    private handleSubmit = async (
        e: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        e.preventDefault();
        this.setState({ isBusy: true });
        const { isAddingManually } = this.state;
        const form = new FormData(e.currentTarget);
        return isAddingManually
            ? this.handleManualSubmit(form)
            : this.handleIdentifierSubmit(form);
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
            default:
                this.props.noticeOperations.createErrorNotice(
                    `Invalid indentifier type: ${identifier}`,
                );
                this.setState({ isBusy: false });
                this.props.onClose();
                return;
        }
        this.setState({ isBusy: false });
        if (response instanceof ResponseError) {
            this.props.noticeOperations.createErrorNotice(
                `Unable to retrieve data for identifier: ${response.resource}`,
            );
            this.props.onClose();
            return;
        }
        return this.props.onSubmit(response);
    }

    private handleManualSubmit(form: FormData): void {
        console.log([...form.entries()]);
        this.setState({ isBusy: false });
    }
}

export default compose([withNotices])(Dialog);
