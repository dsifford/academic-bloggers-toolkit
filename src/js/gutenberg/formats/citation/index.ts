import Citation from './citation';

export default {
    tagName: 'span' as 'span',
    className: 'abt-citation',
    title: 'Citation',
    attributes: {
        id: 'data-id',
        items: 'data-items',
    },
    edit: Citation,
};
