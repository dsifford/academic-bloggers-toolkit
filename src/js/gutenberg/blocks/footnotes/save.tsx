import { RichText } from '@wordpress/block-editor';
import { BlockSaveProps } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import { Attributes } from './';

type Props = BlockSaveProps<Attributes>;

export default function FootnotesSave({ attributes: { items } }: Props) {
    return (
        // eslint-disable-next-line jsx-a11y/no-redundant-roles
        <section
            aria-label={__('Footnotes', 'academic-bloggers-toolkit')}
            className="abt-footnotes"
            role="region"
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
