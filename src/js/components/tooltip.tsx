import { oneLine } from 'common-tags';
import * as React from 'react';

import { colors } from 'utils/styles';

/** Where to display the tooltip in relation to the element being described */
type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';

export interface TooltipParentState {
    /** CSS transform to set tooltip position */
    transform: string;
    /** Describes tooltip visibility */
    isShowingTooltip: boolean;
}

export interface TooltipParentProp {
    /** Where to display the tooltip in relation to the element being described */
    position: TooltipPosition;
    /** Text to display in the tooltip */
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
    static transform = (position: TooltipPosition, rect: ClientRect): string => {
        const { round } = Math;
        switch (position) {
            case 'top':
                return oneLine`
                    translateX(-50%)
                    translateX(${round(rect.width / 2)}px)
                    translateY(-${round(rect.height) + 5}px)`;
            case 'right':
                return oneLine`
                    translateX(${round(rect.width)}px)
                    translateX(5px)`;
            case 'bottom':
                return oneLine`
                    translateX(-50%)
                    translateX(${round(rect.width / 2)}px)
                    translateY(${round(rect.height) + 5}px)`;
            case 'left':
                return oneLine`
                    translateX(-100%)
                    translateX(-5px)`;
        }
    };
    render() {
        const { active, id, text, transform } = this.props;
        return (
            <div
                id={id}
                role="tooltip"
                className={`abt-tooltip${active ? ' abt-tooltip--active' : ''}`}
                style={{ transform }}
            >
                {text}
                <style jsx>{`
                    .abt-tooltip {
                        pointer-events: none;
                        transform-origin: top center;
                        z-index: 1000;
                        background: ${colors.tooltip_gray};
                        border-radius: 2px;
                        color: white;
                        display: inline-block;
                        visibility: hidden;
                        font-size: 10px;
                        font-weight: 500;
                        line-height: 14px;
                        position: absolute;
                        padding: 8px;
                        text-align: center;
                        max-width: 170px;
                    }
                    .abt-tooltip--active {
                        visibility: visible;
                    }
                `}</style>
            </div>
        );
    }
}
