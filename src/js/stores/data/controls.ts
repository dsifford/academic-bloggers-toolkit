/* eslint-disable @typescript-eslint/camelcase */
import { Action, select } from '@wordpress/data';

import { fetchAjax } from 'utils/ajax';
import { localeCache, styleCache } from 'utils/cache';

import { StyleJSON } from './';
import { StyleKind } from './constants';

const enum CtrlActions {
    FETCH_CITATION_STYLES = 'FETCH_CITATION_STYLES',
    FETCH_LOCALE = 'FETCH_LOCALE',
    FETCH_STYLE = 'FETCH_STYLE',
    SAVE_STATE = 'SAVE_STATE',
}

export function fetchCitationStyles() {
    return {
        type: CtrlActions.FETCH_CITATION_STYLES,
    };
}

export function fetchLocale(style: string) {
    return {
        type: CtrlActions.FETCH_LOCALE,
        style,
    };
}

export function fetchStyle() {
    const { value, kind } = select('abt/data').getStyle();
    if (kind === StyleKind.CUSTOM) {
        return value;
    }
    return {
        type: CtrlActions.FETCH_STYLE,
        id: value,
    };
}

export function saveState() {
    const id = select('core/editor').getCurrentPostId();
    const post = select('abt/data').getSerializedState();
    return {
        type: CtrlActions.SAVE_STATE,
        id,
        state: post.meta._abt_state,
    };
}

const controls = {
    async FETCH_CITATION_STYLES(): Promise<StyleJSON> {
        const response = await fetchAjax('get_style_json');
        return response.json();
    },
    async FETCH_LOCALE({ style }: Action): Promise<string> {
        return localeCache.fetchItem(style);
    },
    async FETCH_STYLE({ id }: Action): Promise<string> {
        return styleCache.fetchItem(id);
    },
    async SAVE_STATE({ id, state }: Action) {
        const response = await fetchAjax('update_abt_state', {
            post_id: id,
            state,
        });
        return response.json();
    },
};

export default controls;
