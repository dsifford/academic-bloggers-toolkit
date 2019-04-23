import { RichText } from '@wordpress/block-editor';
import { BlockSaveProps } from '@wordpress/blocks';
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { Attributes } from './';

class FootnotesSave extends Component<BlockSaveProps<Attributes>> {
    render() {
        const { items } = this.props.attributes;
        return (
            <section
                className="abt-footnotes"
                role="region"
                aria-label={__('Footnotes', 'academic-bloggers-toolkit')}
            >
                <hr />
                <ol>
                    {items.map(({ content, id }) => (
                        <RichText.Content<'li'>
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
}

export default FootnotesSave;
