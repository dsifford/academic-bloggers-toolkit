
declare var DocumentTouch;
declare var ABT_meta: ABT.FrontendMeta;


namespace ABT_Frontend {


    export class Accordion {

        private headings;

        constructor() {
            this.headings = document.getElementsByClassName('abt_PR_heading');

            for (let i = 0; i < this.headings.length; i++) {
                let currentHeading = this.headings[i];
                let reviewContent = (currentHeading.nextElementSibling as HTMLDivElement);

                reviewContent.style.display = 'none';
                currentHeading.addEventListener('click', this._clickHandler);
            }

        }

        private _clickHandler(e: Event): void {

            let targetContent = ((e.target as HTMLElement).nextSibling as HTMLDivElement);

            // If targetContent already visible, hide it and exit
            if (targetContent.style.display !== 'none') {
                targetContent.style.display = 'none';
                return;
            }

            let accordionChildren = (e.target as HTMLElement).parentElement.children;

            for (let i = 0; i < accordionChildren.length; i++) {

                let currentElement = accordionChildren[i] as HTMLElement;

                if (currentElement.tagName !== 'DIV') { continue; }

                if (currentElement.previousSibling === (e.target as HTMLElement)) {
                    currentElement.style.display = '';
                    continue;
                }

                currentElement.style.display = 'none';
            }

        }

    }


    export class Citations {

        public static timer: number;
        public bibliography: HTMLDivElement;

        constructor() {
            this.bibliography = document.getElementById('abt-smart-bib') as HTMLDivElement;
            const citationList = document.getElementsByClassName('abt_cite');

            for (let i = 0; i < citationList.length; i++) {

                const citation = citationList[i] as HTMLSpanElement;
                const citations: string[] = JSON.parse(citation.dataset['reflist']);
                const citationHTML = citations.map((id: string): string => this.bibliography.children[id].outerHTML);

                citation.dataset['citations'] = citationHTML.join('');

                // Conditionally create tooltip based on device
                if (this.isTouchDevice()) {
                    citationList[i].addEventListener('touchstart', this.createTooltip.bind(this));
                } else {
                    citationList[i].addEventListener('mouseover', this.createTooltip.bind(this));
                    citationList[i].addEventListener('mouseout', this.destroyTooltip);
                }

            }

            if (this.bibliography.querySelector('h3.toggle')) this.enableToggle();
        }

        private enableToggle() {
            const citations = document.querySelectorAll('#abt-smart-bib>div');
            const heading = document.querySelector('h3.toggle');
            const container = document.createElement('DIV');
            container.id = 'abt-bib-container';
            container.style.display = 'none';
            heading.classList.toggle('abt-hidden');

            this.bibliography.appendChild(container);
            for (let el of citations) {
                container.appendChild(el);
            }

            heading.addEventListener('click', () => {
                container.style.display =
                    container.style.display === 'none' ? '' : 'none';
                heading.classList.toggle('abt-hidden');
            });

        }

        private isTouchDevice(): boolean {
            return true === ('ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch);
        }


        private createTooltip(e: Event): void {
            e.preventDefault();
            clearTimeout(Citations.timer);

            let preExistingTooltip: HTMLElement = document.getElementById('abt_tooltip');
            if (preExistingTooltip !== null) {
                preExistingTooltip.parentElement.removeChild(preExistingTooltip);
            }

            let rect: ClientRect = (e.target as HTMLElement).getBoundingClientRect();

            let tooltip: HTMLDivElement = document.createElement('div');
            tooltip.className = tooltip.id = 'abt_tooltip';
            tooltip.innerHTML = (e.target as HTMLElement).getAttribute('data-citations');
            tooltip.style.visibility = 'hidden';

            let tooltipArrow: HTMLDivElement = document.createElement('div');
            tooltipArrow.className = 'abt_tooltip_arrow';


            if (this.isTouchDevice()) {

                let closeButton: HTMLDivElement = document.createElement('div');
                let touchContainer: HTMLDivElement = document.createElement('div');

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
                tooltip.style.maxWidth = (500 > ((rect.left * 2) + ((rect.right - rect.left) / 2))) ? (rect.left * 2) + 'px' : '500px';
                tooltip.style.left = rect.left + ((rect.right - rect.left) / 2) - (tooltip.clientWidth / 2) + 'px';
                tooltip.addEventListener('mouseover', () => clearTimeout(Citations.timer));
                tooltip.addEventListener('mouseout', this.destroyTooltip);

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
            Citations.timer = setTimeout(() => {
                let tip = document.getElementById('abt_tooltip');
                tip.parentElement.removeChild(tip);
            }, 200);
        }

    }

}



if (document.readyState === 'interactive') {
    frontendJS();
} else {
    document.addEventListener('DOMContentLoaded', frontendJS);
}


function frontendJS() {

    let options = ABT_meta;

    new ABT_Frontend.Citations();

    if (options.prBoxStyle === 'fixed') {
        Array.from(document.getElementsByClassName('abt_PR_heading')).forEach(heading => heading.className = '');
    }
    else {
        new ABT_Frontend.Accordion();
    }


}
