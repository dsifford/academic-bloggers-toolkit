/* eslint-disable @typescript-eslint/camelcase */
import { addQueryArgs } from '@wordpress/url';

declare const _abt_nonce: string;
declare const ajaxurl: string;

export async function fetchAjax(
    action: string,
    body?: Record<string, string | number | boolean>,
): Promise<Response> {
    return fetch(ajaxurl, {
        method: 'POST',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
        },
        body: addQueryArgs(undefined, {
            _wpnonce: _abt_nonce,
            action,
            ...body,
        }).slice(1),
        credentials: 'same-origin',
    });
}
