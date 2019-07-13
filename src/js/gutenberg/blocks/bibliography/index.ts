import { BlockConfiguration, createBlock } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Processor from 'utils/processor';

import BibliographyEdit from './edit';
import BibliographySave from './save';

export interface Attributes {
    items: Processor.BibItem[];
    heading: string;
    headingLevel: number;
    isToggleable: boolean;
    headingAlign?: 'left' | 'right' | 'center';
    entryspacing?: string;
    hangingindent?: string;
    linespacing?: string;
    maxoffset?: string;
    secondFieldAlign?: 'flush' | 'margin';
}

export const name = 'abt/bibliography';

export const config: BlockConfiguration<Attributes> = {
    title: __('Bibliography', 'academic-bloggers-toolkit'),
    category: 'widgets',
    description: __(
        'Display a list of your cited references.',
        'academic-bloggers-toolkit',
    ),
    icon: 'welcome-learn-more',
    attributes: {
        entryspacing: {
            type: 'string',
            source: 'attribute',
            attribute: 'data-entryspacing',
            selector: '.abt-bibliography__body',
        },
        hangingindent: {
            type: 'string',
            source: 'attribute',
            attribute: 'data-hangingindent',
            selector: '.abt-bibliography__body',
        },
        linespacing: {
            type: 'string',
            source: 'attribute',
            attribute: 'data-linespacing',
            selector: '.abt-bibliography__body',
        },
        maxoffset: {
            type: 'string',
            source: 'attribute',
            attribute: 'data-maxoffset',
            selector: '.abt-bibliography__body',
        },
        secondFieldAlign: {
            type: 'string',
            source: 'attribute',
            attribute: 'data-second-field-align',
            selector: '.abt-bibliography__body',
        },
        items: {
            type: 'array',
            default: [],
            source: 'query',
            selector: 'li',
            query: {
                id: {
                    source: 'attribute',
                    type: 'string',
                    attribute: 'id',
                },
                content: {
                    source: 'html',
                    type: 'string',
                },
            },
        },
        heading: {
            type: 'string',
            default: '',
        },
        headingLevel: {
            type: 'number',
            default: 3,
        },
        headingAlign: {
            type: 'string',
        },
        isToggleable: {
            type: 'boolean',
            default: false,
        },
    },
    supports: {
        html: false,
        inserter: false,
        multiple: false,
        reusable: false,
    },
    transforms: {
        from: [
            {
                type: 'raw',
                selector: '.abt-bibliography',
                transform(node: HTMLDivElement) {
                    const heading = node.querySelector<HTMLElement>(
                        '.abt-bibliography__heading',
                    );
                    const body = node.querySelector<HTMLElement>(
                        '.abt-bibliography__container',
                    );
                    if (!body || body.children.length === 0) {
                        return;
                    }
                    let attributes: Partial<Attributes> = {
                        items: [...body.children].map(item => ({
                            id: item.id,
                            content: item.innerHTML,
                        })),
                    };
                    if (heading && heading.textContent) {
                        const re = /^H([1-6])$/i;
                        const {
                            dataset: { headingLevel },
                            nodeName,
                            textContent,
                        } = heading;
                        let headingMatch = re.exec(nodeName);
                        if (headingMatch) {
                            attributes = {
                                ...attributes,
                                heading: textContent,
                                headingLevel: parseInt(headingMatch[1], 10),
                            };
                        } else if (nodeName === 'BUTTON' && headingLevel) {
                            headingMatch = re.exec(headingLevel);
                            attributes = {
                                ...attributes,
                                heading: textContent,
                                headingLevel: parseInt(
                                    headingMatch ? headingMatch[1] : '3',
                                    10,
                                ),
                                isToggleable: true,
                            };
                        } else {
                            return;
                        }
                    }
                    return createBlock('abt/bibliography', attributes);
                },
            },
        ],
    },
    edit: BibliographyEdit,
    save: BibliographySave,
};

export default [name, config] as [string, typeof config];
