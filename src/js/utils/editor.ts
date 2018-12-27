import { select } from '@wordpress/data';
import _ from 'lodash';
import uuid from 'uuid/v4';

const OBJECT_REPLACEMENT_CHARACTER = '\ufffc';

export function createCitationHtml(items: string[]): string {
    const citation = document.createElement('span');
    citation.className = 'abt-citation';
    citation.id = uuid();
    citation.dataset.items = JSON.stringify(items);
    citation.contentEditable = 'false';
    citation.innerText = OBJECT_REPLACEMENT_CHARACTER;
    return citation.outerHTML;
}

export function getEditorDOM(): HTMLDivElement {
    const doc = document.createElement('div');
    doc.innerHTML = select<string>('core/editor').getEditedPostContent();
    return doc;
}

export function removeItems(doc: HTMLElement, itemIds: string[]): string[] {
    let toDelete = [...itemIds];
    const elements = doc.querySelectorAll<HTMLSpanElement>('.abt-citation');
    for (const el of elements) {
        let existingIds: string[] = JSON.parse(el.dataset.items || '[]');
        toDelete = toDelete.filter(id => !existingIds.includes(id));
        existingIds = existingIds.filter(id => !itemIds.includes(id));
        if (existingIds.length === 0 && el.parentNode) {
            el.parentNode.removeChild(el);
        } else {
            el.dataset.items = JSON.stringify(existingIds);
        }
    }
    return toDelete;
}

// TODO: WIP
export function editorCitation(el: HTMLElement) {
    return {
        getItems: () => editorCitation.getItems(el),
    };
}
export namespace editorCitation {
    // TODO: Consider removing dataset.reflist check
    export const getItems = (el: HTMLElement): string[] =>
        JSON.parse(el.dataset.items || el.dataset.reflist || '[]');
}
