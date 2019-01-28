// Type definitions for @wordpress/keycodes
// Project: https://github.com/WordPress/gutenberg/tree/master/packages/keycodes
// Definitions by: Derek P Sifford <https://github.com/dsifford>

export const BACKSPACE = 8;
export const TAB = 9;
export const ENTER = 13;
export const ESCAPE = 27;
export const SPACE = 32;
export const LEFT = 37;
export const UP = 38;
export const RIGHT = 39;
export const DOWN = 40;
export const DELETE = 46;
export const F10 = 121;
export const ALT = 'alt';
export const CTRL = 'ctrl';
export const COMMAND = 'meta';
export const SHIFT = 'shift';

export namespace modifiers {
    export function primary(isApple: () => boolean): string[];
    export function primaryShift(_isApple: () => boolean): string[];
    export function primaryAlt(_isApple: () => boolean): string[];
    export function secondary(_isApple: () => boolean): string[];
    export function access(_isApple: () => boolean): string[];
    export function ctrl(): string[];
    export function alt(): string[];
    export function ctrlShift(): string[];
    export function shift(): string[];
    export function shiftAlt(): string[];
}

/**
 * An object that contains functions to get raw shortcuts.
 * E.g. rawShortcut.primary( 'm' ) will return 'meta+m' on Mac.
 * These are intended for user with the KeyboardShortcuts component or TinyMCE.
 *
 * @type {Object} Keyed map of functions to raw shortcuts.
 */
export namespace rawShortcut {
    export function primary(character: string): string;
    export function primaryShift(character: string): string;
    export function primaryAlt(character: string): string;
    export function secondary(character: string): string;
    export function access(character: string): string;
    export function ctrl(character: string): string;
    export function alt(character: string): string;
    export function ctrlShift(character: string): string;
    export function shift(character: string): string;
    export function shiftAlt(character: string): string;
}

/**
 * Return an array of the parts of a keyboard shortcut chord for display
 * E.g displayShortcutList.primary( 'm' ) will return [ '⌘', 'M' ] on Mac.
 *
 * @type {Object} keyed map of functions to shortcut sequences
 */
export namespace displayShortcutList {
    export function primary(character: string): string[];
    export function primaryShift(character: string): string[];
    export function primaryAlt(character: string): string[];
    export function secondary(character: string): string[];
    export function access(character: string): string[];
    export function ctrl(character: string): string[];
    export function alt(character: string): string[];
    export function ctrlShift(character: string): string[];
    export function shift(character: string): string[];
    export function shiftAlt(character: string): string[];
}

/**
 * An object that contains functions to display shortcuts.
 * E.g. displayShortcut.primary( 'm' ) will return '⌘M' on Mac.
 *
 * @type {Object} Keyed map of functions to display shortcuts.
 */
export namespace displayShortcut {
    export function primary(character: string): string;
    export function primaryShift(character: string): string;
    export function primaryAlt(character: string): string;
    export function secondary(character: string): string;
    export function access(character: string): string;
    export function ctrl(character: string): string;
    export function alt(character: string): string;
    export function ctrlShift(character: string): string;
    export function shift(character: string): string;
    export function shiftAlt(character: string): string;
}

/**
 * An object that contains functions to return an aria label for a keyboard shortcut.
 * E.g. shortcutAriaLabel.primary( '.' ) will return 'Command + Period' on Mac.
 */
export namespace shortcutAriaLabel {
    export function primary(character: string): string;
    export function primaryShift(character: string): string;
    export function primaryAlt(character: string): string;
    export function secondary(character: string): string;
    export function access(character: string): string;
    export function ctrl(character: string): string;
    export function alt(character: string): string;
    export function ctrlShift(character: string): string;
    export function shift(character: string): string;
    export function shiftAlt(character: string): string;
}

/**
 * An object that contains functions to check if a keyboard event matches a
 * predefined shortcut combination.
 * E.g. isKeyboardEvent.primary( event, 'm' ) will return true if the event
 * signals pressing ⌘M.
 *
 * @type {Object} Keyed map of functions to match events.
 */
export namespace isKeyboardEvent {
    export function primary(event: Event, character: string): boolean;
    export function primaryShift(event: Event, character: string): boolean;
    export function primaryAlt(event: Event, character: string): boolean;
    export function secondary(event: Event, character: string): boolean;
    export function access(event: Event, character: string): boolean;
    export function ctrl(event: Event, character: string): boolean;
    export function alt(event: Event, character: string): boolean;
    export function ctrlShift(event: Event, character: string): boolean;
    export function shift(event: Event, character: string): boolean;
    export function shiftAlt(event: Event, character: string): boolean;
}
