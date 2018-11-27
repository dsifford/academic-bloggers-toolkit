// Type definitions for @wordpress/rich-text
// Definitions by: Derek P Sifford <dereksifford@gmail.com>
// tslint:disable:no-reserved-keywords

declare module '@wordpress/rich-text' {
    import { ComponentType } from 'react';

    // FIXME:
    interface CreateProps {
        [k: string]: any;
    }

    interface FormatDescriptor {
        type: string;
        attributes?: {
            [attrName: string]: string | number | boolean;
        };
    }

    interface FormatEditProps {
        value: Value;
        onChange(value: Value): void;
    }

    interface FormatConfig {
        tagName: keyof HTMLElementTagNameMap;
        className: string | null;
        title: string;
        keywords?: [string] | [string, string] | [string, string, string];
        object?: boolean;
        /**
         * Maps react prop name to html attribute name.
         *
         * { className: 'class' } => <tag class={<className attr here>}></tag>
         */
        attributes?: {
            [attrName: string]: string;
        };
        edit: ComponentType<FormatEditProps>;
    }

    interface Value {
        formats: Array<{
            type: string;
            attributes: {
                [k: string]: string | number | boolean;
            };
            unregisteredAttributes: {};
            object: boolean;
        }>;
        text?: string;
        start: number;
        end: number;
    }

    export function create(props: CreateProps): Value;

    export function insertObject(
        value: Value,
        formatToInsert: FormatDescriptor,
    ): Value;

    export function insert(
        value: Value,
        valueToInsert: Value,
        startIndex?: number,
        endIndex?: number,
    ): Value;

    export function applyFormat(
        value: Value,
        formatToInsert: FormatDescriptor,
        startIndex?: number,
        endIndex?: number,
    ): Value;

    export function registerFormatType(
        name: string,
        config: FormatConfig,
    ): void;

    export function toggleFormat(value: Value, format: FormatDescriptor): Value;
}
