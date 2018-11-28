import { State } from './';
import { Actions } from './constants';

export function addReference(data: CSL.Data) {
    return {
        type: Actions.ADD_REFERENCE,
        data,
    };
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

export function setDisplayOptions(displayOptions: State['displayOptions']) {
    return {
        type: Actions.SET_DISPLAY_OPTIONS,
        displayOptions,
    };
}

export function setStyle(style: State['style']) {
    return {
        type: Actions.SET_STYLE,
        style,
    };
}
