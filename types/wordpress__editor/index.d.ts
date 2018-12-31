// Type definitions for @wordpress/editor
// Project: https://github.com/WordPress/gutenberg/tree/master/packages/editor
// Definitions by: Derek P Sifford <https://github.com/dsifford>

import { Component, ComponentType, CSSProperties, HTMLProps } from 'react';

interface NavigatableToolbarProps {
    /**
     * Make the toolbar get focus as soon as it mounted.
     */
    focusOnMount?: boolean;
}

interface RichTextProps {
    value: string;
    tagName?: string;
    placeholder?: string;
    multiline?: boolean | string;
    formattingControls?: string[];
    isSelected?: boolean;
    keepPlaceholderOnFocus?: boolean;
    autocompleters?: any[];
    style?: CSSProperties;
    wrapperClassName?: string;
    className?: string;
    inlineToolbar?: boolean;
    onChange(value: string): void;
    onTagNameChange?(tagName: string): void;
    onReplace?(blocks: any[]): void;
    onMerge?(forward: boolean): void;
    onRemove?(forward: boolean): void;
}

export class RichText extends Component<RichTextProps> {
    static Content<T extends keyof HTMLElementTagNameMap = 'div'>(
        props: {
            value: string | string[];
            children?: never;
            tagName?: T;
            multiline?: true | 'p' | 'li';
        } & HTMLProps<T>,
    ): JSX.Element;
    static isEmpty(value: string): boolean;
}

export const BlockControls: ComponentType;
export const BlockFormatControls: ComponentType;
export const InspectorControls: ComponentType;
export const NavigableToolbar: ComponentType<HTMLProps<HTMLElement>>;

export namespace AlignmentToolbar {
    interface Props {
        isCollapsed?: boolean;
        value?: 'left' | 'right' | 'center';
        onChange(nextAlign: 'left' | 'right' | 'center'): void;
    }
}
export const AlignmentToolbar: ComponentType<AlignmentToolbar.Props>;
