import { Action } from '@wordpress/data';
import { localeCache, styleCache } from 'utils/cache';

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

export function fetchStyle(styleId: string) {
    return {
        type: CtrlActions.FETCH_STYLE,
        styleId,
    };
}

const controls = {
    async FETCH_LOCALE({ style }: Action): Promise<string> {
        return localeCache.fetchItem(style);
    },
    async FETCH_STYLE({ styleId }: Action): Promise<string> {
        return styleCache.fetchItem(styleId);
    },
};

export default controls;
