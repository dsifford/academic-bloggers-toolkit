import { RichText } from '@wordpress/block-editor';
import { BlockEditProps } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import { Attributes } from './';

type Props = BlockEditProps<Attributes>;

export default function FootnotesEdit({ attributes: { items } }: Props) {
    return (
        <section
            aria-label={__('Footnotes', 'academic-bloggers-toolkit')}
            className="abt-footnotes"
        >
            <hr />
            <ol>
                {items.map(({ content, id }) => (
                    <RichText.Content
                        key={id}
                        className="abt-footnotes-item"
                        id={id}
                        tagName="li"
                        value={content}
                    />
                ))}
            </ol>
        </section>
    );
}
