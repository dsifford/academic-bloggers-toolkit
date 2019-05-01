import { Button, ToggleControl } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { withDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import asDialog from 'components/as-dialog';
import DialogToolbar from 'components/dialog-toolbar';
import IdentifierReferenceForm from 'gutenberg/components/reference-form-identifier';
import ManualReferenceForm from 'gutenberg/components/reference-form-manual';

import styles from './style.scss';

interface DispatchProps {
    createErrorNotice(message: string): void;
}

interface OwnProps extends asDialog.Props {
    onSubmit(data: CSL.Data): void;
}

type Props = DispatchProps & OwnProps;

function Dialog({ createErrorNotice, onClose, onSubmit }: Props) {
    const [isAddingManually, setIsAddingManually] = useState(false);
    const [isBusy, setIsBusy] = useState(false);

    const FORM_ID = 'add-reference-form';

    return (
        <>
            {!isAddingManually && (
                <IdentifierReferenceForm
                    id={FORM_ID}
                    onSubmit={onSubmit}
                    onClose={onClose}
                    onError={message => createErrorNotice(message)}
                    setBusy={busy => setIsBusy(busy)}
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
                        label={__('Add manually', 'academic-bloggers-toolkit')}
                        checked={isAddingManually}
                        onChange={isChecked =>
                            !isBusy && setIsAddingManually(isChecked)
                        }
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

export default compose(
    asDialog,
    withDispatch<DispatchProps, OwnProps>(dispatch => ({
        createErrorNotice(message) {
            dispatch('core/notices').createErrorNotice(message);
        },
    })),
)(Dialog);
