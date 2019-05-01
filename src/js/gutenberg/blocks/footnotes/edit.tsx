import { RichText } from '@wordpress/block-editor';
import { BlockEditProps } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import { Attributes } from './';

type Props = BlockEditProps<Attributes>;

export default function FootnotesEdit({ attributes: { items } }: Props) {
    return (
        <section
            className="abt-footnotes"
            role="region"
            aria-label={__('Footnotes', 'academic-bloggers-toolkit')}
        >
            <hr />
            <ol>
                {items.map(({ content, id }) => (
                    <RichText.Content
                        key={id}
                        tagName="li"
                        id={id}
                        className="abt-footnotes-item"
                        value={content}
                    />
                ))}
            </ol>
        </section>
    );
}
