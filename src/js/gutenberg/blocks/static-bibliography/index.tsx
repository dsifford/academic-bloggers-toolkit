import { BlockConfig, createBlock } from '@wordpress/blocks';
import uuid from 'uuid/v4';

import { BibItem, stripListItem } from '../';
import edit from './edit';
import save from './save';

export interface Attributes {
    items: BibItem[];
    orderedList: boolean;
}

const config: BlockConfig<Attributes> = {
    title: 'Static Bibliography',
    category: 'widgets',
    description: 'Display a static list of references.',
    icon: 'welcome-learn-more',
    keywords: ['reference', 'citation', 'sources'],
    attributes: {
        items: {
            type: 'array',
            source: 'query',
            selector: 'li',
            default: [],
            query: {
                content: {
                    type: 'string',
                    source: 'html',
                },
                id: {
                    type: 'string',
                    source: 'attribute',
                    attribute: 'data-id',
                },
            },
        },
        orderedList: {
            type: 'boolean',
            default: true,
        },
    },
    supports: {
        anchor: true,
        html: false,
    },
    transforms: {
        from: [
            {
                type: 'raw',
                selector: '.abt-static-bib',
                transform(node: HTMLDivElement) {
                    const body = node.querySelector<HTMLDivElement>(
                        '.abt-bibliography__container',
                    );
                    if (body) {
                        const items = [...body.children].map(item => {
                            const content = item.querySelector<HTMLDivElement>(
                                '.csl-entry',
                            );
                            const id = item.id || uuid();
                            return {
                                id,
                                content: content
                                    ? stripListItem(content)
                                    : item.innerHTML,
                            };
                        });
                        return createBlock('abt/static-bibliography', {
                            items,
                        });
                    }
                    return;
                },
            },
        ],
    },
    edit,
    save,
};

export default config;
