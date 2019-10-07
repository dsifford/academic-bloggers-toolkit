import { Button, ToggleControl } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { withDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import asDialog, { DialogProps } from 'components/as-dialog';
import DialogToolbar from 'components/dialog-toolbar';
import IdentifierReferenceForm from 'gutenberg/components/reference-form-identifier';
import ManualReferenceForm from 'gutenberg/components/reference-form-manual';

import styles from './style.scss';

interface DispatchProps {
    createErrorNotice(message: string): void;
}

interface OwnProps extends DialogProps {
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
                    setBusy={busy => setIsBusy(busy)}
                    onClose={onClose}
                    onError={message => createErrorNotice(message)}
                    onSubmit={onSubmit}
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
                        checked={isAddingManually}
                        label={__('Manual entry', 'academic-bloggers-toolkit')}
                        onChange={isChecked =>
                            !isBusy && setIsAddingManually(isChecked)
                        }
                    />
                    <div className={styles.right}>
                        <Button
                            isLarge
                            disabled={isBusy}
                            form={FORM_ID}
                            isBusy={isBusy}
                            type="submit"
                        >
                            {__('Add', 'academic-bloggers-toolkit')}
                        </Button>
                        <Button
                            isLarge
                            isPrimary
                            disabled={isBusy}
                            form={FORM_ID}
                            isBusy={isBusy}
                            type="submit"
                        >
                            {__('Insert', 'academic-bloggers-toolkit')}
                        </Button>
                    </div>
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
