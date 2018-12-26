// Type definitions for @wordpress/blocks
// Project: https://github.com/WordPress/gutenberg/tree/master/packages/blocks
// Definitions by: Derek P Sifford <https://github.com/dsifford>

import { ComponentType, ReactNode } from 'react';

type BlockEditRender<T> = ComponentType<BlockEditProps<T>>;
type BlockSaveRender<T> = ComponentType<BlockSaveProps<T>>;

// ========= BEGIN ATTRIBUTES

type AttrType = 'array' | 'boolean' | 'number' | 'string';

type AttributeAttr = {
    source: 'attribute';
    attribute: string;
    selector?: string;
} & (
    | {
          type: 'boolean';
          default?: boolean;
      }
    | {
          type: 'number';
          default?: number;
      }
    | {
          type: 'string';
          default?: string;
      });

interface GenericAttr {
    source?: never;
    type: AttrType;
    default?: any;
}

interface HTMLAttr {
    source: 'html';
    type: 'string';
    multiline?: 'li' | 'p';
    selector?: string;
    default?: string;
}

interface MetaAttr {
    source: 'meta';
    type: 'string';
    meta: string;
    default?: string;
}

interface PropertyAttr {
    source: 'property';
    type: 'string';
    selector: string;
    property: string;
    default?: string;
}

interface TextAttr {
    source: 'text';
    type: 'string';
    selector?: string;
    default?: string;
}

interface QueryAttr<T> {
    source: 'query';
    type: 'array';
    selector: string;
    query: {
        [k in keyof T]:
            | BlockAttribute<T[k] extends (infer U)[] ? U : T[k]>
            | GenericAttr
    };
    default?: any[];
}

type BlockAttribute<T> =
    | AttributeAttr
    | HTMLAttr
    | MetaAttr
    | PropertyAttr
    | TextAttr
    | QueryAttr<T>;

type BlockAttributes<T> = {
    [k in keyof T]:
        | BlockAttribute<T[k] extends (infer U)[] ? U : T[k]>
        | GenericAttr
};

// ========= END ATTRIBUTES

interface BlockConfig<T = {}> {
    /**
     * This is the display title for your block, which can be translated
     * with our translation functions.
     */
    title: string;
    /**
     * The block category.
     */
    category: 'common' | 'formatting' | 'layout' | 'widgets' | 'embed';
    /**
     * This is a short description for your block, which can be translated
     * with our translation functions.
     */
    description?: string;
    /**
     * The block's icon.
     */
    icon?: ReactNode;
    /**
     * Searchable keywords for discovery.
     */
    keywords?: string[];
    /**
     * Block styles.
     *
     * @see `https://wordpress.org/gutenberg/handbook/extensibility/extending-blocks/#block-style-variations`
     */
    styles?: Array<{
        name: string;
        label: string;
        isDefault?: boolean;
    }>;
    /**
     * Block attributes.
     */
    attributes?: BlockAttributes<T>;
    /**
     * Block transforms.
     */
    transforms?: {
        from?: Array<Transform<T>>;
        to?: Transform[];
    };
    /**
     * Setting `parent` lets a block require that it is only available when
     * nested within the specified blocks.
     */
    parent?: string[];
    /**
     * Optional block extended support features.
     */
    supports?: BlockSupports;
    /**
     * Sets attributes on the topmost parent element of the current block.
     */
    getEditWrapperProps?: (
        attrs: T,
    ) => Record<string, string | number | boolean>;

    edit: BlockEditRender<T>;

    save: BlockSaveRender<T>;
}

interface BlockEditProps<T = {}> extends BlockSaveProps<T> {
    className: string;
    isSelected: boolean;
    setAttributes(attrs: Partial<T>): void;
}

interface BlockSaveProps<T = {}> {
    attributes: T;
}

