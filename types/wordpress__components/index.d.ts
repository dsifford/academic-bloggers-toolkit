// Type definitions for @wordpress/components
// Project: https://github.com/WordPress/gutenberg/tree/master/packages/components
// Definitions by: Derek P Sifford <https://github.com/dsifford>

import {
    Component,
    ComponentType,
    Context,
    FormEvent,
    HTMLProps,
    ReactElement,
    ReactNode,
} from 'react';

export namespace Button {
    interface Props extends HTMLProps<HTMLButtonElement> {
        /**
         * If provided, renders link a instead of button.
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
}
export const Button: ComponentType<Button.Props>;

export const ButtonGroup: ComponentType;

export namespace CheckboxControl {
    interface Props {
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
}
export const CheckboxControl: ComponentType<CheckboxControl.Props>;

export namespace Dashicon {
    interface Props {
        icon: string;
        size?: number;
    }
}
export const Dashicon: ComponentType<Dashicon.Props>;

export class Disabled extends Component {
    static Consumer: Context<boolean>['Consumer'];
}

export namespace Dropdown {
    type RenderProp = (
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

    interface Props {
        /**
         * A callback invoked to render the Dropdown Toggle Button.
         */
        renderToggle: RenderProp;
        /**
         * A callback invoked to render the content of the dropdown menu.
         */
        renderContent: RenderProp;
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
}
export const Dropdown: ComponentType<Dropdown.Props>;

export namespace DropdownMenu {
    interface Props {
        label: string;
        controls: Array<{
            icon: string;
            title: string;
            onClick: () => void;
            isDisabled?: boolean;
        }>;
        icon?: string;
    }
}
export const DropdownMenu: ComponentType<DropdownMenu.Props>;

export const ExternalLink: ComponentType<HTMLProps<HTMLAnchorElement>>;

export namespace FormFileUpload {
    interface Props {
        accept: string;
        multiple?: boolean;
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
        isLarge?: boolean;
        className?: string;
        tooltip?: string;
        onChange(e: FormEvent<HTMLInputElement>): void;
    }
}
export const FormFileUpload: ComponentType<FormFileUpload.Props>;

export const FormToggle: ComponentType<HTMLProps<HTMLInputElement>>;

export namespace IconButton {
    interface Props extends Button.Props {
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
}
export const IconButton: ComponentType<IconButton.Props>;

export namespace KeyboardShortcuts {
    interface Props {
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
}
export const KeyboardShortcuts: ComponentType<KeyboardShortcuts.Props>;

export namespace MenuGroup {
    interface Props {
        label: string;
        className?: string;
        children: ReactNode;
    }
}
export const MenuGroup: ComponentType<MenuGroup.Props>;

export namespace MenuItem {
    interface Props extends HTMLProps<HTMLButtonElement> {
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
}
export const MenuItem: ComponentType<MenuItem.Props>;

export namespace MenuItemsChoice {
    interface Props {
        value: string;
        choices: Array<{
            label: string;
            value: string | number;
        }>;
        onSelect(value: string | number): void;
    }
}
export const MenuItemsChoice: ComponentType<MenuItemsChoice.Props>;

export namespace Modal {
    interface Props {
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
}
export const Modal: ComponentType<Modal.Props>;

export namespace NavigableMenu {
    interface Props {
        /**
         * @defaultValue 'vertical'
         */
        orientation?: 'horizontal' | 'vertical' | 'both';
        /**
         * @defaultValue menu
         */
        role?: string;
        className?: string;
        onNavigate?: (idx: number) => void;
    }
}
export const NavigableMenu: ComponentType<NavigableMenu.Props>;

export namespace Notice {
    interface Props {
        /**
         * An array of action objects.
         *
         * Each member object should contain a label and either a url link
         * string or onClick callback function.
         */
        actions?: Array<
            | {
                  label: ReactNode;
                  onClick(): void;
              }
            | { label: string; url: string }
        >;
        status?: 'error' | 'success' | 'warning';
        /**
         * Whether the notice should be dismissible or not.
         *
         * @defaultValue true
         */
        isDismissable?: boolean;

