import { BlockSaveProps } from '@wordpress/blocks';
import { RichText } from '@wordpress/editor';
import { Component } from '@wordpress/element';

import { Attributes } from './';

class FootnotesSave extends Component<BlockSaveProps<Attributes>> {
    render() {
        const { items } = this.props.attributes;
        return (
            <section className="abt-footnotes">
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
