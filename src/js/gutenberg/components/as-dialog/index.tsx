import { Modal, withNotices } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { Component, ComponentType } from '@wordpress/element';

import { SidebarNotice } from 'gutenberg/sidebar/toolbar';

import styles from './style.scss';

interface Props {
    isOpen: boolean;
    onClose(): void;
    createErrorNotice(message: string): void;
}
export { Props as DialogProps };

function asDialog<P extends Props, PP extends withNotices.Props>(
    Wrapped: ComponentType<P>,
): ComponentType<P & PP> {
    return ({
        isOpen,
        noticeUI,
        noticeOperations,
        noticeList,
        onClose,
        ...rest
    }: P & PP) => {
        const props = {
            onClose,
            isOpen,
            createErrorNotice: noticeOperations.createErrorNotice,
            ...rest,
        };
        return (
            <>
                <SidebarNotice>{noticeUI}</SidebarNotice>
                {isOpen && (
                    <Modal
                        className={styles.modal}
                        title="Add Reference"
                        onRequestClose={onClose}
                    >
                        <Wrapped {...props as any} />
                    </Modal>
                )}
            </>
        );
    };
}

export default compose([withNotices, asDialog]) as DialogHOC;

type DialogHOC = <P extends Props>(
    c: ComponentType<P> | Component<P>,
) => ComponentType<Pick<P, Exclude<keyof P, 'createErrorNotice'>>>;
