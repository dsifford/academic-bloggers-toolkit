import { __ } from '@wordpress/i18n';
import { FormatConfiguration } from '@wordpress/rich-text';

import { CitationElement } from 'utils/element';
import Citation from './citation';

export const name = 'abt/citation';

export const config: FormatConfiguration = {
    tagName: 'span',
    className: CitationElement.className,
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
