import React from 'react';

import Button from 'components/button';

import styles from './callout.scss';

interface Props extends React.HTMLProps<HTMLDivElement> {
    /**
     * Text to render in the callout
     */
    children: string;
    /**
     * Describes the purpose of the callout
     */
    intent?: 'danger' | 'warning';
    /**
     * Heading for callout
     */
    title?: string;
    /**
     * Function to call when callout is dismissed. If unset, callout is not
     * dismissable
     */
    onDismiss?(): void;
}

interface DefaultProps {
    intent: 'danger' | 'warning';
}

export default class Callout extends React.PureComponent<Props> {
    static defaultProps: DefaultProps = {
        intent: 'danger',
    };

    static prefixes = {
        warning: top.ABT.i18n.errors.warnings.warning,
        error: top.ABT.i18n.errors.prefix,
    };

    render(): JSX.Element | null {
        const { title, children, intent, onDismiss, ...props } = this
            .props as Props & DefaultProps;
        if (!children) {
            return null;
        }
        const defaultTitle =
            intent === 'danger'
                ? Callout.prefixes.error
                : Callout.prefixes.warning;
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
                        <Button
                            flat
                            focusable
                            icon="no-alt"
                            label="dismiss"
                            onClick={onDismiss}
                        />
                    )}
                </div>
                {children}
            </div>
        );
    }
}
