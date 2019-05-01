import { RichText } from '@wordpress/block-editor';
import { BlockSaveProps } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import { Attributes } from './';

type Props = BlockSaveProps<Attributes>;

export default function BibliographySave({
    attributes: { items, orderedList },
}: Props) {
    const ListTag = orderedList ? 'ol' : 'ul';
    return (
        <section
            className="abt-static-bib"
            role="region"
            aria-label={__('References', 'academic-bloggers-toolkit')}
        >
            <ListTag className="abt-bibliography__body">
                {items.map(({ content, id }, i) => (
                    <RichText.Content
                        key={i}
                        data-id={id}
                        tagName="li"
                        className="csl-entry"
                        value={content}
                    />
                ))}
            </ListTag>
        </section>
    );
}
