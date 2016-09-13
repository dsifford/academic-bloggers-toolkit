
/**
 * Utility function used to generate and append tooltips.
 * @param  {HTMLElement}                   target   Target element.
 * @param  {string}                        tip      Tooltip text
 * @param  {'top'|'right'|'bottom'|'left'} position Position of tooltip
 */
export function createTooltip(target: HTMLElement, tip: string, position: 'top'|'right'|'bottom'|'left'): void {
    const rect = target.getBoundingClientRect();
    const top = rect.top + (rect.height / 2);
    let left = rect.left + (rect.width / 2);

    const el = document.createElement('DIV');
    el.id = 'abt-tooltip';
    el.innerText = tip;
    el.classList.add('abt-admin-tooltip');
    document.body.appendChild(el);

    const marginLeft = -1 * (el.offsetWidth / 2) || 0;
    const marginTop = -1 * (el.offsetHeight / 2) || 0;

    if (position === 'left' || position === 'right') {
        left = (rect.width / 2);
        if (top + marginTop < 0) {
            el.style.top = '0';
            el.style.marginTop = '0';
        }
        else {
            el.style.top = top + 'px';
            el.style.marginTop = marginTop + 'px';
        }
    }
    else {
        if (left + marginLeft < 0) {
            el.style.left = '0';
            el.style.marginLeft = '0';
        }
        else {
            el.style.left = left + 'px';
            el.style.marginLeft = marginLeft + 'px';
        }
    }

    switch (position) {
        case 'top':
            el.style.top = rect.top - el.offsetHeight - 10 + 'px';
            break;
        case 'right':
            el.style.left = rect.left + rect.width + 10 + 'px';
            break;
        case 'bottom':
            el.style.top = rect.top + rect.height + 10 + 'px';
            break;
        case 'left':
        default:
            el.style.left = rect.left - el.offsetWidth - 10 + 'px';
    }

    el.classList.add('active');
}

/**
 * Utility function used to destroy existing tooltips
 */
export function destroyTooltip(): void {
    const el = document.getElementById('abt-tooltip');
    if (el) el.parentElement.removeChild(el);
}
