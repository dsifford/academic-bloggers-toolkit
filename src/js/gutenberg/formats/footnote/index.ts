import { __ } from '@wordpress/i18n';
import { FormatConfig } from '@wordpress/rich-text';

import Footnote from './footnote';

export const name = 'abt/footnote';

export const config: FormatConfig = {
    tagName: 'span',
    className: 'abt-footnote',
    title: __('Footnote', 'academic-bloggers-toolkit'),
    attributes: {
        editable: 'contenteditable',
        id: 'id',
        note: 'data-note',
    },
    edit: Footnote,
};

export default [name, config] as [string, typeof config];
