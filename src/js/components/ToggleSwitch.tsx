import * as React from 'react';
import { createTooltip, destroyTooltip } from 'utils/Tooltips';

interface Props {
    checked: boolean;
    label: string;
    onChange(e: React.FormEvent<HTMLInputElement>): void;
}

export class ToggleSwitch extends React.PureComponent<Props, {}> {
    handleMouseOver = (e: React.MouseEvent<HTMLLabelElement>) => {
        createTooltip(e.currentTarget, e.currentTarget.getAttribute('data-tooltip')!, 'left');
    };

    render() {
        const { checked, onChange, label } = this.props;
        return (
            <div>
                <input
                    type="checkbox"
                    id="inline-toggle"
                    style={{ display: 'none' }}
                    checked={checked}
                    aria-checked={checked}
                    onChange={onChange}
                />
                <label
                    htmlFor="inline-toggle"
                    role="tooltip"
                    data-tooltip={label}
                    onMouseOver={this.handleMouseOver}
                    onMouseOut={destroyTooltip}
                />
                <style jsx>{`
                    label {
                        position: relative;
                        display: block;
                        margin: 0 10px;
                        height: 20px;
                        width: 44px;
                        background: #898989;
                        border-radius: 100px;
                        cursor: pointer;
                        -webkit-transition: all 0.3s ease;
                        transition: all 0.3s ease;
                    }
                    label:after {
                        position: absolute;
                        left: -2px;
                        top: -3px;
                        display: block;
                        width: 26px;
                        height: 26px;
                        border-radius: 100px;
                        background: #fff;
                        -webkit-box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.05);
                        box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.05);
                        content: '';
                        -webkit-transition: all 0.3s ease;
                        transition: all 0.3s ease;
                    }
                    label:active:after {
                        -webkit-transform: scale(1.15, 0.85);
                        transform: scale(1.15, 0.85);
                    }
                    input:checked ~ label {
                        background: #6f9eb1;
                    }
                    input:checked ~ label:after {
                        left: 20px;
                        background: #0085ba;
                    }
                    input:disabled ~ label {
                        background: #d5d5d5;
                        pointer-events: none;
                    }
                    input:disabled ~ label:after {
                        background: #bcbdbc;
                    }
                `}</style>
            </div>
        );
    }
}
