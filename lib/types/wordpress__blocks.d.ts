// Type definitions for @wordpress/blocks
// Definitions by: Derek P Sifford <dereksifford@gmail.com>
// tslint:disable:no-reserved-keywords

declare module '@wordpress/blocks' {
    import { ComponentType, ReactNode } from 'react';

    type AttrType = 'string' | 'number' | 'boolean';
    type Primitive = string | number | boolean;

    type BlockAttribute<T> = T extends 'attribute'
        ? { type: AttrType; source: T; selector: string; attribute: string }
        : T extends 'property'
        ? { type: AttrType; source: T; selector: string; property: string }
        : T extends 'text'
        ? { type: AttrType; source: T; selector: string }
        : T extends 'html'
        ? { type: AttrType; source: T; selector: string; multiline?: string }
        : T extends 'meta'
        ? { type: AttrType; source: T; meta: string }
        : T extends 'query'
        ? {
              type: 'array';
              source: T;
              selector: string;
              query: Array<{
                  [k: string]: {
                      type: AttrType;
                      source: 'attribute';
                      selector: string;
                  };
              }>;
          }
        : {
              type: AttrType;
              default?: Primitive;
          };

    type BlockEditRender<T> = ComponentType<BlockEditProps<T>>;

    type BlockSaveRender<T> = ComponentType<BlockSaveProps<T>>;

    type BlockAttributes<T> = {
        [k in keyof T]: BlockAttribute<
            'attribute' | 'html' | 'meta' | 'property' | 'text' | 'query' | ''
        >
    };

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
        transforms?: never; // TODO: Add types for this
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
        getEditWrapperProps?: (attrs: T) => Record<string, Primitive>;

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

    interface Block {
        /**
         * Attributes for the block.
         */
        attributes: Record<string, Primitive>;
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

    export function createBlock(
        name: string,
        attributes?: Record<string, any>,
        innerBlocks?: Block[],
    ): Block;
    export function parse(serializedBlocks: string): Block[];
    export function registerBlockType<T>(
        name: string,
        config: BlockConfig<T>,
    ): void;
}
