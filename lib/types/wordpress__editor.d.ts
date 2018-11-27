// Type definitions for @wordpress/editor
// Definitions by: Derek P Sifford <dereksifford@gmail.com>

declare module '@wordpress/editor' {
    import { Component, ComponentType, HTMLProps } from 'react';

    interface NavigatableToolbarProps {
        /**
         * Make the toolbar will get focus as soon as it mounted.
         */
        focusOnMount?: boolean;
    }

    interface RichTextProps {
        value: string;
        tagName: string;
        placeholder: string;
        multiline: boolean | string;
        formattingControls: any[];
        isSelected: boolean;
        keepPlaceholderOnFocus: boolean;
        // TODO:
        autocompleters: any[];
        onChange(value: string): () => void;
        // TODO:
        onReplace(blocks: any[]): () => void;
        onMerge(forward: boolean): () => void;
        onRemove(forward: boolean): () => void;
    }

    export const NavigableToolbar: ComponentType<HTMLProps<HTMLElement>>;
    export class RichText extends Component {
        static Content(): string;
    }
}
