import * as React from 'react';

export class PanelButton extends React.PureComponent<React.HTMLProps<HTMLAnchorElement>, {}> {

    generateTooltip(text: string): HTMLDivElement {
        let container = document.createElement('DIV') as HTMLDivElement;
        let arrow = document.createElement('DIV') as HTMLDivElement;
        let tooltip = document.createElement('DIV') as HTMLDivElement;

        container.id = 'abt-reflist-tooltip';
        container.className = 'mce-widget mce-tooltip mce-tooltip-n';
        container.style.zIndex = '131070';
        container.style.visibility = 'hidden';

        arrow.className = 'mce-tooltip-arrow';
        arrow.style.left = 'initial';
        tooltip.className = 'mce-tooltip-inner';
        tooltip.innerHTML = text;

        container.appendChild(arrow);
        container.appendChild(tooltip);

        return container;
    }

    createTooltip = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.stopPropagation();
        this.destroyTooltip();
        const rect = e.target.getBoundingClientRect();
        const tooltip = this.generateTooltip(this.props['data-tooltip']);
        const arrow = tooltip.children[0] as HTMLDivElement;

        document.body.appendChild(tooltip);

        tooltip.style.left = (rect.left + 20 - (tooltip.getBoundingClientRect().width / 2)) + 'px';
        tooltip.style.top = (rect.top + rect.height + window.scrollY) + 'px';
        arrow.style.right = `calc(${tooltip.getBoundingClientRect().right - rect.right + 20}px - 3px)`;
        tooltip.style.visibility = '';
    }

    destroyTooltip() {
        let existingTooltip = document.getElementById('abt-reflist-tooltip');
        if (existingTooltip) existingTooltip.parentElement.removeChild(existingTooltip);
    }

    render() {
        this.destroyTooltip();
        return (
            <a
                {...this.props}
                className={this.props.disabled ? 'abt-reflist-button disabled' : 'abt-reflist-button'}
                onMouseOver={this.props['data-tooltip'] ? this.createTooltip : null}
                onMouseLeave={this.props['data-tooltip'] ? this.destroyTooltip : null}
            />
        );
    }
}
