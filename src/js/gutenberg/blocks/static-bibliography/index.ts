import { BlockConfiguration, createBlock } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import uuid from 'uuid/v4';

import { stripListItem } from 'utils/editor';
import Processor from 'utils/processor';

import edit from './edit';
import save from './save';

export interface Attributes {
    items: Processor.BibItem[];
    orderedList: boolean;
}

export const name = 'abt/static-bibliography';

export const config: BlockConfiguration<Attributes> = {
    title: __('Static Bibliography', 'academic-bloggers-toolkit'),
    category: 'widgets',
    description: __(
        'Display a static list of references.',
        'academic-bloggers-toolkit',
    ),
    icon: 'welcome-learn-more',
    keywords: [
        __('reference', 'academic-bloggers-toolkit'),
        __('citation', 'academic-bloggers-toolkit'),
        __('sources', 'academic-bloggers-toolkit'),
    ],
    attributes: {
        // TODO: need csl attributes here prob (see blocks/bibliography/index.ts)
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
                        return createBlock<Attributes>(
                            'abt/static-bibliography',
                            {
                                items,
                            },
                        );
                    }
                    return;
                },
            },
        ],
    },
    edit,
    save,
};

export default [name, config] as [string, typeof config];
