import { oneLine } from 'common-tags';
import React from 'react';
import styles from './tooltip.scss';

/**
 * Where to display the tooltip in relation to the element being described
 */
type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';

export interface TooltipParentState {
    /**
     * Describes tooltip visibility
     */
    isShowingTooltip: boolean;
    /**
     * CSS transform to set tooltip position
     */
    transform: string;
}

export interface TooltipParentProp {
    /**
     * Where to display the tooltip in relation to the element being described
     */
    position: TooltipPosition;
    /**
     * Text to display in the tooltip
     */
    text: string;
}

interface Props {
    active?: boolean;
    id: string;
    text: string;
    transform: string;
}

export default class Tooltip extends React.PureComponent<Props> {
    /**
     * Helper method used to generate transforms for components using this class
     */
    static transform = (
        position: TooltipPosition,
        rect: ClientRect,
    ): string => {
        const { round } = Math;
        switch (position) {
            case 'top':
            case 'bottom':
                return oneLine`
                    translateX(-50%)
                    translateX(${round(rect.width / 2)}px)
                    translateY(${position === 'top' ? '-' : ''}${round(
                    rect.height,
                ) + 5}px)`;
            case 'right':
                return oneLine`
                    translateX(${round(rect.width)}px)
                    translateX(5px)`;
            case 'left':
                return oneLine`
                    translateX(-100%)
                    translateX(-5px)`;
        }
    };
    render(): JSX.Element {
        const { active, id, text, transform } = this.props;
        return (
            <div
                id={id}
                role="tooltip"
                className={active ? styles.tooltipActive : styles.tooltip}
                style={{ transform }}
            >
                {text}
            </div>
        );
    }
}
