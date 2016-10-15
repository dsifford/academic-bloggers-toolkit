import * as React from 'react';
import { createTooltip, destroyTooltip } from '../utils/Tooltips';

interface Props {
    checked: boolean;
    label: string;
    onChange(e: React.FormEvent<HTMLInputElement>): void;
}

export class ToggleSwitch extends React.PureComponent<Props, {}> {

    handleMouseOver = (e) => {
        createTooltip(e.target, e.target.getAttribute('data-tooltip'), 'left');
    }

    render() {
        const { checked, onChange, label } = this.props;
        return (
            <div>
                    <input
                        type="checkbox"
                        id="inline-toggle"
                        className="toggle"
                        style={{display: 'none'}}
                        checked={checked}
                        aria-checked={checked}
                        onChange={onChange}
                    />
                    <label
                        htmlFor="inline-toggle"
                        className="toggle-lbl"
                        role="tooltip"
                        data-tooltip={label}
                        onMouseOver={this.handleMouseOver}
                        onMouseOut={destroyTooltip}
                    />
                </div>
        );
    }
}
