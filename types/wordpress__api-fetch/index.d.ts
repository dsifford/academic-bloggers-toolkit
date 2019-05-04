// Type definitions for @wordpress/api-fetch
// Project: https://github.com/WordPress/gutenberg/tree/master/packages/api-fetch
// Definitions by: Derek P Sifford <https://github.com/dsifford>

export = apiFetch;

interface Options extends RequestInit {
    /**
     * Shorthand to be used in place of url, appended to the REST API root
     * URL for the current site.
     */
    path?: string;
    /**
     * Absolute URL to the endpoint from which to fetch.
     */
    url?: string;
    /**
     * If true, return parsed JSON. If false, return Response.
     * @defaultValue true
     */
    parse?: boolean;
    /**
     * Shorthand to be used in place of body, accepts an object value to be
     * stringified to JSON.
     */
    data?: Record<string, any>;
}

type Next = (options: Options) => void;
type MiddleWare = (options: Options, next: Next) => void;

declare function apiFetch<T = unknown>(
    options: Options & { parse: false },
): Response;
declare function apiFetch<T = unknown>(
    options: Options & { parse: true },
): Promise<T>;

declare namespace apiFetch {
    export function use(middleware: MiddleWare): void;
    export function createNonceMiddleware(nonce: string): MiddleWare;
}
