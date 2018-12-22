import { BlockSaveProps } from '@wordpress/blocks';
import { RichText } from '@wordpress/editor';
import { Component } from '@wordpress/element';

import { Attributes } from './';

type HeadingType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

class BibliographySave extends Component<BlockSaveProps<Attributes>> {
    render() {
        const {
            content,
            isToggleable,
            heading,
            headingLevel,
            headingAlign: textAlign,
        } = this.props.attributes;
        const Tag = `h${headingLevel}` as HeadingType;
        const headingProps = textAlign ? { style: { textAlign } } : {};
        if (heading && isToggleable) {
            return (
                <section className="abt-bibliography">
                    <details>
                        <summary>
                            <Tag
                                {...headingProps}
                                className="abt-bibliography__heading"
                            >
                                {heading}
                            </Tag>
                        </summary>
                        <RichText.Content<'ol'>
                            className="abt-bibliography__body"
                            multiline="li"
                            tagName="ol"
                            value={content}
                        />
                    </details>
                </section>
            );
        } else if (heading) {
            return (
                <section className="abt-bibliography">
                    <Tag
                        {...headingProps}
                        className="abt-bibliography__heading"
                    >
                        {heading}
                    </Tag>
                    <RichText.Content<'ol'>
                        className="abt-bibliography__body"
                        multiline="li"
                        tagName="ol"
                        value={content}
                    />
                </section>
            );
        }
        return (
            <section className="abt-bibliography">
                <RichText.Content<'ol'>
                    className="abt-bibliography__body"
                    multiline="li"
                    tagName="ol"
                    value={content}
                />
            </section>
        );
    }
}

export default BibliographySave;
