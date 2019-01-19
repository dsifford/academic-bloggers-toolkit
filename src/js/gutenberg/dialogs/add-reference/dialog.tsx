import { Button, ToggleControl } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { withDispatch } from '@wordpress/data';
import { Component, ComponentType } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import asDialog from 'components/as-dialog';
import DialogToolbar from 'components/dialog-toolbar';
import IdentifierReferenceForm from 'gutenberg/components/reference-form-identifier';
import ManualReferenceForm from 'gutenberg/components/reference-form-manual';

import styles from './style.scss';

namespace Dialog {
    export interface DispatchProps {
        createErrorNotice(message: string): void;
    }

    export interface OwnProps extends asDialog.Props {
        onSubmit(data: CSL.Data): void;
    }

    export type Props = DispatchProps & OwnProps;

    export interface State {
        isAddingManually: boolean;
        isBusy: boolean;
    }
}

class Dialog extends Component<Dialog.Props, Dialog.State> {
    state: Dialog.State = {
        isAddingManually: false,
        isBusy: false,
    };

    render() {
        const FORM_ID = 'add-reference-form';
        const { onClose, onSubmit, createErrorNotice } = this.props;
        const { isAddingManually, isBusy } = this.state;
        return (
            <>
                {!isAddingManually && (
                    <IdentifierReferenceForm
                        id={FORM_ID}
                        onSubmit={onSubmit}
                        onClose={onClose}
                        onError={(message: string) =>
                            createErrorNotice(message)
                        }
                        setBusy={(busy: boolean) =>
                            this.setState({ isBusy: busy })
                        }
                    />
                )}
                {isAddingManually && (
                    <ManualReferenceForm
                        withAutocite
                        id={FORM_ID}
                        onSubmit={onSubmit}
                    />
                )}
                <DialogToolbar>
                    <div className={styles.toolbar}>
                        <ToggleControl
                            label={__(
                                'Add manually',
                                'academic-bloggers-toolkit',
                            )}
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
                            {__('Add Reference', 'academic-bloggers-toolkit')}
                        </Button>
                    </div>
                </DialogToolbar>
            </>
        );
    }

    private handleToggleManually = (isAddingManually: boolean) =>
        this.setState(this.state.isBusy ? null : { isAddingManually });
}

export default compose([
    asDialog,
    withDispatch<Dialog.DispatchProps>(dispatch => ({
        createErrorNotice(message) {
            dispatch('core/notices').createErrorNotice(message);
        },
    })),
])(Dialog) as ComponentType<Dialog.OwnProps>;
