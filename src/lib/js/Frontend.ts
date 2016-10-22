// tslint:disable:export-name
class Citations {

    public static isTouchDevice: boolean = true === (
        'ontouchstart' in window ||
        (window.DocumentTouch && document instanceof DocumentTouch)
    );
    public bibliography: HTMLDivElement;

    constructor() {
        this.bibliography = <HTMLDivElement>document.querySelector('#abt-bibliography, #abt-smart-bib');
        const citationList = <NodeListOf<HTMLSpanElement>>document.querySelectorAll('.abt-citation, .abt_cite');
        const container = document.getElementById('abt-bibliography__container')
            ? document.getElementById('abt-bibliography__container')
            : this.bibliography;

        [...citationList].forEach(citation => {
            const reflist: string[] = JSON.parse(citation.getAttribute('data-reflist'));
            citation.setAttribute(
                'data-citations',
                reflist.map(id => container.children[id].outerHTML).join('')
            );
            citation.addEventListener('click', this.createTooltip);
        });

        if (document.querySelector('.abt-bibliography__heading_toggle, #abt-smart-bib>h3.toggle')) this.enableToggle();
    }

    private createTooltip(e): void {
        const existingTooltip = document.getElementById('abt-tooltip');
        if (existingTooltip) existingTooltip.parentElement.removeChild(existingTooltip);

        const rect: ClientRect = e.currentTarget.getBoundingClientRect();
        const left = rect.left + (rect.width / 2);

        const tooltip = document.createElement('div');
        tooltip.id = tooltip.className = 'abt-tooltip';
        tooltip.innerHTML = e.currentTarget.getAttribute('data-citations');

        const callout = document.createElement('div');
        callout.className = 'abt-tooltip__callout';

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'abt-tooltip__close-button-container';
        buttonContainer.addEventListener('click', () => tooltip.parentElement.removeChild(tooltip));

        const button = document.createElement('div');
        button.className = 'abt-tooltip__close-button';

        document.body.appendChild(tooltip);
        tooltip.appendChild(callout);
        tooltip.appendChild(buttonContainer);
        buttonContainer.appendChild(button);

        callout.style.left = tooltip.offsetWidth + 20 >= document.body.offsetWidth
            ? `${left + 10 - (callout.offsetWidth / 2)}px`
            : `calc(50% - ${(callout.offsetWidth / 2)}px)`;

        const marginLeft = -1 * (tooltip.offsetWidth / 2) || 0;

        if (left + marginLeft < 0 || tooltip.offsetWidth >= document.body.offsetWidth) {
            tooltip.style.left = '5px';
            tooltip.style.right = '5px';
            tooltip.style.marginLeft = '5px';
            tooltip.style.marginRight = '5px';
        }
        else {
            tooltip.style.left = left + 'px';
            tooltip.style.marginLeft = marginLeft + 'px';
        }

        if ((rect.top - tooltip.offsetHeight) < 0) {
            // On bottom - Upwards arrow
            tooltip.style.top = (rect.bottom + window.scrollY + 10) + 'px';
            tooltip.classList.add('abt-tooltip_bottom');
            callout.classList.add('abt-tooltip__callout_up');
        }
        else {
            // On top - Downwards arrow
            tooltip.style.top = (rect.top + window.scrollY - tooltip.offsetHeight - 10) + 'px';
            tooltip.classList.add('abt-tooltip_top');
            callout.classList.add('abt-tooltip__callout_down');
        }

        tooltip.classList.add('abt-tooltip_active');
    }

    private enableToggle(): void {
        const citations = document.querySelectorAll('#abt-bibliography>div, #abt-smart-bib>div');
        const heading = document.querySelector('.abt-bibliography__heading_toggle, #abt-smart-bib>h3.toggle');
        let container = document.getElementById('abt-bibibliography__container');

        if (!container) {
            container = document.createElement('div');
            container.id = 'abt-bibibliography__container';
            this.bibliography.appendChild(container);
            for (const el of citations) {
                container.appendChild(el);
            }
        }
        container.style.display = 'none';
        heading.classList.toggle('abt-hidden');

        heading.addEventListener('click', () => {
            container.style.display = container.style.display === 'none' ? '' : 'none';
            heading.classList.toggle('abt-hidden');
        });
    }
}

if (document.readyState === 'interactive') {
    frontendJS();
}
else {
    document.addEventListener('DOMContentLoaded', frontendJS);
}

export function frontendJS() {
    new Citations();
}
