import { oneLine } from 'common-tags';
import * as React from 'react';

import Tooltip, { TooltipParentProp, TooltipParentState } from 'components/tooltip';
import * as styles from './button.scss';

interface Props extends React.HTMLProps<HTMLButtonElement> {
    /** Flat button variant */
    flat?: boolean;
    /** Should button have focus outline? */
    focusable?: boolean;
    /** Dashicon to use for button */
    icon?: WordPress.Dashicon;
    /** Button aria-label if icon button, otherwise button text */
    label: string;
    /** Primary button variant */
    primary?: boolean;
    /** Information describing the tooltip if one is needed */
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
        const btnClass = oneLine`
            ${styles.btn}
            ${focusable ? styles.btnFocusable : ''}
            ${primary ? styles.btnPrimary : ''}
            ${flat ? styles.btnFlat : ''}
            ${icon ? styles.btnIcon : ''}
        `;
        const tipId = label.replace(/\s/g, '_');
        return (
            <div>
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
                    aria-label={icon ? label : undefined}
                    className={btnClass}
                    onMouseEnter={tooltip ? this.showTooltip : undefined}
                    onMouseLeave={tooltip ? this.hideTooltip : undefined}
                    onClick={href ? this.openLink : onClick}
                >
                    {icon ? <span className={`dashicons dashicons-${icon}`} /> : label}
                </button>
            </div>
        );
    }
}
