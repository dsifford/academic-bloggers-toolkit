
declare var DocumentTouch;


module ABT_Frontend {


  export class Accordion {

    private _headings: NodeList;

    constructor() {
      this._headings = document.querySelectorAll('#abt_PR_boxes > h3');

      for (let heading of (<any>this._headings)) {
        let reviewContent: HTMLElement = heading.nextSibling;
        reviewContent.style.display = 'none';

        heading.addEventListener('click', this._clickHandler);
      }

    }

    private _clickHandler(e: Event): void {

      let targetContent = <HTMLElement>e.srcElement.nextSibling;

      // If targetContent already visible, hide it and exit
      if (targetContent.style.display != 'none') {
        targetContent.style.display = 'none';
        return;
      }

      let accordionNodes = e.srcElement.parentElement.childNodes;
      let element: HTMLElement;

      for (element of <any>accordionNodes) {
        if (element.tagName != 'DIV') { continue; }
        if (element.previousSibling === e.srcElement) {
          element.style.display = '';
          continue;
        }
        element.style.display = 'none';
      }

    }

  }


  export class Citations {

    public static timer: number;

    constructor() {
      let referenceList: HTMLOListElement = this._getReferenceList();
      let citationList: NodeListOf<Element> = document.querySelectorAll('span.cite');
      let citation: HTMLSpanElement;

      for (citation of <any>citationList) {

        let citeNums: number[] = JSON.parse(citation.dataset['reflist']);
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
        citation.dataset['citations'] = citationHTML.join('');

        // Conditionally create tooltip based on device
        if (this._isTouchDevice()) {
          citation.addEventListener('touchstart', this._createTooltip.bind(this));
        } else {
          citation.addEventListener('mouseover', this._createTooltip.bind(this));
          citation.addEventListener('mouseout', this._destroyTooltip);
        }

      }

    }


    private _getReferenceList(): HTMLOListElement {
      let orderedLists: NodeListOf<HTMLOListElement> = document.getElementsByTagName('ol');
      for (let i = (orderedLists.length - 1); i >= 0; i--){
        if (orderedLists[i].parentElement.className !== 'abt_chat_bubble') {
          return orderedLists[i];
        }
      }
    }


    private _isTouchDevice(): boolean {
      return true == ("ontouchstart" in window || (<any>window).DocumentTouch && document instanceof DocumentTouch);
    }


    private _createTooltip(e: Event): void {

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
        closeButton.className = 'abt_tooltip_touch_close';
        closeButton.addEventListener('touchend', () => tooltip.remove());

        tooltip.style.left = '0';
        tooltip.style.right = '0';
        tooltip.style.maxWidth = '90%'
        tooltip.appendChild(closeButton);
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
        tooltip.style.top = (rect.bottom + window.scrollY + 5) + 'px';
        tooltipArrow.style.top = '-15px';
        tooltipArrow.style.borderColor = 'transparent transparent #fff';
      } else {
        tooltip.style.top = (rect.top + window.scrollY - tooltip.offsetHeight - 5) + 'px';
        tooltipArrow.style.bottom = '-15px';
        tooltipArrow.style.borderColor = '#fff transparent transparent';
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

  new ABT_Frontend.Citations();
  new ABT_Frontend.Accordion();

}
