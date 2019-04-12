// Type definitions for @wordpress/rich-text
// Project: https://github.com/WordPress/gutenberg/tree/master/packages/rich-text
// Definitions by: Derek P Sifford <https://github.com/dsifford>

import { ComponentType } from 'react';

interface FormatProps {
    value: Value;
    isActive: boolean;
    activeAttributes: Record<string, string>;
    onChange(value: Value): void;
}

interface FormatConfig {
    tagName: keyof HTMLElementTagNameMap & string;
    className: string | null;
    title: string;
    keywords?: [string] | [string, string] | [string, string, string];
    object?: boolean;
    /**
     * Maps react prop name to html attribute name.
     *
     * { className: 'class' } => <tag class={<className attr here>}></tag>
     */
    attributes?: Record<string, string>;
    edit?: ComponentType<FormatProps>;
}

export interface Format {
    type: string;
    attributes?: Record<string, string>;
    unregisteredAttributes?: Record<string, string>;
    object?: true;
}

export interface Value {
    activeFormats?: Format[];
    end?: number;
    formats: Array<Format[] | undefined>;
    replacements: Array<Format[] | undefined>;
    start?: number;
    text: string;
}

interface CreateProps {
    /**
     * Range to create from
     */
    range?: Range;
    /**
     * Multiline tag if the structure is multiline
     */
    multilineTag?: string;
    /**
     * Tags where lines can be found if nesting is possible
     */
    multilineWrapperTags?: string[];
    /**
     * Function to declare whether the given node should be unwrapped
     */
    unwrapNode?: (node: HTMLElement) => boolean;
    /**
     * Function to filter the given string
     */
    filterString?: (input: string) => string;
    /**
     * Whether to remove an attribute based on the name.
     */
    removeAttribute?: (attribute: string) => boolean;
}

/**
 * Create a RichText value from an `Element` tree (DOM), an HTML string or a
 * plain text string, with optionally a `Range` object to set the selection. If
 * called without any input, an empty value will be created. If
 * `multilineTag` is provided, any content of direct children whose type matches
 * `multilineTag` will be separated by two newlines. The optional functions can
 * be used to filter out content.
 */
export function create(props: { text: string } & CreateProps): Value;
export function create(props: { html: string } & CreateProps): Value;
export function create(props: { element: Element } & CreateProps): Value;
export function create(props: CreateProps): Value;

export function insertObject(value: Value, formatToInsert: FormatConfig): Value;

export function insert(
    value: Value,
    valueToInsert: Value,
    startIndex?: number,
    endIndex?: number,
): Value;

export function applyFormat(
    value: Value,
    formatToInsert: Value,
    startIndex?: number,
    endIndex?: number,
): Value;

export function remove(
    value: Value,
    startIndex?: number,
    endIndex?: number,
): Value;

export function removeFormat(
    value: Value,
    formatType: string,
    startIndex?: number,
    endIndex?: number,
): Value;

export function registerFormatType(name: string, config: FormatConfig): void;

export function toggleFormat(value: Value, format: FormatConfig): Value;
