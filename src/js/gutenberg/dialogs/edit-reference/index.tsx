import { Button } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import { ComponentType } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import asDialog from 'gutenberg/components/as-dialog';
import DialogToolbar from 'gutenberg/components/dialog-toolbar';
import ManualReferenceForm from 'gutenberg/components/reference-form-manual';

import styles from './style.scss';

const FORM_ID = 'edit-reference-form';

interface SelectProps {
    data?: CSL.Data;
}

namespace Dialog {
    export interface Props {
        itemId?: string;
        isOpen: boolean;
        onClose(): void;
        onSubmit(data: CSL.Data): void;
    }
}

const Dialog = ({ onSubmit, data }: Dialog.Props & SelectProps) => (
    <>
        <ManualReferenceForm id={FORM_ID} onSubmit={onSubmit} data={data} />
        <DialogToolbar>
            <div className={styles.toolbar}>
                <Button isPrimary isLarge type="submit" form={FORM_ID}>
                    {__('Update Reference', 'academic-bloggers-toolkit')}
                </Button>
            </div>
        </DialogToolbar>
    </>
);

export default compose([
    asDialog,
    withSelect<SelectProps, Dialog.Props>((select, ownProps) => {
        return {
            data: select('abt/data').getItemById(ownProps.itemId) || undefined,
        };
    }),
])(Dialog) as ComponentType<Dialog.Props>;
