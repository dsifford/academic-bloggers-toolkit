import wpApiFetch from '@wordpress/api-fetch';
import { Action, select } from '@wordpress/data';

import { localeCache, styleCache } from 'utils/cache';

import { StyleJSON } from './';
import { StyleKind } from './constants';

const enum CtrlActions {
    API_FETCH = 'API_FETCH',
    FETCH_CITATION_STYLES = 'FETCH_CITATION_STYLES',
    FETCH_LOCALE = 'FETCH_LOCALE',
    FETCH_STYLE = 'FETCH_STYLE',
}

export function apiFetch(path: string) {
    return {
        type: CtrlActions.API_FETCH,
        path,
    };
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

const controls = {
    async API_FETCH({ path }: Action): Promise<any> {
        return wpApiFetch({ path });
    },
    async FETCH_CITATION_STYLES(): Promise<StyleJSON> {
        const response = await fetch(top.ajaxurl, {
            method: 'POST',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded',
            },
            body: `action=get_style_json`,
            credentials: 'same-origin',
        });
        return response.json();
    },
    async FETCH_LOCALE({ style }: Action): Promise<string> {
        return localeCache.fetchItem(style);
    },
    async FETCH_STYLE({ id }: Action): Promise<string> {
        return styleCache.fetchItem(id);
    },
};

export default controls;
