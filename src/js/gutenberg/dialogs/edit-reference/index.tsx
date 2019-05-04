import { Button } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import asDialog, { DialogProps } from 'components/as-dialog';
import DialogToolbar from 'components/dialog-toolbar';
import ManualReferenceForm from 'gutenberg/components/reference-form-manual';

import styles from './style.scss';

const FORM_ID = 'edit-reference-form';

interface SelectProps {
    data?: CSL.Data;
}

interface OwnProps extends DialogProps {
    itemId?: string;
    onSubmit(data: CSL.Data): void;
}

type Props = OwnProps & SelectProps;

function EditDialog({ data, onSubmit }: Props) {
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

export default compose(
    asDialog,
    withSelect<SelectProps, OwnProps>((select, { itemId }) => {
        return {
            data: select('abt/data').getItemById(itemId) || undefined,
        };
    }),
)(EditDialog);
