// Type definitions for @wordpress/api-fetch
// Definitions by: Derek P Sifford <dereksifford@gmail.com>

declare module '@wordpress/api-fetch' {
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

    function apiFetch<T = unknown>(
        options: Options & { parse: false },
    ): Response;
    function apiFetch<T = unknown>(options: Options): Promise<T>;

    namespace apiFetch {
        export function use(middleware: MiddleWare): void;
        export function createNonceMiddleware(nonce: string): MiddleWare;
    }
    export default apiFetch;
}
