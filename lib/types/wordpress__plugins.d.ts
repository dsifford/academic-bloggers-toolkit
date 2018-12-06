// Type definitions for @wordpress/plugins
// Definitions by: Derek P Sifford <dereksifford@gmail.com>

declare module '@wordpress/plugins' {
    import { Dashicon } from '@wordpress/dashicons';
    import { ComponentType } from 'react';

    interface PluginSettings {
        /**
         * The Dashicon icon slug string, or an SVG WP element, to be rendered when the sidebar is pinned to toolbar.
         */
        icon: Dashicon | ComponentType;
        /**
         * A component containing the UI elements to be rendered.
         */
        render: ComponentType;
    }

    /**
     * Registers a new plugin.
     *
     * @param name - A string identifying the plugin. Must be unique across all registered plugins.
     * @param settings - PluginSettings object.
     */
    export function registerPlugin(
        name: string,
        settings: PluginSettings,
    ): void;
}
