import * as React from 'react';
import { createTooltip, destroyTooltip } from '../../utils/Tooltips';

export class PanelButton extends React.PureComponent<
    React.HTMLProps<HTMLAnchorElement>,
    {}
> {
    element: HTMLAnchorElement;

    bindRefs = (c: HTMLAnchorElement) => {
        this.element = c;
    };

    createTooltip = () => {
        createTooltip(
            this.element,
            this.element.getAttribute('data-tooltip')!,
            'bottom'
        );
    };

    render() {
        destroyTooltip();
        const cn = this.props.disabled
            ? 'abt-btn abt-btn_flat abt-btn_icon abt-btn_disabled'
            : 'abt-btn abt-btn_flat abt-btn_icon';
        return (
            <a
                {...this.props}
                ref={this.bindRefs}
                className={cn}
                onMouseEnter={
                    this.props['data-tooltip'] ? this.createTooltip : undefined
                }
                onMouseLeave={
                    this.props['data-tooltip'] ? destroyTooltip : undefined
                }
            />
        );
    }
}
