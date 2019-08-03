import { createBlock, parse } from '@wordpress/blocks';
import { dispatch, select } from '@wordpress/data';

import { ZERO_WIDTH_SPACE } from 'utils/constants';
import { createSelector } from 'utils/dom';
import { getEditorDOM } from 'utils/editor';
import { CitationElement, FootnoteElement } from 'utils/element';
import Processor from 'utils/processor';

import { Style } from './';
import { Actions } from './constants';
import { fetchLocale, fetchStyle, saveState } from './controls';

export function* addReference(data: CSL.Data) {
    yield addReferences([data]);
}

export function* addReferences(data: CSL.Data[]) {
    yield {
        type: Actions.ADD_REFERENCES,
        data,
    };
    yield save();
}

export function* removeFootnote(id: string) {
    yield removeFootnotes([id]);
}

export function* removeFootnotes(itemIds: string[]) {
    const doc = getEditorDOM();
    let removedItems = 0;
    for (const footnote of doc.querySelectorAll(FootnoteElement.selector)) {
        if (itemIds.includes(`${footnote.id}-ref`) && footnote.parentNode) {
            footnote.parentNode.removeChild(footnote);
            removedItems++;
        }
    }
    if (removedItems > 0) {
        yield save();
    }
}

export function* removeReference(id: string) {
    yield removeReferences([id]);
}

export function* removeReferences(itemIds: string[]) {
    const doc = getEditorDOM();
    const toDelete = [
        ...doc.querySelectorAll<HTMLSpanElement>(CitationElement.selector),
    ].reduce(
        (idsToDelete, citation) => {
            const existingIds = CitationElement.getItems(citation);
            const filteredItemIds = existingIds.filter(
                id => !itemIds.includes(id),
            );
            if (filteredItemIds.length === 0 && citation.parentNode) {
                citation.parentNode.removeChild(citation);
            } else {
                citation.dataset.items = JSON.stringify(filteredItemIds);
            }
            return idsToDelete.filter(id => !existingIds.includes(id));
        },
        [...itemIds],
    );

    yield dispatch('core/block-editor').resetBlocks(parse(doc.innerHTML));
    if (toDelete.length > 0) {
        yield {
            type: Actions.REMOVE_REFERENCES,
            itemIds: toDelete,
        };
        yield save();
    }
}

export function* updateReference(data: CSL.Data) {
    const itemIsCited =
        select('abt/data')
            .getCitedItems()
            .findIndex(item => item.id === data.id) >= 0;
    yield {
        type: Actions.UPDATE_REFERENCE,
        data,
    };
    if (itemIsCited) {
        yield parseCitations();
    }
    yield save();
}

export function* removeAllCitations() {
    const doc = getEditorDOM();
    for (const el of doc.querySelectorAll(CitationElement.selector)) {
        if (el.parentNode) {
            el.parentNode.removeChild(el);
        }
    }
    yield dispatch('core/block-editor').resetBlocks(parse(doc.innerHTML));
}

export function* parseCitations() {
    const styleXml: string = yield fetchStyle();
    yield fetchLocale(styleXml);
    const processor = new Processor(styleXml);
    const citations = processor.parseCitations(
        select('abt/data').getCitationsByIndex(),
    );
    yield setBibliography(processor.bibliography);
    yield updateEditorCitations(citations);
}

export function* parseFootnotes() {
    const doc = getEditorDOM();
    doc.querySelectorAll(FootnoteElement.selector).forEach((footnote, i) => {
        footnote.innerHTML = FootnoteElement.createMarker(i);
    });
    yield dispatch('core/block-editor').resetBlocks(parse(doc.innerHTML));
    yield setFootnotes();
}

export function* setStyle(style: Style) {
    yield {
        type: Actions.SET_STYLE,
        style,
    };
    yield parseCitations();
    yield save();
}

function* save() {
    yield saveState();
    yield dispatch('core/editor').autosave();
}

function* setBibliography({ items, meta }: Processor.Bibliography) {
    const blocksList = select('core/block-editor').getBlocks();
    const bibliographyBlock = blocksList.find(
        block => block.name === 'abt/bibliography',
    );
    if (items.length > 0 && bibliographyBlock) {
        yield dispatch('core/block-editor').updateBlockAttributes(
            bibliographyBlock.clientId,
            { ...meta, items },
        );
    } else if (items.length > 0 && !bibliographyBlock) {
        yield dispatch('core/block-editor').insertBlock(
            createBlock('abt/bibliography', {
                ...meta,
                items,
            }),
            blocksList.length,
            undefined,
            false,
        );
    } else if (items.length === 0 && bibliographyBlock) {
        yield dispatch('core/block-editor').removeBlock(
            bibliographyBlock.clientId,
        );
    }
}

function* setFootnotes() {
    const items = select('abt/data').getFootnotes();
    const blocksList = select('core/block-editor').getBlocks();
    const footnoteBlockIndex = blocksList.findIndex(
        ({ name }) => name === 'abt/footnotes',
    );
    const bibliographyBlockIndex = blocksList.findIndex(
        ({ name }) => name === 'abt/bibliography',
    );
    if (items.length > 0 && footnoteBlockIndex >= 0) {
        yield dispatch('core/block-editor').updateBlockAttributes(
            blocksList[footnoteBlockIndex].clientId,
            { items },
        );
    } else if (items.length > 0 && footnoteBlockIndex === -1) {
        yield dispatch('core/block-editor').insertBlock(
            createBlock('abt/footnotes', {
                items,
            }),
            bibliographyBlockIndex > 0
                ? bibliographyBlockIndex
                : blocksList.length,
            undefined,
            false,
        );
    } else if (items.length === 0 && footnoteBlockIndex >= 0) {
        yield dispatch('core/block-editor').removeBlock(
            blocksList[footnoteBlockIndex].clientId,
        );
    }
}

function* updateEditorCitations(citations: Processor.CitationMeta[]) {
    const doc = getEditorDOM();
    for (const { html, id, sortedItems } of citations) {
        const node = doc.querySelector<HTMLElement>(
            createSelector(
                ...CitationElement.legacyClassNames.map(cls => ({
                    classNames: [cls],
                    attributes: { id },
                })),
            ),
        );
        if (node) {
            node.innerHTML = html;
            node.dataset.items = sortedItems;
            if (node.firstElementChild) {
                node.dataset.hasChildren = 'true';
                node.firstElementChild.innerHTML =
                    ZERO_WIDTH_SPACE +
                    node.firstElementChild.innerHTML +
                    ZERO_WIDTH_SPACE;
            } else {
                delete node.dataset.hasChildren;
                node.innerHTML = ZERO_WIDTH_SPACE + html + ZERO_WIDTH_SPACE;
            }
        }
    }
    yield dispatch('core/block-editor').resetBlocks(parse(doc.innerHTML));
}
