import { PluginSettings } from '@wordpress/plugins';

import Sidebar from './sidebar';

export const name = 'abt-sidebar';

export const settings: PluginSettings = {
    icon: 'welcome-learn-more',
    render: Sidebar,
};

export default [name, settings] as [string, typeof settings];
