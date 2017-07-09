class Citations {
    public static isTouchDevice: boolean = true ===
        ('ontouchstart' in window || (window.DocumentTouch && document instanceof DocumentTouch));
    public bibliography: HTMLDivElement;

    constructor() {
        this.bibliography = <HTMLDivElement>document.querySelector(
            '#abt-bibliography, #abt-smart-bib'
        );
        const citationList = <NodeListOf<HTMLSpanElement>>document.querySelectorAll(
            '.abt-citation, .abt_cite'
        );
        const container = document.getElementById('abt-bibliography__container')
            ? document.getElementById('abt-bibliography__container')!
            : this.bibliography;

        Array.from(citationList).forEach(citation => {
            const reflist: string[] = JSON.parse(citation.getAttribute('data-reflist')!);
            citation.setAttribute(
                'data-citations',
                reflist.map(id => container.children.namedItem(id)!.outerHTML).join('')
                // reflist.map(id => container.children[id].outerHTML).join('')
            );
            citation.addEventListener('click', this.createTooltip);
        });

        if (document.querySelector('.abt-bibliography__heading_toggle, #abt-smart-bib>h3.toggle'))
            this.enableToggle();
    }

    private createTooltip(e: any): void {
        const existingTooltip = document.getElementById('abt-tooltip');
        if (existingTooltip) existingTooltip.parentElement!.removeChild(existingTooltip);

        const rect: ClientRect = e.currentTarget.getBoundingClientRect();
        const left = rect.left + rect.width / 2;
        const padding: number = 10;
        const margin: number = 10;

        const tooltip = document.createElement('div');
        tooltip.id = tooltip.className = 'abt-tooltip';
        tooltip.innerHTML = e.currentTarget.getAttribute('data-citations');

        const callout = document.createElement('div');
        callout.className = 'abt-tooltip__callout';

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'abt-tooltip__close-button-container';
        buttonContainer.addEventListener('click', () =>
            tooltip.parentElement!.removeChild(tooltip)
        );

        const button = document.createElement('div');
        button.className = 'abt-tooltip__close-button';

        document.body.appendChild(tooltip);
        tooltip.appendChild(callout);
        tooltip.appendChild(buttonContainer);
        buttonContainer.appendChild(button);

        const tooltipWiderThanBody: boolean =
            tooltip.offsetWidth + margin + padding >= document.body.offsetWidth;
        const tooltipWouldOverflowLeft: boolean = padding + tooltip.offsetWidth / 2 > left;
        const tooltipWouldOverflowRight: boolean =
            left > document.body.offsetWidth / 2 &&
            document.body.offsetWidth - left < padding + tooltip.offsetWidth / 2;

        const marginLeft = -1 * (tooltip.offsetWidth / 2) || 0;

        if (left + marginLeft < 0 || tooltipWiderThanBody) {
            tooltip.style.width = 'calc(100% - 25px)';
            tooltip.style.left = '10px';
        } else if (tooltipWouldOverflowRight) {
            tooltip.style.right = '5px';
            tooltip.style.marginRight = '5px';
        } else if (tooltipWouldOverflowLeft) {
            tooltip.style.left = left + 'px';
            tooltip.style.marginLeft = marginLeft + margin + 'px';
        } else {
            tooltip.style.left = left + 'px';
            tooltip.style.marginLeft = marginLeft + 'px';
        }

        if (tooltipWiderThanBody || tooltipWouldOverflowLeft) {
            callout.style.left = `${left - 10 - callout.offsetWidth / 2}px`;
        } else if (tooltipWouldOverflowRight) {
            callout.style.right = `${document.body.offsetWidth - left - 20}px`;
        } else {
            callout.style.left = `calc(50% - ${callout.offsetWidth / 2}px)`;
        }

        if (rect.top - tooltip.offsetHeight < 0) {
            // On bottom - Upwards arrow
            tooltip.style.top = rect.bottom + window.pageYOffset + 10 + 'px';
            tooltip.classList.add('abt-tooltip_bottom');
            callout.classList.add('abt-tooltip__callout_up');
        } else {
            // On top - Downwards arrow
            tooltip.style.top = rect.top + window.pageYOffset - tooltip.offsetHeight - 10 + 'px';
            tooltip.classList.add('abt-tooltip_top');
            callout.classList.add('abt-tooltip__callout_down');
        }

        tooltip.classList.add('abt-tooltip_active');
    }

    private enableToggle(): void {
        const citations = document.querySelectorAll('#abt-bibliography>div, #abt-smart-bib>div');
        const heading = document.querySelector(
            '.abt-bibliography__heading_toggle, #abt-smart-bib>h3.toggle'
        )!;
        let container = document.getElementById('abt-bibliography__container')!;

        if (!container) {
            container = document.createElement('div');
            container.id = 'abt-bibliography__container';
            this.bibliography.appendChild(container);
            for (const el of Array.from(citations)) {
                container.appendChild(el);
            }
        }

        container.classList.toggle('abt-bibligraphy__container--hidden');
        heading.classList.toggle('abt-bibliography__heading_toggle--closed');

        heading.addEventListener('click', () => {
            container.classList.toggle('abt-bibligraphy__container--hidden');
            heading.classList.toggle('abt-bibliography__heading_toggle--closed');
        });
    }
}

if (document.readyState === 'interactive') {
    frontendJS();
} else {
    document.addEventListener('DOMContentLoaded', frontendJS);
}

export function frontendJS() {
    new Citations();
}
