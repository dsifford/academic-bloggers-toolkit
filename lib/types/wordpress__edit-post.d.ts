// Type definitions for @wordpress/edit-post
// Definitions by: Derek P Sifford <dereksifford@gmail.com>

declare module '@wordpress/edit-post' {
    import { Component, ComponentType } from 'react';

    interface PSMMIProps {
        target: string;
        icon?: string | ComponentType;
    }
    export class PluginSidebarMoreMenuItem extends Component<PSMMIProps> {}

    interface PSProps {
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
        icon?: string | ComponentType;
    }
    export class PluginSidebar extends Component<PSProps> {}
}