interface BlockSupports {
    /**
     * This property adds block controls which allow to change block's
     * alignment.
     *
     * @defaultValue false
     */
    align?: boolean;
    /**
     * Enable wide alignment (depends on `align`).
     *
     * @defaultValue true
     */
    alignWide?: boolean;
    /**
     * Anchors let you link directly to a specific block on a page. This
     * property adds a field to define an id for the block and a button to
     * copy the direct link.
     *
     * @defaultValue false
     */
    anchor?: boolean;
    /**
     * This property adds a field to define a custom className for the
     * block's wrapper.
     *
     * @defaultValue true
     */
    customClassName?: boolean;
    /**
     * By default, Gutenberg adds a class with the form
     * `.wp-block-your-block-name` to the root element of your saved
     * markup.
     *
     * @defaultValue true
     */
    className?: boolean;
    /**
     * By default, Gutenberg will allow a block's markup to be edited
     * individually. To disable this behavior, set `html` to `false`
     *
     * @defaultValue true
     */
    html?: boolean;
    /**
     * By default, all blocks will appear in the Gutenberg inserter. To
     * hide a block so that it can only be inserted programmatically, set
     * to false
     *
     * @defaultValue true
     */
    inserter?: boolean;
    /**
     * A non-multiple block can be inserted into each post, one time only.
     *
     * @defaultValue true
     */
    multiple?: boolean;
    /**
     * By default all blocks can be converted to a reusable block.
     *
     * @defaultValue true
     */
    reusable?: boolean;
}

// Transforms ----------

type Schema = {
    [k in keyof HTMLElementTagNameMap | '#text']?: {
        attributes?: string[];
        require?: Array<keyof HTMLElementTagNameMap>;
        classes?: Array<string | RegExp>;
        children?: Schema;
    }
};

interface BlockTransform<T> {
    type: 'block';
    blocks: string[];
    priority?: number;
    isMatch?(attributes: T): boolean;
    transform(attributes: T): Block<Partial<T>>;
}

interface EnterTransform<T> {
    type: 'enter';
    regExp: RegExp;
    priority?: number;
    transform(): Block<Partial<T>>;
}

interface FilesTransform<T> {
    type: 'files';
    priority?: number;
    isMatch?(files: FileList): boolean;
    transform(
        files: FileList,
        onChange?: (id: string, attrs: T) => void,
    ): Block<Partial<T>>;
}

interface PrefixTransform<T> {
    type: 'prefix';
    prefix: string;
    transform(content: string): Block<Partial<T>>;
}

interface RawTransform<T> {
    type: 'raw';
    /**
     * Comma-separated list of selectors, no spaces.
     *
     * @example 'p,div,h1,.css-class,#id'
     */
    selector?: string;
    schema?: Schema;
    priority?: number;
    isMatch?(node: Node): boolean;
    transform?(node: Node): Block<Partial<T>> | void;
}

interface ShortcodeTransform<T> {
    type: 'shortcode';
    tag: string;
    attributes?: any; // fix this if I ever need it.
}

type Transform<T = Record<string, any>> =
    | BlockTransform<T>
    | EnterTransform<T>
    | FilesTransform<T>
    | PrefixTransform<T>
    | RawTransform<T>
    | ShortcodeTransform<T>;

// End transforms ------

interface Block<T = Record<string, any>> {
    /**
     * Attributes for the block.
     */
    attributes: T;
    /**
     * Unique ID registered to the block.
     */
    clientId: string;
    /**
     * Array of inner blocks, if the block has any.
     */
    innerBlocks: Block[];
    isValid: boolean;
    name: string;
    /**
     * The parsed HTML content of the block.
     */
    originalContent: string;
}

export function createBlock<T = Record<string, any>>(
    name: string,
    attributes?: T,
    innerBlocks?: Block[],
): Block<T>;

export function parse(serializedBlocks: string): Block[];

export function registerBlockType<T>(
    name: string,
    config: BlockConfig<T>,
): void;
