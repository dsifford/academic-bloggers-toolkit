import { __ } from '@wordpress/i18n';
import Citation from './citation';

export default {
    tagName: 'span' as 'span',
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
