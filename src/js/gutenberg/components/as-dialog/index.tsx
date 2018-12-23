import { Modal } from '@wordpress/components';
import { ComponentType } from '@wordpress/element';

import styles from './style.scss';

namespace asDialog {
    export interface Props {
        isOpen: boolean;
        onClose(): void;
    }
}

function asDialog<P extends asDialog.Props>(
    Wrapped: ComponentType<P>,
): ComponentType<P> {
    return props => {
        if (!props.isOpen) {
            return null;
        }
        return (
            <Modal
                className={styles.modal}
                title="Add Reference"
                onRequestClose={props.onClose}
            >
                <Wrapped {...props} />
            </Modal>
        );
    };
}

export default asDialog;
