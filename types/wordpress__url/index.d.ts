// Type definitions for @wordpress/url
// Project: https://github.com/WordPress/gutenberg/tree/master/packages/url
// Definitions by: Derek P Sifford <https://github.com/dsifford>

export function addQueryArgs(
    url: string | undefined,
    args: Record<string, string | number>,
): string;
export function filterURLForDisplay(url: string): string;
export function getAuthority(url: string): string;
export function getFragment(url: string): string;
export function getPath(url: string): string;
export function getProtocol(url: string): string;
export function getQueryArg(url: string, arg: string): string;
export function getQueryString(url: string): string;
export function hasQueryArg(url: string, arg: string): boolean;
export function isURL(url: string): boolean;
export function isValidAuthority(url: string): boolean;
export function isValidFragment(frag: string): boolean;
export function isValidPath(path: string): boolean;
export function isValidProtocol(proto: string): boolean;
export function isValidQueryString(query: string): boolean;
export function prependHTTP(url: string): string;
export function removeQueryArgs(url: string, ...args: string[]): string;
export function safeDecodeURI(uri: string): string;
