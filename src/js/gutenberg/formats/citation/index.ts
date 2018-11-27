import { FormatConfig } from '@wordpress/rich-text';

import Citation from './citation';

export const name = 'abt/citation';

export const config: FormatConfig = {
    tagName: 'span',
    className: 'abt-citation',
    title: 'Citation',
    attributes: {
        id: 'data-id',
        items: 'data-items',
    },
    edit: Citation,
};
