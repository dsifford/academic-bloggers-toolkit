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
        // eslint-disable-next-line jsx-a11y/no-redundant-roles
        <section
            aria-label={__('References', 'academic-bloggers-toolkit')}
            className="abt-static-bib"
            role="region"
        >
            <ListTag className="abt-bibliography__body">
                {items.map(({ content, id }, i) => (
                    <RichText.Content
                        key={i}
                        className="csl-entry"
                        data-id={id}
                        tagName="li"
                        value={content}
                    />
                ))}
            </ListTag>
        </section>
    );
}
