// Type definitions for @wordpress/components
// Definitions by: Derek P Sifford <dereksifford@gmail.com>

declare module '@wordpress/components' {
    import {
        Component,
        ComponentType,
        Context,
        HTMLProps,
        ReactElement,
        ReactNode,
    } from 'react';

    // FIXME: fix this in ts syntax
    type DropdownRenderProp = (
        args: {
            /**
             * Whether the dropdown menu is opened or not.
             */
            isOpen: boolean;
            /**
             * A function switching the dropdown menu's state from open to closed and vice versa.
             */
            onToggle: () => void;
            /**
             * A function that closes the menu if invoked.
             */
            onClose: () => void;
        },
    ) => ReactNode;

    interface ButtonProps extends HTMLProps<HTMLButtonElement> {
        /**
         * If provided, renders a instead of button.
         */
        href?: string;
        /**
         * Renders a default button style.
         */
        isDefault?: boolean;
        /**
         * Renders a primary button style.
         */
        isPrimary?: boolean;
        /**
         * Increases the size of the button.
         */
        isLarge?: boolean;
        /**
         * Decreases the size of the button.
         */
        isSmall?: boolean;
        /**
         * Renders a toggled button style.
         */
        isToggled?: boolean;
        /**
         * Indicates activity while a action is being performed.
         */
        isBusy?: boolean;
        /**
         * Renders a button with an anchor style.
         */
        isLink?: boolean;
        /**
         * Whether the button is focused.
         */
        focus?: boolean;
    }

    interface CheckboxControlProps {
        /**
         * A heading for the input field, that appears above the checkbox. If
         * the prop is not passed no heading will be rendered.
         */
        heading?: string;
        /**
         * A label for the input field, that appears at the side of the checkbox.
         * If no prop is passed an empty label is rendered.
         */
        label?: string;
        /**
         * If this property is added, a help text will be generated using help
         * property as the content.
         */
        help?: string;
        checked?: boolean;
        className?: string;
        instanceId?: string;
        onChange(isChecked: boolean): void;
    }

    interface DropdownProps {
        /**
         * A callback invoked to render the Dropdown Toggle Button.
         */
        renderToggle: DropdownRenderProp;
        /**
         * A callback invoked to render the content of the dropdown menu.
         */
        renderContent: DropdownRenderProp;
        className?: string;
        /**
         * If you want to target the dropdown menu for styling purposes, you need
         * to provide a `contentClassName` because it's not being rendered as a
         * children of the container node.
         */
        contentClassName?: string;
        /**
         * Opt-in prop to show popovers fullscreen on mobile.
         *
         * @defaultValue false
         */
        expandOnMobile?: boolean;
        /**
         * Set this to customize the text that is shown in the dropdown's header
         * when it is fullscreen on mobile.
         */
        headerTitle?: string;
        /**
         * The direction in which the popover should open relative to its parent
         * node.
         *
         * @defaultValue 'top center'
         */
        position?:
            | 'top left'
            | 'top center'
            | 'top right'
            | 'bottom left'
            | 'bottom center'
            | 'bottom right';
    }

    interface DropdownMenuProps {
        label: string;
        controls: Array<{
            icon: string;
            title: string;
            onClick: () => void;
            isDisabled?: boolean;
        }>;
        icon?: string;
    }

    interface IconButtonProps extends HTMLProps<HTMLButtonElement> {
        /**
         * An icon to be shown next to the `PanelBody` title. Supported values
         * are: Dashicons (specified as strings), functions, `WPComponent`
         * instances and `null.`
         */
        icon?: ReactNode;
        /**
         * Aria-label to use for button.
         */
        label?: string;
        className?: string;
        tooltip?: string;
        shortcut?: string | { display: string; ariaLabel: string };
    }

    interface KeyboardShortcutsProps {
        /**
         * Set true if the key events should be observed globally, including
         * within editable fields.
         */
        bindGlobal?: boolean;
        /**
         * Elements to render, upon whom key events are to be monitored.
         */
        children?: ReactElement<any> | Array<ReactElement<any>>;
        /**
         * The name of a specific keyboard event to track.
         *
         * @defaultValue 'keydown'
         */
        event?: string;
        /**
         * An object of shortcut bindings, where each key is a keyboard
         * combination, the value of which is the callback to be invoked when
         * the key combination is pressed.
         */
        shortcuts?: {
            [shortcut: string]: () => void;
        };
    }

    interface MenuItemProps extends HTMLProps<HTMLButtonElement> {
        /**
         * String to use as primary button label text, applied as `aria-label`. Useful
         * in cases where an `info` prop is passed, where `label` should be the minimal
         * text of the button, described in further detail by `info`.
         */
        label?: string;
        /**
         * Text to use as description for button text.
         */
        info?: string;
        /**
         * A dashicon string or any valid ReactNode.
         */
        icon?: ReactNode;
        /**
         * A string representing the keyboard shortcut to be used.
         */
        shortcut?: string;
        /**
         * The aria role for the menu item.
         *
         * @defaultValue "menu-item"
         */
        role?: string;
    }

