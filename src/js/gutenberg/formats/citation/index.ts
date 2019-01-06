import { __ } from '@wordpress/i18n';
import { FormatConfig } from '@wordpress/rich-text';

import Citation from './citation';

export const name = 'abt/citation';

export const config: FormatConfig = {
    tagName: 'span',
    className: 'abt-citation',
    title: __('Citation', 'academic-bloggers-toolkit'),
    attributes: {
        editable: 'contenteditable',
        hasChildren: 'data-has-children',
        id: 'id',
        items: 'data-items',
    },
    edit: Citation,
};

export default [name, config] as [string, typeof config];
