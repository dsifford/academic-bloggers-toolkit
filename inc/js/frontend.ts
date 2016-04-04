
declare var DocumentTouch;


namespace ABT_Frontend {


  export class Accordion {

    private _headings: NodeListOf<HTMLHeadingElement>;

    constructor() {
      this._headings = (document.getElementsByClassName('abt_PR_heading') as NodeListOf<HTMLHeadingElement>);

      for (let i = 0; i < this._headings.length; i++) {
        let currentHeading = this._headings[i];
        let reviewContent = (currentHeading.nextElementSibling as HTMLDivElement);

        reviewContent.style.display = 'none';
        currentHeading.addEventListener('click', this._clickHandler);
      }

    }

    private _clickHandler(e: Event): void {

      let targetContent = (e.srcElement.nextSibling as HTMLDivElement);

      // If targetContent already visible, hide it and exit
      if (targetContent.style.display != 'none') {
        targetContent.style.display = 'none';
        return;
      }

      let accordionChildren = e.srcElement.parentElement.children;

      for (let i = 0; i < accordionChildren.length; i++) {

        let currentElement = accordionChildren[i] as HTMLElement;

        if (currentElement.tagName != 'DIV') { continue; }

        if (currentElement.previousSibling === e.srcElement) {
          currentElement.style.display = '';
          continue;
        }

        currentElement.style.display = 'none';
      }

    }

  }


  export class Citations {

    public static timer: number;

    constructor() {
      let referenceList = (document.getElementById('abt-smart-bib') as HTMLOListElement);
      let citationList = document.getElementsByClassName('abt_cite')

      for (let i = 0; i < citationList.length; i++) {

        let citeNums: number[] = JSON.parse((citationList[i] as HTMLSpanElement).dataset['reflist']);
        let citationHTML = citeNums.map((citeNum: number): string => {
          // Correct for zero-based index
          citeNum--;

          // Handle error silently if citeNum is outside the indices of the reference list
          if (!referenceList.children[citeNum]) { return; }

          return (
              `<div style="display: flex;">` +
                `<span>` +
                  `<strong>${citeNum + 1}. </strong>` +
                  `${referenceList.children[citeNum].innerHTML}` +
                `</span>` +
              `</div>`
          );
        });

        // Save CSV string of citenums as data attr 'citations'
        (citationList[i] as HTMLSpanElement).dataset['citations'] = citationHTML.join('');

        // Conditionally create tooltip based on device
        if (this._isTouchDevice()) {
          citationList[i].addEventListener('touchstart', this._createTooltip.bind(this));
        } else {
          citationList[i].addEventListener('mouseover', this._createTooltip.bind(this));
          citationList[i].addEventListener('mouseout', this._destroyTooltip);
        }

      }

    }


    private _isTouchDevice(): boolean {
      return true == ("ontouchstart" in window || (<any>window).DocumentTouch && document instanceof DocumentTouch);
    }


    private _createTooltip(e: Event): void {
      e.preventDefault();
      clearTimeout(Citations.timer);

      let preExistingTooltip: HTMLElement = document.getElementById('abt_tooltip');
      if (preExistingTooltip !== null) {
        preExistingTooltip.remove();
      }

      let rect: ClientRect = e.srcElement.getBoundingClientRect();

      let tooltip: HTMLDivElement = document.createElement('div');
      tooltip.className = tooltip.id = 'abt_tooltip';
      tooltip.innerHTML = e.srcElement.getAttribute('data-citations');
      tooltip.style.visibility = 'hidden';

      let tooltipArrow: HTMLDivElement = document.createElement('div');
      tooltipArrow.className = 'abt_tooltip_arrow';


      if (this._isTouchDevice()) {

        let closeButton: HTMLDivElement = document.createElement('div');
        let touchContainer: HTMLDivElement = document.createElement('div');

        touchContainer.className = 'abt_tooltip_touch_close-container';
        closeButton.className = 'abt_tooltip_touch_close';
        touchContainer.addEventListener('touchend', () => tooltip.remove());

        tooltip.style.left = '0';
        tooltip.style.right = '0';
        tooltip.style.maxWidth = '90%'

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
        tooltip.addEventListener('mouseover', () => clearTimeout(Citations.timer) );
        tooltip.addEventListener('mouseout', this._destroyTooltip);

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

    private _destroyTooltip(): void {
      Citations.timer = setTimeout(() => {
        document.getElementById('abt_tooltip').remove();
      }, 200);
    }

  }

}



if (document.readyState != 'loading'){
	frontendJS();
} else {
	document.addEventListener('DOMContentLoaded', frontendJS);
}


function frontendJS() {

  new ABT_Frontend.Citations;
  new ABT_Frontend.Accordion;

}
