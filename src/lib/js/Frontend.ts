
class Citations {

    public timer: NodeJS.Timer;
    public bibliography: HTMLDivElement;
    public isTouchDevice: boolean = true === (
        'ontouchstart' in window ||
        (window.DocumentTouch && document instanceof DocumentTouch)
    );

    constructor() {
        this.bibliography = <HTMLDivElement>document.getElementById('abt-smart-bib');
        const citationList = <NodeListOf<HTMLSpanElement>>document.querySelectorAll('.abt_cite');

        [...citationList].forEach(citation => {
            const reflist: string[] = JSON.parse(citation.dataset['reflist']);
            citation.dataset['citations'] = reflist.map(id => this.bibliography.children[id].outerHTML).join('');
            citation.addEventListener('mouseenter', this.createTooltip);
            citation.addEventListener('mouseleave', this.destroyTooltip);
            if (this.isTouchDevice) citation.addEventListener('touchstart', this.createTooltip);
        });

        if (document.querySelector('#abt-smart-bib>h3.toggle')) this.enableToggle();
    }

    private enableToggle() {
        const citations = document.querySelectorAll('#abt-smart-bib>div');
        const heading = document.querySelector('h3.toggle');
        const container = document.createElement('DIV');
        container.id = 'abt-bib-container';
        container.style.display = 'none';
        heading.classList.toggle('abt-hidden');

        this.bibliography.appendChild(container);
        for (const el of citations) {
            container.appendChild(el);
        }

        heading.addEventListener('click', () => {
            container.style.display = container.style.display === 'none' ? '' : 'none';
            heading.classList.toggle('abt-hidden');
        });

    }

    private createTooltip(e): void {
        clearTimeout(this.timer);

        const existingTooltip = document.getElementById('abt_tooltip');
        if (existingTooltip) existingTooltip.parentElement.removeChild(existingTooltip);

        const rect: ClientRect = e.currentTarget.getBoundingClientRect();

        const tooltip: HTMLDivElement = document.createElement('div');
        tooltip.className = tooltip.id = 'abt_tooltip';
        tooltip.innerHTML = e.currentTarget.getAttribute('data-citations');
        tooltip.style.visibility = 'hidden';

        const tooltipArrow: HTMLDivElement = document.createElement('div');
        tooltipArrow.className = 'abt_tooltip_arrow';

        if (this.isTouchDevice) {

            const closeButton: HTMLDivElement = document.createElement('div');
            const touchContainer: HTMLDivElement = document.createElement('div');

            touchContainer.className = 'abt_tooltip_touch_close-container';
            closeButton.className = 'abt_tooltip_touch_close';
            touchContainer.addEventListener('touchend', () => tooltip.parentElement.removeChild(tooltip));

            tooltip.style.left = '0';
            tooltip.style.right = '0';
            tooltip.style.maxWidth = '90%';

            touchContainer.appendChild(closeButton);
            tooltip.appendChild(touchContainer);
            document.body.appendChild(tooltip);
            tooltip.appendChild(tooltipArrow);

            tooltipArrow.style.left = `calc(${rect.left}px - 5% + ${((rect.right - rect.left) / 2)}px - 3px)`;

        } else {

            tooltipArrow.style.left = '50%';
            tooltip.appendChild(tooltipArrow);
            document.body.appendChild(tooltip);
            tooltip.style.marginRight = '10px';
            tooltip.style.maxWidth = (500 > ((rect.left * 2) + ((rect.right - rect.left) / 2)))
                ? (rect.left * 2) + 'px'
                : '500px';
            tooltip.style.left = rect.left + ((rect.right - rect.left) / 2) - (tooltip.clientWidth / 2) + 'px';
            tooltip.addEventListener('mouseenter', () => clearTimeout(this.timer));
            tooltip.addEventListener('mouseleave', this.destroyTooltip);

        }

        // Set tooltip above or below based on window position + set arrow position
        if ((rect.top - tooltip.offsetHeight) < 0) {
            // On bottom - Upwards arrow
            tooltip.style.top = (rect.bottom + window.scrollY + 5) + 'px';
            tooltip.style.animation = 'fadeInUp .2s';
            tooltipArrow.classList.add('abt_arrow_up');
        } else {
            // On top - Downwards arrow
            tooltip.style.top = (rect.top + window.scrollY - tooltip.offsetHeight - 5) + 'px';
            tooltipArrow.classList.add('abt_arrow_down');
        }

        tooltip.style.visibility = '';

    }

    private destroyTooltip(): void {
        this.timer = setTimeout(() => {
            const tip = document.getElementById('abt_tooltip');
            if (tip) tip.parentElement.removeChild(tip);
        }, 200);
    }

}

if (document.readyState === 'interactive') {
    frontendJS();
} else {
    document.addEventListener('DOMContentLoaded', frontendJS);
}

function frontendJS() {
    new Citations();
}
