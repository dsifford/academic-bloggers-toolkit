import { Button, ToggleControl } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import asDialog, { DialogProps } from 'components/as-dialog';
import DialogToolbar from 'components/dialog-toolbar';
import IdentifierReferenceForm from 'gutenberg/components/reference-form-identifier';
import ManualReferenceForm from 'gutenberg/components/reference-form-manual';

import styles from './style.scss';

interface Props extends DialogProps {
    onSubmit(data: CSL.Data): void;
}

function Dialog({ onClose, onSubmit }: Props) {
    const { createErrorNotice } = useDispatch('core/notices');
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
                    onError={message =>
                        createErrorNotice(message, { type: 'snackbar' })
                    }
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
                        label={__('Add manually', 'academic-bloggers-toolkit')}
                        onChange={isChecked =>
                            !isBusy && setIsAddingManually(isChecked)
                        }
                    />
                    <Button
                        isLarge
                        isPrimary
                        disabled={isBusy}
                        form={FORM_ID}
                        isBusy={isBusy}
                        type="submit"
                    >
                        {__('Add Reference', 'academic-bloggers-toolkit')}
                    </Button>
                </div>
            </DialogToolbar>
        </>
    );
}

export default asDialog(Dialog);
