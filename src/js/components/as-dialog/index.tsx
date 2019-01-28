import { Modal } from '@wordpress/components';
import { ComponentType } from '@wordpress/element';
import classNames from 'classnames';

import styles from './style.scss';

namespace asDialog {
    export interface Props {
        title: string;
        isOpen: boolean;
        className?: string;
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
                className={classNames(styles.modal, props.className)}
                title={props.title}
                onRequestClose={props.onClose}
                shouldCloseOnEsc={false}
            >
                <Wrapped {...props} />
            </Modal>
        );
    };
}

export default asDialog;
