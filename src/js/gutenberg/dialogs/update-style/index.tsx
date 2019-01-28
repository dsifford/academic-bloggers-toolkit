import { compose, withState } from '@wordpress/compose';
import { withDispatch } from '@wordpress/data';
import { ComponentType } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { ToolbarMenuItem } from 'gutenberg/sidebar/toolbar-menu';
import { Style } from 'stores/data';

import Dialog from './dialog';
import styles from './style.scss';

namespace StyleDialog {
    export interface DispatchProps {
        setStyle(style: Style): void;
    }
    export type StateProps = withState.Props<{ isOpen: boolean }>;
    export type Props = DispatchProps & StateProps;
}
const StyleDialog = ({ isOpen, setState, setStyle }: StyleDialog.Props) => (
    <>
        <ToolbarMenuItem
            icon="admin-appearance"
            onClick={() => setState({ isOpen: true })}
        >
            {__('Change citation style', 'academic-bloggers-toolkit')}
        </ToolbarMenuItem>
        <Dialog
            title={__('Change citation style', 'academic-bloggers-toolkit')}
            className={styles.dialog}
            isOpen={isOpen}
            onClose={() => setState({ isOpen: false })}
            onSubmit={style => setStyle(style)}
        />
    </>
);

export default compose([
    withState<{ isOpen: boolean }, StyleDialog.DispatchProps>({
        isOpen: false,
    }),
    withDispatch<StyleDialog.DispatchProps, StyleDialog.StateProps>(
        (dispatch, ownProps) => ({
            setStyle(style) {
                dispatch('abt/data').setStyle(style);
                ownProps.setState({ isOpen: false });
            },
        }),
    ),
])(StyleDialog) as ComponentType;
