import { serialize } from '@wordpress/blocks';
import { select } from '@wordpress/data';

import Processor from 'utils/processor';

const INVALID_BLOCK_TYPES = ['core/freeform', 'core/html'];

export function getEditorDOM(excludeInvalid = false): HTMLDivElement {
    const doc = document.createElement('div');
    if (excludeInvalid) {
        const filteredBlocks = select('core/editor')
            .getEditorBlocks()
            .filter(
                block =>
                    !INVALID_BLOCK_TYPES.includes(block.name) && block.isValid,
            );
        doc.innerHTML = serialize(filteredBlocks);
    } else {
        doc.innerHTML = select('core/editor').getEditedPostContent();
    }
    return doc;
}

export function parseBibAttributes({
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
