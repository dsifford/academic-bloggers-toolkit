import { parse } from '@wordpress/blocks';
import { dispatch, select } from '@wordpress/data';
import { Bibliography } from 'citeproc';

import { styleCache } from 'utils/cache';
import { mergeItems } from 'utils/editor';
import Processor from 'utils/processor';

import { State } from './';
import { Actions, StyleKind } from './constants';
import { fetchLocale, fetchStyle } from './controls';

// Publicly exposed actions
export function* addReference(data: CSL.Data) {
    yield { type: Actions.ADD_REFERENCE, data };
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

export function setBibliography(bibliography: Bibliography) {
    return {
        type: Actions.SET_BIBLIOGRAPHY,
        bibliography,
    };
}

export function setLocale(locale: string) {
    return {
        type: Actions.SET_LOCALE,
        locale,
    };
}

export function* parseCitations() {
    const style = select('abt/data').getStyle();
    if (style.kind === StyleKind.CUSTOM) {
        throw new Error('Custom styles not implemented yet.');
    }
    const processor = new Processor(styleCache.getItem(style.value)!);
    const citations = processor.parseCitations(
        select('abt/data').getCitationsByIndex(),
    );
    const bibliography = processor.makeBibliography();
    if (bibliography) {
        yield setBibliography(bibliography);
    }
    // TODO: Consider moving from here to the next dispatch into a utility helper method.
    const doc = document.createElement('div');
    doc.innerHTML = select<string>('core/editor').getEditedPostContent();
    for (const [id, , html] of citations) {
        const node = doc.querySelector<HTMLElement>(
            `.abt-citation[data-id="${id}"]`,
        );
        if (node) {
            // handle deprecation
            if (node.dataset.reflist) {
                node.dataset.items = mergeItems(
                    JSON.parse(node.dataset.reflist),
                    node.dataset.items,
                );
                delete node.dataset.reflist;
            }
            node.innerHTML = html;
        }
    }
    yield dispatch('core/editor').resetBlocks(parse(doc.innerHTML));
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

// Below are all internal actions not exposed globally. (Generally async "controls").
function receiveStyle(style: State['style']) {
    return {
        type: Actions.RECEIVE_STYLE,
        style,
    };
}
