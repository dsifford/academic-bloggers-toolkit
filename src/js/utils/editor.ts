import { Block, serialize } from '@wordpress/blocks';
import { select } from '@wordpress/data';
import _ from 'lodash';
import uuid from 'uuid/v4';

import Processor from 'utils/processor';

const OBJECT_REPLACEMENT_CHARACTER = '\ufffc';

const INVALID_BLOCK_TYPES = ['core/freeform', 'core/html'];

export function createCitationHtml(items: string[]): string {
    const citation = document.createElement('span');
    citation.className = 'abt-citation';
    citation.id = uuid();
    citation.dataset.items = JSON.stringify(items);
    citation.contentEditable = 'false';
    citation.innerText = OBJECT_REPLACEMENT_CHARACTER;
    return citation.outerHTML;
}

export function createFootnoteHtml(note: string) {
    const footnote = document.createElement('span');
    footnote.className = 'abt-footnote';
    footnote.id = uuid();
    footnote.dataset.note = note;
    footnote.contentEditable = 'false';
    footnote.innerText = OBJECT_REPLACEMENT_CHARACTER;
    return footnote.outerHTML;
}

export function getEditorDOM(excludeInvalid: boolean = false): HTMLDivElement {
    const doc = document.createElement('div');
    if (excludeInvalid) {
        const filteredBlocks = select<Block[]>('core/editor')
            .getBlocksForSerialization()
            .filter(
                block =>
                    !INVALID_BLOCK_TYPES.includes(block.name) && block.isValid,
            );
        doc.innerHTML = serialize(filteredBlocks);
    } else {
        doc.innerHTML = select<string>('core/editor').getEditedPostContent();
    }
    return doc;
}

export function parseDataAttrs({
    entryspacing,
    hangingindent,
    maxoffset,
    linespacing,
    secondFieldAlign,
}: { [k in keyof Processor.BibMeta]?: string }) {
    return {
        ...(entryspacing
            ? { 'data-entryspacing': `${entryspacing}` }
            : undefined),
        ...(hangingindent
            ? { 'data-hangingindent': `${hangingindent}` }
            : undefined),
        ...(maxoffset ? { 'data-maxoffset': `${maxoffset}` } : undefined),
        ...(linespacing ? { 'data-linespacing': `${linespacing}` } : undefined),
        ...(secondFieldAlign
            ? { 'data-second-field-align': secondFieldAlign }
            : undefined),
    };
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

export function editorCitation(el: HTMLElement) {
    return {
        getItems: () => editorCitation.getItems(el),
    };
}
export namespace editorCitation {
    export const getItems = (el: HTMLElement): string[] =>
        JSON.parse(el.dataset.items || el.dataset.reflist || '[]');
}
