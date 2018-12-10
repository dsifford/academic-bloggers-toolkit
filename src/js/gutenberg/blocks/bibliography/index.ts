import { BlockConfig } from '@wordpress/blocks';

import BibliographyEdit from './edit';
import BibliographySave from './save';

const config: BlockConfig = {
    title: 'Bibliography',
    category: 'widgets',
    description: 'Display a list of your cited references.',
    icon: 'welcome-learn-more',
    keywords: ['reference', 'citation', 'sources'],
    attributes: {
        content: {
            type: 'string',
            source: 'html',
            selector: '.abt-bibliography',
        },
        heading: {
            type: 'string',
            // FIXME: convert this to a text selector once save is finished
            // source: 'text',
            // selector: '.abt-bibliography__heading',
            default: '',
        },
        headingLevel: {
            type: 'number',
            default: 3,
        },
        headingAlign: {
            type: 'string',
        },
    },
    supports: {
        html: false,
        // inserter: false,
        multiple: false,
        reusable: false,
    },
    edit: BibliographyEdit,
    save: BibliographySave,
};

export default config;
