import { registerBlockType } from '@wordpress/blocks';
import { registerStore } from '@wordpress/data';
import { registerPlugin } from '@wordpress/plugins';
import { registerFormatType } from '@wordpress/rich-text';

import bibliographyBlock from 'gutenberg/blocks/bibliography';
import staticBibliographyBlock from 'gutenberg/blocks/static-bibliography';
import citationFormat from 'gutenberg/formats/citation';
import Sidebar from 'gutenberg/sidebar';
import { dataStore, uiStore } from 'stores';

registerStore('abt/data', dataStore);
registerStore('abt/ui', uiStore);

registerPlugin('academic-bloggers-toolkit', {
    icon: 'welcome-learn-more',
    render: Sidebar,
});

registerFormatType('abt/citation', citationFormat);

registerBlockType('abt/bibliography', bibliographyBlock);
registerBlockType('abt/static-bibliography', staticBibliographyBlock);
