import { __ } from '@wordpress/i18n';
import { FormatConfiguration } from '@wordpress/rich-text';

import { FootnoteElement } from 'utils/element';
import Footnote from './footnote';

export const name = 'abt/footnote';

export const config: FormatConfiguration = {
    tagName: 'span',
    className: FootnoteElement.className,
    title: __('Footnote', 'academic-bloggers-toolkit'),
    attributes: {
        editable: 'contenteditable',
        id: 'id',
        note: 'data-note',
    },
    edit: Footnote,
};

export default [name, config] as [string, typeof config];
