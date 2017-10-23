import { observer } from 'mobx-react';
import * as React from 'react';

import { outline } from 'utils/styles';

import Tooltip, { TooltipParentProp, TooltipParentState } from 'components/tooltip';

interface Props extends React.HTMLProps<HTMLInputElement> {
    /** Information describing the tooltip */
    tooltip: TooltipParentProp;
    onChange(): void;
}

type State = TooltipParentState;

@observer
export default class ToggleSwitch extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isShowingTooltip: false,
            transform: '',
        };
    }

    hideTooltip = (): void => this.setState(prev => ({ ...prev, isShowingTooltip: false }));

    showTooltip = (e: React.MouseEvent<HTMLSpanElement>): void => {
        const { position } = this.props.tooltip;
        const rect = e.currentTarget.getBoundingClientRect();
        this.setState(() => ({
            transform: Tooltip.transform(position, rect),
            isShowingTooltip: true,
        }));
    };

    render(): JSX.Element {
        const { checked, disabled, onChange, tooltip } = this.props;
        const { isShowingTooltip, transform } = this.state;
        return (
            <div>
                <Tooltip
                    active={isShowingTooltip}
                    id="inline-toggle"
                    text={tooltip.text}
                    transform={transform}
                />
                <input
                    disabled={disabled}
                    type="checkbox"
                    aria-describedby="inline-toggle"
                    aria-label={tooltip.text}
                    checked={checked}
                    aria-checked={checked}
                    onChange={onChange}
                />
                <span
                    aria-disabled={disabled}
                    aria-checked={checked}
                    role="checkbox"
                    onClick={onChange}
                    onMouseOver={this.showTooltip}
                    onMouseOut={this.hideTooltip}
                />
                <style jsx>{`
                    input {
                        opacity: 0 !important;
                        pointer-events: none;
                        position: absolute;
                        z-index: 1;
                    }
                    span {
                        position: relative;
                        display: block;
                        margin: 5px;
                        height: 20px;
                        width: 44px;
                        background: #898989;
                        border-radius: 100px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    }
                    span:after {
                        position: absolute;
                        left: -2px;
                        top: -3px;
                        display: block;
                        width: 26px;
                        height: 26px;
                        border-radius: 100px;
                        background: #fff;
                        box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.05);
                        content: '';
                        transition: all 0.3s ease;
                    }
                    span:active:after {
                        -webkit-transform: scale(1.15, 0.85);
                        transform: scale(1.15, 0.85);
                    }
                    input:checked + span {
                        background: #6f9eb1;
                    }
                    input:checked + span:after {
                        left: 20px;
                        background: #0085ba;
                    }
                    input:disabled + span {
                        background: #d5d5d5;
                        pointer-events: none;
                    }
                    input:disabled + span:after {
                        background: #bcbdbc;
                    }
                    input:disabled:checked + span {
                        background: #6f9eb1;
                        opacity: 0.7;
                    }
                    input:disabled:checked + span:after {
                        background: #0085ba;
                        opacity: 0.7;
                    }
                    input:focus + span {
                        outline: ${outline};
                        outline-width: 1.1px;
                        outline-style: solid;
                        outline-offset: 5px;
                        transition: none;
                    }
                `}</style>
            </div>
        );
    }
}
