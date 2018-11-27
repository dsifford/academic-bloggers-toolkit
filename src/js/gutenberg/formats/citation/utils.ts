interface CCHProps {
    id: string;
    innerHTML: string;
    items: string[];
}

export function createCitationHtml({ id, innerHTML, items }: CCHProps): string {
    const TERMINATOR = '&#65279;';
    const citation = document.createElement('span');
    citation.className = 'abt-citation';
    citation.dataset.id = id;
    citation.dataset.items = JSON.stringify(items);
    citation.contentEditable = 'false';
    citation.innerHTML = innerHTML;
    return `${citation.outerHTML}${TERMINATOR}`;
}
