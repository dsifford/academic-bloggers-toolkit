import { BlockConfig } from '@wordpress/blocks';

import BibliographyEdit from './edit';
import BibliographySave from './save';

export interface Attributes {
    content: string;
    heading: string;
    headingAlign: 'left' | 'right' | 'center';
    headingLevel: number;
}

const config: BlockConfig<Attributes> = {
    title: 'Bibliography',
    category: 'widgets',
    description: 'Display a list of your cited references.',
    icon: 'welcome-learn-more',
    keywords: ['reference', 'citation', 'sources'],
    attributes: {
        content: {
            type: 'string',
            source: 'html',
            selector: '.abt-bibliography__body',
        },
        heading: {
            type: 'string',
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
        inserter: false,
        multiple: false,
        reusable: false,
    },
    edit: BibliographyEdit,
    save: BibliographySave,
};

export default config;
