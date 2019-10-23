import { Button } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import asDialog, { DialogProps } from 'components/as-dialog';
import DialogToolbar from 'components/dialog-toolbar';
import ManualReferenceForm from 'gutenberg/components/reference-form-manual';

import styles from './style.scss';

const FORM_ID = 'edit-reference-form';

interface Props extends DialogProps {
    itemId?: string;
    onSubmit(data: CSL.Data): void;
}

function EditDialog({ onSubmit, itemId }: Props) {
    const data = useSelect(
        select => select('abt/data').getItemById(itemId || ''),
        [itemId],
    );

    return (
        <>
            <ManualReferenceForm data={data} id={FORM_ID} onSubmit={onSubmit} />
            <DialogToolbar>
                <div className={styles.toolbar}>
                    <Button isLarge isPrimary form={FORM_ID} type="submit">
                        {__('Update Reference', 'academic-bloggers-toolkit')}
                    </Button>
                </div>
            </DialogToolbar>
        </>
    );
}

export default asDialog(EditDialog);
