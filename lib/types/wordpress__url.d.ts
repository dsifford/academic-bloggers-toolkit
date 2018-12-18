// Type definitions for @wordpress/plugins
// Definitions by: Derek P Sifford <dereksifford@gmail.com>

declare module '@wordpress/url' {
    export function isURL(url: string): boolean;
    export function getProtocol(url: string): string;
    export function isValidProtocol(proto: string): boolean;
    export function getAuthority(url: string): string;
    export function isValidAuthority(url: string): boolean;
    export function getPath(url: string): string;
    export function isValidPath(path: string): boolean;
    export function getQueryString(url: string): string;
    export function isValidQueryString(query: string): boolean;
    export function getFragment(url: string): string;
    export function isValidFragment(frag: string): boolean;
    export function addQueryArgs(
        url: string,
        args: Record<string, string | number>,
    ): string;
    export function prependHTTP(url: string): string;
    export function getQueryArg(url: string, arg: string): string;
    export function hasQueryArg(url: string, arg: string): boolean;
    export function removeQueryArgs(url: string, ...args: string[]): string;
    export function safeDecodeURI(uri: string): string;
    export function filterURLForDisplay(url: string): string;
}
