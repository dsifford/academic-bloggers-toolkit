import * as React from 'react';

import * as styles from './callout.scss';

interface Props extends React.HTMLProps<HTMLDivElement> {
    /** Text to render in the callout */
    children: string;
    /** Describes the purpose of the callout */
    intent?: 'danger' | 'warning';
    /** Describes callout visibility */
    isVisible?: boolean;
    /** Heading for callout */
    title?: string;
    /** Function to call when callout is dismissed. If unset, callout is not dismissable */
    onDismiss?(): void;
}

interface DefaultProps {
    intent: 'danger' | 'warning';
    isVisible: boolean;
}

export default class Callout extends React.PureComponent<Props> {
    static defaultProps: DefaultProps = {
        isVisible: true,
        intent: 'danger',
    };

    static prefixes = {
        warning: top.ABT.i18n.errors.warnings.warning,
        error: top.ABT.i18n.errors.prefix,
    };

    render(): JSX.Element | null {
        const { title, children, isVisible, intent, onDismiss, ...props } = this.props as Props &
            DefaultProps;
        if (!isVisible || children === '') {
            return null;
        }
        const defaultTitle =
            intent === 'danger' ? Callout.prefixes.error : Callout.prefixes.warning;
        return (
            <div
                {...props}
                className={`${styles.callout} ${styles[intent]}`}
                role="alert"
                aria-label={`${title || defaultTitle} ${children}`}
            >
                <div className={styles.heading}>
                    <h5 children={title ? title : defaultTitle} />
                    {onDismiss && (
                        <button
                            aria-label="dismiss"
                            className="dashicons dashicons-no-alt"
                            onClick={onDismiss}
                        />
                    )}
                </div>
                {children}
            </div>
        );
    }
}
