import { BlockSaveProps } from '@wordpress/blocks';
import { RichText } from '@wordpress/editor';
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { Attributes } from './';

class BibliographySave extends Component<BlockSaveProps<Attributes>> {
    render() {
        const { items, orderedList } = this.props.attributes;
        const ListTag = orderedList ? 'ol' : 'ul';
        return (
            <section
                className="abt-static-bib"
                role="region"
                aria-label={__('References', 'academic-bloggers-toolkit')}
            >
                <ListTag className="abt-bibliography__body">
                    {items.map(({ content, id }, i) => (
                        <RichText.Content<'li'>
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
}

export default BibliographySave;
