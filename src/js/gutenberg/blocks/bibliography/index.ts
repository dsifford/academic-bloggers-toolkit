import { BlockConfig, createBlock } from '@wordpress/blocks';
import { dispatch } from '@wordpress/data';

import BibliographyEdit from './edit';
import BibliographySave from './save';

export interface Attributes {
    content: string;
    heading: string;
    headingLevel: number;
    isToggleable: boolean;
    headingAlign?: 'left' | 'right' | 'center';
}

const config: BlockConfig<Attributes> = {
    title: 'Bibliography',
    category: 'widgets',
    description: 'Display a list of your cited references.',
    icon: 'welcome-learn-more',
    attributes: {
        content: {
            type: 'string',
            source: 'html',
            selector: '.abt-bibliography__body',
            multiline: 'li',
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
                    let attributes: Partial<Attributes> = {
                        content: '',
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
                    setTimeout(dispatch('abt/data').parseCitations, 500);
                    return createBlock('abt/bibliography', attributes);
                },
            },
        ],
    },
    edit: BibliographyEdit,
    save: BibliographySave,
};

export default config;
