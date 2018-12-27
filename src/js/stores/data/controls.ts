import { Action, select } from '@wordpress/data';
import { localeCache, styleCache } from 'utils/cache';

import { StyleKind } from './constants';

const enum CtrlActions {
    FETCH_LOCALE = 'FETCH_LOCALE',
    FETCH_STYLE = 'FETCH_STYLE',
}

export function fetchLocale(style: string) {
    return {
        type: CtrlActions.FETCH_LOCALE,
        style,
    };
}

export function fetchStyle() {
    const { value: id, kind } = select('abt/data').getStyle();
    if (kind === StyleKind.CUSTOM) {
        // TODO: implement this
        throw new Error('Custom styles not implemented yet.');
    }
    return {
        type: CtrlActions.FETCH_STYLE,
        id,
    };
}

const controls = {
    async FETCH_LOCALE({ style }: Action): Promise<string> {
        return localeCache.fetchItem(style);
    },
    async FETCH_STYLE({ id }: Action): Promise<string> {
        return styleCache.fetchItem(id);
    },
};

export default controls;
