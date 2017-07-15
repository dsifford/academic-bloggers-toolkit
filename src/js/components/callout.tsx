import * as React from 'react';

interface Props extends React.HTMLProps<HTMLDivElement> {
    children: string;
    title?: string;
    isVisible?: boolean;
    dismiss?: () => void;
    intent?: 'danger' | 'warning';
}

export default class Callout extends React.PureComponent<Props> {
    static prefixes = {
        warning: top.ABT_i18n.errors.warnings.warning,
        error: top.ABT_i18n.errors.prefix,
    };

    static defaultProps: Partial<Props> = {
        isVisible: true,
        intent: 'danger',
    };

    render() {
        const { title, children, intent, isVisible, dismiss } = this.props;
        const defaultTitle =
            intent === 'danger' ? Callout.prefixes.error : Callout.prefixes.warning;
        if (!isVisible || children === '') {
            return null;
        }
        return (
            <div className={`callout ${intent}`}>
                <div className="callout__heading">
                    <h5 children={title ? title : defaultTitle} />
                    {dismiss &&
                        <button
                            aria-label="dismiss"
                            className="dashicons dashicons-no-alt"
                            onClick={dismiss}
                        />}
                </div>
                {children}
                <style jsx>{`
                    .callout {
                        border-radius: 3px;
                        padding: 10px 12px 9px;
                        line-height: 1.5;
                        position: relative;
                        font-weight: 500;
                        font-size: 14px;
                        margin: 0 10px 10px;
                    }
                    .callout__heading {
                        display: flex;
                        justify-content: space-between;
                    }
                    h5 {
                        margin: 0 0 5px 0;
                        line-height: 20px;
                        font-weight: 600;
                        padding: 0;
                        font-size: 17px;
                    }
                    button {
                        font-size: 20px;
                        cursor: pointer;
                        border: 0;
                        outline: 0;
                        padding: 0;
                        background: transparent;
                        color: #555d66;
                        position: relative;
                        top: -5px;
                        right: -5px;
                    }
                    button:hover {
                        color: black;
                    }
                    .danger {
                        background-color: rgba(219, 55, 55, 0.15);
                    }
                    .danger h5 {
                        color: #c23030;
                    }
                    .warning {
                        background-color: rgba(217, 130, 43, 0.15);
                    }
                    .warning h5 {
                        color: #bf7326;
                    }
                `}</style>
            </div>
        );
    }
}
