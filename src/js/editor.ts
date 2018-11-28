import { registerStore } from '@wordpress/data';
import { registerPlugin } from '@wordpress/plugins';
import { registerFormatType } from '@wordpress/rich-text';

import * as citationFormat from 'gutenberg/formats/citation';
import Sidebar from 'gutenberg/sidebar';
import { dataStore, sidebarStore } from 'stores';

registerStore('abt/data', dataStore);
registerStore('abt/sidebar', sidebarStore);

registerPlugin('academic-bloggers-toolkit', {
    icon: 'welcome-learn-more',
    render: Sidebar,
});

registerFormatType(citationFormat.name, citationFormat.config);
