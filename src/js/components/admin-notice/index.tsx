import { ReactNode } from '@wordpress/element';
import classNames from 'classnames';

export namespace AdminNotice {
    interface BaseProps {
        children: ReactNode;
        kind?: 'error' | 'info' | 'success' | 'warning';
    }
    interface DismissibleProps extends BaseProps {
        isDismissible: true;
        onDismiss(): void;
    }
    interface NonDismissibleProps extends BaseProps {
        isDismissible?: false;
        onDismiss?: never;
    }
    export type Props = DismissibleProps | NonDismissibleProps;
}
const AdminNotice = ({
    children,
    isDismissible,
    onDismiss,
    kind = 'info',
}: AdminNotice.Props) => {
    const classname = classNames('notice', {
        [`notice-${kind}`]: kind,
        'is-dismissible': isDismissible,
    });
    return (
        <div className={classname}>
            <p>{children}</p>
            {isDismissible && (
                <button
                    type="button"
                    className="notice-dismiss"
                    onClick={onDismiss}
                >
                    <span className="screen-reader-text">
                        Dismiss this notice.
                    </span>
                </button>
            )}
        </div>
    );
};

export default AdminNotice;
