// Type definitions for @wordpress/plugins
// Project: https://github.com/WordPress/gutenberg/tree/master/packages/plugins
// Definitions by: Derek P Sifford <https://github.com/dsifford>

import { Dashicon } from '@wordpress/dashicons';
import { ComponentType } from 'react';

export interface PluginSettings {
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
export function registerPlugin(name: string, settings: PluginSettings): void;
