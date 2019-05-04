import { ReactNode } from '@wordpress/element';
import classNames from 'classnames';

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

type Props = DismissibleProps | NonDismissibleProps;

export default function AdminNotice({
    children,
    isDismissible,
    kind,
    onDismiss,
}: Props) {
    const classname = classNames('notice', {
        [`notice-${kind}`]: kind,
        'is-dismissible': isDismissible,
    });
    return (
        <div className={classname}>
            <p>{children}</p>
            {isDismissible && (
                <button
                    className="notice-dismiss"
                    type="button"
                    onClick={onDismiss}
                >
                    <span className="screen-reader-text">
                        Dismiss this notice.
                    </span>
                </button>
            )}
        </div>
    );
}
