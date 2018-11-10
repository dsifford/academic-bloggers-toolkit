import classNames from 'classnames';
import React from 'react';

import Tooltip, {
    TooltipParentProp,
    TooltipParentState,
} from '_legacy/components/tooltip';
import styles from './button.scss';

interface Props extends React.HTMLProps<HTMLButtonElement> {
    /**
     * Flat button variant
     */
    flat?: boolean;
    /**
     * Should button have focus outline?
     */
    focusable?: boolean;
    /**
     * Dashicon to use for button
     */
    icon?: wp.Dashicon;
    /**
     * Descriptive aria-label for the button
     */
    label: string;
    /**
     * Primary button variant
     */
    primary?: boolean;
    /**
     * Information describing the tooltip if one is needed
     */
    tooltip?: TooltipParentProp;
    onClick?(e: React.MouseEvent<HTMLButtonElement>): void;
}

type State = TooltipParentState;

export default class Button extends React.PureComponent<Props, State> {
    static defaultProps: Partial<Props> = {
        type: 'button',
    };

    state = {
        isShowingTooltip: false,
        transform: '',
    };

    hideTooltip = (): void => {
        this.setState(prev => ({ ...prev, isShowingTooltip: false }));
    };

    openLink = (): void => {
        window.open(this.props.href, '_blank');
    };

    showTooltip = (e: React.MouseEvent<HTMLButtonElement>): void => {
        const { position } = this.props.tooltip!;
        const rect = e.currentTarget.getBoundingClientRect();
        this.setState(() => ({
            transform: Tooltip.transform(position, rect),
            isShowingTooltip: true,
        }));
    };

    // Below is disabled because the class fallbacks aren't complexity-adding.
    // tslint:disable-next-line cyclomatic-complexity
    render(): JSX.Element {
        const {
            className,
            flat,
            focusable,
            href,
            icon,
            label,
            onClick,
            primary,
            tooltip,
            ...buttonProps
        } = this.props;
        const { isShowingTooltip, transform } = this.state;
        const btnClass = classNames(
            styles.btn,
            {
                [styles.btnFocusable]: focusable,
                [styles.btnPrimary]: primary,
                [styles.btnFlat]: flat,
                [styles.btnIcon]: icon !== undefined,
            },
            className,
        );
        const tipId = label.replace(/\s/g, '_');
        return (
            <span>
                {tooltip && (
                    <Tooltip
                        active={isShowingTooltip}
                        id={tipId}
                        text={tooltip.text}
                        transform={transform}
                    />
                )}
                <button
                    {...buttonProps}
                    aria-describedby={tooltip ? tipId : undefined}
                    aria-label={label}
                    className={btnClass}
                    onMouseEnter={tooltip ? this.showTooltip : undefined}
                    onMouseLeave={tooltip ? this.hideTooltip : undefined}
                    onClick={href ? this.openLink : onClick}
                >
                    {/* {icon ? (
                        <span className={`dashicons dashicons-${icon}`} />
                    ) : (
                        label
                    )} */}
                    {icon && <span className={`dashicons dashicons-${icon}`} />}
                    {this.props.children}
                </button>
            </span>
        );
    }
}
