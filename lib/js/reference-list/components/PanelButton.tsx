import * as React from 'react';

export class PanelButton extends React.Component<React.HTMLProps<HTMLButtonElement>, {}> {

    generateTooltip(text: string): HTMLDivElement {
        let container = document.createElement('DIV') as HTMLDivElement;
        let arrow = document.createElement('DIV') as HTMLDivElement;
        let tooltip = document.createElement('DIV') as HTMLDivElement;

        container.id = 'abt-reflist-tooltip';
        container.className = 'mce-widget mce-tooltip mce-tooltip-n';
        container.style.zIndex = '131070';
        container.style.visibility = 'hidden';

        arrow.className = 'mce-tooltip-arrow';
        tooltip.className = 'mce-tooltip-inner';
        tooltip.innerHTML = text;

        container.appendChild(arrow);
        container.appendChild(tooltip);

        return container;
    }

    createTooltip(e: InputEvent) {
        e.stopPropagation();
        this.destroyTooltip();

        let tooltip = this.generateTooltip(this.props['data-tooltip']);
        document.body.appendChild(tooltip);

        let targetRect = e.target.getBoundingClientRect();
        let tooltipRect = tooltip.getBoundingClientRect();

        tooltip.style.left = (targetRect.left + 20 - (tooltipRect.width / 2)) + 'px';
        tooltip.style.top = (targetRect.top + targetRect.height + window.scrollY) + 'px';
        tooltip.style.visibility = '';
    }

    destroyTooltip() {
        let existingTooltip = document.getElementById('abt-reflist-tooltip');
        if (existingTooltip) existingTooltip.parentElement.removeChild(existingTooltip);
    }

    render() {
        this.destroyTooltip();
        return (
            <button {...this.props}
                className='abt-reflist-button'
                onMouseOver={this.createTooltip.bind(this)}
                onMouseLeave={this.destroyTooltip} />
        );
    }


}
