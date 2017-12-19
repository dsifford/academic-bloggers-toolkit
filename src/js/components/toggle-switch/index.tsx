import { observer } from 'mobx-react';
import * as React from 'react';

import Tooltip, { TooltipParentProp, TooltipParentState } from 'components/tooltip';
import * as styles from './toggle-switch.scss';

interface Props extends React.HTMLProps<HTMLInputElement> {
    /** Information describing the tooltip */
    tooltip: TooltipParentProp;
    onChange(): void;
}

type State = TooltipParentState;

@observer
export default class ToggleSwitch extends React.Component<Props, State> {
    state = {
        isShowingTooltip: false,
        transform: '',
    };

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
            <div className={styles.toggle}>
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
            </div>
        );
    }
}
