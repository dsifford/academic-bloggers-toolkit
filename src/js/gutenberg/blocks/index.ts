export function stripListItem(item: string): string;
export function stripListItem(item: Element): string;
export function stripListItem(item: Element | string): string {
    if (typeof item === 'string') {
        const container = document.createElement('div');
        container.innerHTML = item;
        const child = container.querySelector('.csl-entry');
        if (child) {
            item = child;
        } else {
            throw new Error(
                'Outer HTML of item must be a div with className "csl-entry"',
            );
        }
    }
    const content = item;
    let toRemove: Element[] = [];
    for (const el of item.children) {
        if (el.classList.contains('csl-indent')) {
            break;
        }
        if (el.classList.contains('csl-left-margin')) {
            toRemove = [...toRemove, el];
            continue;
        }
        if (el.classList.contains('csl-right-inline')) {
            el.outerHTML = el.innerHTML;
        }
    }
    toRemove.forEach(el => content.removeChild(el));
    return content.innerHTML.trim();
}
