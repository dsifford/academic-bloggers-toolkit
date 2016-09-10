import * as React from 'react';
import { createTooltip, destroyTooltip } from '../../utils/Tooltips';

export class PanelButton extends React.PureComponent<React.HTMLProps<HTMLAnchorElement>, {}> {

    createTooltip = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.stopPropagation();
        const target = e.target as HTMLElement;
        createTooltip(e, target.dataset['tooltip'], 'bottom');
    }

    render() {
        destroyTooltip();
        return (
            <a
                {...this.props}
                className={this.props.disabled ? 'abt-reflist-button disabled' : 'abt-reflist-button'}
                onMouseOver={this.props['data-tooltip'] ? this.createTooltip : null}
                onMouseLeave={this.props['data-tooltip'] ? destroyTooltip : null}
            />
        );
    }
}
