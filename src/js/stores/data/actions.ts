import { Block, createBlock, parse } from '@wordpress/blocks';
import { dispatch, select, subscribe } from '@wordpress/data';
import { RebuildProcessorStateData } from 'citeproc';

import { getEditorDOM, removeItems } from 'utils/editor';
import Processor, { Bibliography } from 'utils/processor';

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

function* setBibliography({ items, meta }: Bibliography) {
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

function* updateEditorCitations(citations: RebuildProcessorStateData[]) {
    const doc = getEditorDOM();
    for (const [id, , html] of citations) {
        const node = doc.querySelector<HTMLElement>(
            `.abt-citation[id="${id}"]`,
        );
        if (node) {
            node.innerHTML = html;
            if (node.childElementCount > 0) {
                node.dataset.hasChildren = 'true';
            }
        }
    }
    yield dispatch('core/editor').resetBlocks(parse(doc.innerHTML));
}