    interface ModalProps {
        /**
         * This property is used as the modal header’s title. It is required for
         * accessibility reasons.
         */
        title: string;
        /**
         * This function is called to indicate that the modal should be closed.
         */
        onRequestClose: () => void;
        aria?: {
            /**
             * If this property is added, it will be added to the modal content div as aria-labelledby.
             * You are encouraged to use this when the modal is visually labelled.
             *
             * @defaultValue modal-heading
             */
            labelledby?: string;
            /**
             * If this property is added, it will be added to the modal content div
             * as aria-describedby.
             */
            describedby?: string;
        };
        className?: string;
        /**
         * If this property is added, it will be added to the modal content div as aria-label.
         * You are encouraged to use this if aria.labelledby is not provided.
         */
        contentLabel?: string;
        /**
         * If this property is true, it will focus the first tabbable element
         * rendered in the modal.
         *
         * @defaultValue true
         */
        focusOnMount?: boolean;
        /**
         * If this property is set to false, the modal will not display a close icon
         * and cannot be dismissed.
         *
         * @defaultValue true
         */
        isDismissable?: boolean;
        overlayClassName?: string;
        /**
         * If this property is added, it will determine whether the modal requests
         * to close when a mouse click occurs outside of the modal content.
         *
         * @defaultValue true
         */
        shouldCloseOnClickOutside?: boolean;
        /**
         * If this property is added, it will determine whether the modal requests to
         * close when the escape key is pressed.
         *
         * @defaultValue true
         */
        shouldCloseOnEsc?: boolean;
    }

    interface NavigableMenuProps {
        /**
         * @defaultValue 'vertical'
         */
        orientation?: 'horizontal' | 'vertical' | 'both';
        /**
         * @defaultValue menu
         */
        role?: string;
        onNavigate?: () => void;
    }

    interface PanelProps {
        /**
         * The class that will be added with components-panel. If no className
         * is passed only `components-panel__body` and `is-opened` is used.
         */
        className?: string;
        /**
         * Title of the Panel. Text will be rendered inside an `<h2>` tag.
         */
        header?: string;
    }

    interface PanelBodyProps {
        /**
         * Title of the PanelBody. This shows even when it is closed.
         */
        title?: string;
        /**
         * The class that will be added with `components-panel__body,` if the
         * panel is currently open, the `is-opened` class will also be passed to
         * the classes of the wrapper div. If no `className` is passed then only
         * `components-panel__body` and `is-opened` is used.
         */
        className?: string;
        /**
         * An icon to be shown next to the `PanelBody` title. Supported values
         * are: Dashicons (specified as strings), functions, `WPComponent`
         * instances and `null.`
         */
        icon?: ReactNode;
        /**
         * Whether or not the panel will start open.
         * @defaultValue true
         */
        initialOpen?: boolean;
        /**
         * If opened is true then the `Panel` will remain open regardless of the
         * `initialOpen` prop and the panel will be prevented from being closed.
         */
        opened?: boolean;
        /**
         * A function that is called when the user clicks on the `PanelBody`
         * title after the open state is changed.
         */
        onToggle?: () => void;
    }

    interface PanelRowProps {
        /**
         * The class that will be added with `components-panel__row.`
         */
        className?: string;
    }

    interface TextControlProps {
        /**
         * If this property is added, a label will be generated using label
         * property as the content.
         */
        label?: string;
        /**
         * If this property is added, a help text will be generated using help
         * property as the content.
         */
        help?: string;
        onChange: (value: string) => void;
    }

    interface ToolbarProps {
        controls: Array<{
            icon?: string;
            title?: string;
            subscript?: string;
            isActive?: boolean;
            isDisabled?: boolean;
            onClick?(): void;
        }>;
        icon?: string;
        label?: string;
        className?: string;
        isCollapsed?: boolean;
    }

    export function createSlotFill(
        name: string,
    ): { Fill: ComponentType; Slot: ComponentType };

    export const Button: ComponentType<ButtonProps>;
    export const ButtonGroup: ComponentType;
    export const CheckboxControl: ComponentType<CheckboxControlProps>;
    export const Dropdown: ComponentType<DropdownProps>;
    export const DropdownMenu: ComponentType<DropdownMenuProps>;
    export const IconButton: ComponentType<IconButtonProps>;
    export const KeyboardShortcuts: ComponentType<KeyboardShortcutsProps>;
    export const MenuItem: ComponentType<MenuItemProps>;
    export const Modal: ComponentType<ModalProps>;
    export const NavigableMenu: ComponentType<NavigableMenuProps>;
    export const Panel: ComponentType<PanelProps>;
    export const PanelBody: ComponentType<PanelBodyProps>;
    export const PanelRow: ComponentType<PanelRowProps>;
    export const Spinner: ComponentType;
    export const TextControl: ComponentType<TextControlProps>;
    export const Toolbar: ComponentType<ToolbarProps>;

    export class Disabled extends Component {
        static Consumer: Context<boolean>['Consumer'];
    }
}
