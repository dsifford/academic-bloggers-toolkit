import Citation from './citation';

export default {
    tagName: 'span' as 'span',
    className: 'abt-citation',
    title: 'Citation',
    attributes: {
        editable: 'contenteditable',
        id: 'id',
        items: 'data-items',
    },
    edit: Citation,
};
