import { withDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { ToolbarMenuItem } from 'gutenberg/sidebar/toolbar-menu';
import { Style } from 'stores/data';

import Dialog from './dialog';
import styles from './style.scss';

interface DispatchProps {
    setStyle(style: Style): void;
}

type Props = DispatchProps;

function StyleDialog({ setStyle }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <ToolbarMenuItem
                icon="admin-appearance"
                onClick={() => setIsOpen(true)}
            >
                {__('Change citation style', 'academic-bloggers-toolkit')}
            </ToolbarMenuItem>
            <Dialog
                title={__('Change citation style', 'academic-bloggers-toolkit')}
                className={styles.dialog}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onSubmit={style => {
                    setStyle(style);
                    setIsOpen(false);
                }}
            />
        </>
    );
}

export default withDispatch<DispatchProps>(dispatch => ({
    setStyle(style) {
        dispatch('abt/data').setStyle(style);
    },
}))(StyleDialog);
