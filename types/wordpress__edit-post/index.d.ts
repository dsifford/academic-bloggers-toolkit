// Type definitions for @wordpress/edit-post
// Project: https://github.com/WordPress/gutenberg/tree/master/packages/edit-post
// Definitions by: Derek P Sifford <https://github.com/dsifford>

import { Dashicon } from '@wordpress/dashicons';
import { ComponentType } from 'react';

export namespace PluginSidebarMoreMenuItem {
    interface Props {
        target: string;
        icon?: string | ComponentType;
    }
}
export const PluginSidebarMoreMenuItem: ComponentType<
    PluginSidebarMoreMenuItem.Props
>;

export namespace PluginSidebar {
    interface Props {
        /**
         * A string identifying the sidebar. Must be unique for every sidebar registered within the scope of your plugin.
         */
        name: string;
        /**
         * Title displayed at the top of the sidebar.
         */
        title: string;
        /**
         * Whether to allow to pin sidebar to toolbar.
         *
         * @defaultValue true
         */
        isPinnable?: boolean;
        /**
         * The Dashicon icon slug string, or an SVG WP element, to be rendered when the sidebar is pinned to toolbar.
         */
        icon?: Dashicon | ComponentType;
    }
}
export const PluginSidebar: ComponentType<PluginSidebar.Props>;
