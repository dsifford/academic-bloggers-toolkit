import { registerStore } from '@wordpress/data';
import { registerPlugin } from '@wordpress/plugins';
import { registerFormatType } from '@wordpress/rich-text';

import * as citationFormat from 'gutenberg/formats/citation';
import Sidebar from 'gutenberg/sidebar';
import store from 'store';

registerStore('abt/data', store);

registerPlugin('academic-bloggers-toolkit', {
    icon: 'welcome-learn-more',
    render: Sidebar,
});

registerFormatType(citationFormat.name, citationFormat.config);
