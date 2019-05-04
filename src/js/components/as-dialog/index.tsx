import { Modal } from '@wordpress/components';
import { ComponentType } from '@wordpress/element';
import classNames from 'classnames';

import styles from './style.scss';

export interface DialogProps {
    className?: string;
    isOpen: boolean;
    title: string;
    onClose(): void;
}

export default function asDialog<P extends DialogProps>(
    Wrapped: ComponentType<P>,
): ComponentType<P> {
    return function Dialog(props: P) {
        const { className, isOpen, onClose, title } = props;
        if (!isOpen) {
            return null;
        }
        return (
            <Modal
                className={classNames(styles.modal, className)}
                shouldCloseOnEsc={false}
                title={title}
                onRequestClose={onClose}
            >
                <Wrapped {...props} />
            </Modal>
        );
    };
}
