interface CCHProps {
    id: string;
    items: string[];
}

export function createCitationHtml({ id, items }: CCHProps): string {
    const TERMINATOR = '&#65279;';
    const citation = document.createElement('span');
    citation.className = 'abt-citation';
    citation.dataset.id = id;
    citation.dataset.items = JSON.stringify(items);
    citation.contentEditable = 'false';
    return `${citation.outerHTML}${TERMINATOR}`;
}