        /**
         * Function called when dismissing the notice.
         */
        onRemove?(): void;
    }
}
export const Notice: ComponentType<Notice.Props>;

export namespace Panel {
    interface Props {
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
}
export const Panel: ComponentType<Panel.Props>;

export namespace PanelBody {
    interface Props {
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
}
export const PanelBody: ComponentType<PanelBody.Props>;

export namespace PanelRow {
    interface Props {
        /**
         * The class that will be added with `components-panel__row.`
         */
        className?: string;
    }
}
export const PanelRow: ComponentType<PanelRow.Props>;

export namespace Placeholder {
    interface Props extends HTMLProps<HTMLDivElement> {
        icon?: ReactNode;
        label?: string;
        instructions?: string;
    }
}
export const Placeholder: ComponentType<Placeholder.Props>;

export namespace RadioControl {
    interface Props<T> {
        className?: string;
        label?: string;
        help?: string;
        selected?: T;
        options?: Array<{
            label: string;
            value: T;
        }>;
        onChange(option: T): void;
    }
}
export class RadioControl<T> extends Component<RadioControl.Props<T>> {}

export namespace SelectControl {
    interface CommonProps {
        label?: string;
        help?: string;
        options?: Array<{
            label: string;
            value: string;
        }>;
    }
    interface SingleProps<T> extends CommonProps {
        value?: T;
        onChange(value: T): void;
    }
    interface MultipleProps<T> extends CommonProps {
        multiple: true;
        value?: T[];
        onChange(values: T[]): void;
    }
    type Props<T> = SingleProps<T> | MultipleProps<T>;
}
export class SelectControl<T = any> extends Component<SelectControl.Props<T>> {}

export const Spinner: ComponentType;

export namespace TextControl {
    interface Props {
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
}
export const TextControl: ComponentType<TextControl.Props>;

export namespace ToggleControl {
    interface Props {
        label?: string;
        help?: string | (() => string);
        checked?: boolean;
        onChange(isChecked: boolean): void;
    }
}
export const ToggleControl: ComponentType<ToggleControl.Props>;

export namespace Toolbar {
    interface Props {
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
}
export const Toolbar: ComponentType<Toolbar.Props>;

export namespace ToolbarButton {
    interface Props extends IconButton.Props {
        containerClassName?: string;
        isActive?: boolean;
        isDisabled?: boolean;
        subscript?: string;
        title?: string;
    }
}
export const ToolbarButton: ComponentType<ToolbarButton.Props>;

export function createSlotFill(
    name: string,
): {
    Fill: ComponentType;
    Slot: ComponentType<{ children?: (fills: any[]) => ReactNode }>;
};

export namespace withNotices {
    type Status = 'error' | 'info' | 'success' | 'warning';
    interface Notice {
        /**
         * Notice message.
         */
        content: string;
        /**
         * Notice status.
         * @defaultValue 'info'
         */
        status?: Status;
        options?: {
            /**
             * Context under which to group the notice.
             * @defaultValue 'global'
             */
            context?: string;
            /**
             * Identifier for notice. Automatically assigned if not specified.
             */
            id?: string;
            /**
             * Whether notice can be dismissed by the user.
             * @defaultValue true
             */
            isDismissible?: boolean;
            /**
             * Whether the notice content should be announced to screen readers.
             * @defaultValue true
             */
            speak?: boolean;
            /**
             * User actions to be presented with notice.
             */
            actions?: Array<Record<string, any>>;
        };
    }
    interface Props {
        noticeOperations: {
            createNotice(notice: Notice): void;
            createErrorNotice(message: string): void;
            removeNotice(id: string): void;
            removeAllNotices(): void;
        };
        noticeList: ReadonlyArray<Notice>;
        noticeUI: ReactNode;
    }
}

export function withNotices<P>(
    component: ComponentType<P & withNotices.Props>,
): ComponentType<P>;
