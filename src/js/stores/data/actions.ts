import { parse } from '@wordpress/blocks';
import { dispatch, select } from '@wordpress/data';
import { Citation } from 'citeproc';

import { styleCache } from 'utils/cache';
import Processor from 'utils/processor';
import { State } from './';
import { Actions, StyleKind } from './constants';
import { fetchLocale, fetchStyle } from './controls';

// Publicly exposed actions
export function* addReference(data: CSL.Data) {
    yield {
        type: Actions.ADD_REFERENCE,
        data,
    };
    yield dispatch('core/editor').editPost(
        select('abt/data').getSerializedState(),
    );
    yield dispatch('core/editor').savePost();
}

export function deleteReference(id: string) {
    return {
        type: Actions.DELETE_REFERENCE,
        id,
    };
}

export function setLocale(locale: string) {
    return {
        type: Actions.SET_LOCALE,
        locale,
    };
}

export function* setStyle(style: State['style']) {
    let csl: string = '';
    if (style.kind === StyleKind.PREDEFINED) {
        csl = yield fetchStyle(style.value);
        // TODO: still need to figure out how to do this with predefined.
        yield fetchLocale(csl);
    }
    yield receiveStyle(style);
    // TODO:
    // --> run a one-off command here to generate a processor, reparse the citations and bib, and exit
    // --> it should prob be its own internal action that can be shared because it will likely be
    // --> used when we insert citations as well.

    return {
        ...(csl ? { csl } : {}),
        style,
    };
}

export function* parseCitations() {
    const style = select<State['style']>('abt/data').getStyle();
    if (style.kind === StyleKind.CUSTOM) {
        throw new Error('Custom styles not implemented yet.');
    }
    const processor = new Processor(styleCache.getItem(style.value)!);
    const citations = processor.parseCitations(
        select<Citation[]>('abt/data').getCitationsByIndex(),
    );
    const doc = document.createElement('div');
    doc.innerHTML = select<string>('core/editor').getEditedPostContent();
    for (const [id, , html] of citations) {
        const node = doc.querySelector(`[data-id="${id}"]`);
        if (node) {
            node.innerHTML = html;
        }
    }
    yield dispatch('core/editor').resetBlocks(parse(doc.innerHTML));
}

// Below are all internal actions not exposed globally. (Generally async "controls").
function receiveStyle(style: State['style']) {
    return {
        type: Actions.RECEIVE_STYLE,
        style,
    };
}
