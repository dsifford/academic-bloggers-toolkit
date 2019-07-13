import { BlockConfiguration } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import FootnotesEdit from './edit';
import FootnotesSave from './save';

export interface Attributes {
    items: Array<{
        id: string;
        content: string;
    }>;
}

export const name = 'abt/footnotes';

export const config: BlockConfiguration<Attributes> = {
    title: __('Footnotes', 'academic-bloggers-toolkit'),
    category: 'widgets',
    description: __('Display a list of footnotes', 'academic-bloggers-toolkit'),
    icon: 'testimonial',
    attributes: {
        items: {
            type: 'array',
            default: [],
            source: 'query',
            selector: 'li',
            query: {
                id: {
                    source: 'attribute',
                    type: 'string',
                    attribute: 'id',
                },
                content: {
                    source: 'html',
                    type: 'string',
                },
            },
        },
    },
    supports: {
        html: false,
        inserter: false,
        multiple: false,
        reusable: false,
    },
    edit: FootnotesEdit,
    save: FootnotesSave,
};

export default [name, config] as [string, typeof config];
