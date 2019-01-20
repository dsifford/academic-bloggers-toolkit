import { addQueryArgs } from '@wordpress/url';

declare const _abt_nonce: string;

export async function fetchAjax(
    action: string,
    body?: Record<string, string | number | boolean>,
): Promise<Response> {
    return fetch(top.ajaxurl, {
        method: 'POST',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
        },
        body: addQueryArgs(undefined, {
            /**
             * FIXME: remove this when gutenberg 2.3.3 merges
             * @see: https://github.com/WordPress/gutenberg/pull/12803
             */
            _: '',
            _wpnonce: _abt_nonce,
            action,
            ...body,
        }),
        credentials: 'same-origin',
    });
}
