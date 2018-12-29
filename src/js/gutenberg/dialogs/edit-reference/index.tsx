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

namespace Dialog {
    export interface SelectProps {
        data?: CSL.Data;
    }
    export interface OwnProps extends asDialog.Props {
        itemId?: string;
        onSubmit(data: CSL.Data): void;
    }
    export type Props = OwnProps & SelectProps;
}

const Dialog = ({ onSubmit, data }: Dialog.Props) => (
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
    withSelect<Dialog.SelectProps, Dialog.OwnProps>((select, ownProps) => {
        return {
            data: select('abt/data').getItemById(ownProps.itemId) || undefined,
        };
    }),
])(Dialog) as ComponentType<Dialog.OwnProps>;
