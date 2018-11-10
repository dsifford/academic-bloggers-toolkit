import domReady from '_legacy/utils/dom-ready';

import 'css/frontend.scss';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

// tslint:disable-next-line cyclomatic-complexity
export function createTooltip(e: MouseEvent): void {
    const citation = <HTMLSpanElement>e.currentTarget;
    const existingTooltip = document.getElementById('abt-tooltip');
    if (existingTooltip) {
        existingTooltip.parentElement!.removeChild(existingTooltip);
    }

    const rect: ClientRect = citation.getBoundingClientRect();
    const left = rect.left + rect.width / 2;
    const padding: number = 10;
    const margin: number = 10;

    const tooltip = document.createElement('div');
    tooltip.id = tooltip.className = 'abt-tooltip';
    tooltip.innerHTML = citation.dataset.citations!;

    const callout = document.createElement('div');
    callout.className = 'abt-tooltip__callout';

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'abt-tooltip__close-button-container';
    buttonContainer.addEventListener('click', () =>
        tooltip.parentElement!.removeChild(tooltip),
    );

    const button = document.createElement('div');
    button.className = 'abt-tooltip__close-button';

    document.body.appendChild(tooltip);
    tooltip.appendChild(callout);
    tooltip.appendChild(buttonContainer);
    buttonContainer.appendChild(button);

    const tooltipWiderThanBody: boolean =
        tooltip.offsetWidth + margin + padding >= document.body.offsetWidth;
    const tooltipWouldOverflowLeft: boolean =
        padding + tooltip.offsetWidth / 2 > left;
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
        tooltip.style.top =
            rect.top + window.pageYOffset - tooltip.offsetHeight - 10 + 'px';
        tooltip.classList.add('abt-tooltip_top');
        callout.classList.add('abt-tooltip__callout_down');
    }

    tooltip.classList.add('abt-tooltip_active');
}

export class Frontend {
    static isTouchDevice: boolean =
        true === 'ontouchstart' in window ||
        (window.DocumentTouch && document instanceof DocumentTouch);
    bibliography: Element | null;
    itemContainer!: Element;

    constructor() {
        this.bibliography = document.querySelector(
            '#abt-bibliography, #abt-smart-bib',
        );

        if (!this.bibliography) {
            return;
        }

        this.itemContainer =
            document.getElementById('abt-bibliography__container') ||
            this.bibliography;

        const citationList: NodeListOf<
            HTMLSpanElement
        > = document.querySelectorAll('.abt-citation, .abt_cite');

        for (const citation of [...citationList]) {
            const reflist: string[] = JSON.parse(
                citation.dataset.reflist || '[]',
            );
            citation.dataset.citations = reflist
                .map(id => this.itemContainer.children.namedItem(id)!.outerHTML)
                .join('');
            citation.addEventListener('click', createTooltip);
        }

        if (
            document.querySelector(
                '.abt-bibliography__heading_toggle, #abt-smart-bib>h3.toggle',
            )
        ) {
            this.enableToggle();
        }
    }

    private enableToggle(): void {
        const heading: HTMLButtonElement | null = document.querySelector(
            '.abt-bibliography__heading_toggle',
        );
        if (!this.itemContainer || !heading) {
            return;
        }

        const headingLevel = <HeadingLevel | undefined>(
            heading.dataset.headingLevel
        );

        if (headingLevel) {
            heading.style.font = this.getHeadingFont(headingLevel);
        }

        this.itemContainer.classList.add('abt-bibligraphy__container--hidden');
        heading.classList.add('abt-bibliography__heading_toggle--closed');
        heading.addEventListener('click', () => {
            heading.setAttribute(
                'aria-expanded',
                JSON.stringify(
                    heading.classList.contains(
                        'abt-bibliography__heading_toggle--closed',
                    ),
                ),
            );
            heading.classList.toggle(
                'abt-bibliography__heading_toggle--closed',
            );
            this.itemContainer.classList.toggle(
                'abt-bibligraphy__container--hidden',
            );
        });
    }

    private getHeadingFont(headingLevel: HeadingLevel): string | null {
        const tempHeading = document.createElement(headingLevel);
        tempHeading.style.display = 'none';
        document.body.appendChild(tempHeading);
        const { font } = getComputedStyle(tempHeading);
        document.body.removeChild(tempHeading);
        return font;
    }
}

(async (): Promise<void> => {
    await domReady();
    // Inevitable here due to imperative API
    // tslint:disable-next-line:no-unused-expression
    new Frontend();
})();
