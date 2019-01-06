import { Block, createBlock, parse } from '@wordpress/blocks';
import { dispatch, select, subscribe } from '@wordpress/data';

import { getEditorDOM, removeItems } from 'utils/editor';
import { generateFootnoteMarker } from 'utils/formats';
import Processor from 'utils/processor';

import { Style } from './';
import { Actions } from './constants';
import { fetchLocale, fetchStyle } from './controls';

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

export function* removeReference(id: string) {
    yield removeReferences([id]);
}

export function* removeReferences(itemIds: string[]) {
    const doc = getEditorDOM();
    const toDelete = removeItems(doc, itemIds);
    yield {
        type: Actions.REMOVE_REFERENCES,
        itemIds: toDelete,
    };
    if (toDelete.length !== itemIds.length) {
        yield dispatch('core/editor').resetBlocks(parse(doc.innerHTML));
    }
    yield save();
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
    for (const el of doc.querySelectorAll('.abt-citation')) {
        if (el.parentNode) {
            el.parentNode.removeChild(el);
        }
    }
    yield dispatch('core/editor').resetBlocks(parse(doc.innerHTML));
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
    doc.querySelectorAll('.abt-footnote').forEach((footnote, i) => {
        footnote.innerHTML = generateFootnoteMarker(i);
    });
    yield dispatch('core/editor').resetBlocks(parse(doc.innerHTML));
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
    yield dispatch('core/editor').editPost(
        select('abt/data').getSerializedState(),
    );
    const unsubscribe = subscribe(() => {
        const notice = select<Array<{ id: string }>>('core/notices')
            .getNotices()
            .find(({ id }) => id === 'SAVE_POST_NOTICE_ID');
        if (notice) {
            dispatch('core/notices').removeNotice('SAVE_POST_NOTICE_ID');
            unsubscribe();
        }
    });
    yield dispatch('core/editor').savePost();
}

function* setBibliography({ items, meta }: Processor.Bibliography) {
    const blocksList = select<Block[]>('core/editor').getBlocks();
    const bibliographyBlock = blocksList.find(
        block => block.name === 'abt/bibliography',
    );
    if (items.length > 0 && bibliographyBlock) {
        yield dispatch('core/editor').updateBlockAttributes(
            bibliographyBlock.clientId,
            { ...meta, items },
        );
    } else if (items.length > 0 && !bibliographyBlock) {
        yield dispatch('core/editor').insertBlock(
            createBlock('abt/bibliography', {
                ...meta,
                items,
            }),
            blocksList.length,
            undefined,
            true,
        );
    } else if (items.length === 0 && bibliographyBlock) {
        yield dispatch('core/editor').removeBlock(bibliographyBlock.clientId);
    }
}

function* setFootnotes() {
    const items = select('abt/data').getFootnotes();
    const blocksList = select<Block[]>('core/editor').getBlocks();
    const footnoteBlockIndex = blocksList.findIndex(
        ({ name }) => name === 'abt/footnotes',
    );
    const bibliographyBlockIndex = blocksList.findIndex(
        ({ name }) => name === 'abt/bibliography',
    );
    if (items.length > 0 && footnoteBlockIndex >= 0) {
        yield dispatch('core/editor').updateBlockAttributes(
            blocksList[footnoteBlockIndex].clientId,
            { items },
        );
    } else if (items.length > 0 && footnoteBlockIndex === -1) {
        yield dispatch('core/editor').insertBlock(
            createBlock('abt/footnotes', {
                items,
            }),
            bibliographyBlockIndex > 0
                ? bibliographyBlockIndex
                : blocksList.length,
            undefined,
            true,
        );
    } else if (items.length === 0 && footnoteBlockIndex >= 0) {
        yield dispatch('core/editor').removeBlock(
            blocksList[footnoteBlockIndex].clientId,
        );
    }
}

function* updateEditorCitations(citations: Processor.CitationMeta[]) {
    const doc = getEditorDOM();
    for (const { html, id, sortedItems } of citations) {
        const node = doc.querySelector<HTMLElement>(
            `.abt-citation[id="${id}"]`,
        );
        if (node) {
            node.innerHTML = html;
            node.dataset.items = sortedItems;
            if (node.childElementCount > 0) {
                node.dataset.hasChildren = 'true';
            }
        }
    }
    yield dispatch('core/editor').resetBlocks(parse(doc.innerHTML));
}
