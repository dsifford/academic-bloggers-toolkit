import { RichText } from '@wordpress/block-editor';
import { BlockSaveProps } from '@wordpress/blocks';
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { parseBibAttributes } from 'utils/editor';

import { Attributes } from './';

type HeadingType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

class BibliographySave extends Component<BlockSaveProps<Attributes>> {
    render() {
        const {
            heading,
            headingLevel,
            isToggleable,
            items,
            headingAlign: textAlign,
        } = this.props.attributes;
        const containerAttrs = parseBibAttributes(this.props.attributes);
        const Tag = `h${headingLevel}` as HeadingType;
        const headingProps = textAlign ? { style: { textAlign } } : {};
        if (heading && isToggleable) {
            return (
                <section
                    className="abt-bibliography"
                    role="region"
                    aria-label={__('Bibliography', 'academic-bloggers-toolkit')}
                >
                    <details>
                        <summary>
                            <Tag
                                {...headingProps}
                                className="abt-bibliography__heading"
                            >
                                {heading}
                            </Tag>
                        </summary>
                        <ol
                            className="abt-bibliography__body"
                            {...containerAttrs}
                        >
                            {items.map(({ content, id }) => (
                                <RichText.Content<'li'>
                                    key={id}
                                    tagName="li"
                                    id={id}
                                    value={content}
                                />
                            ))}
                        </ol>
                    </details>
                </section>
            );
        } else if (heading) {
            return (
                <section
                    className="abt-bibliography"
                    role="region"
                    aria-label={__('Bibliography', 'academic-bloggers-toolkit')}
                >
                    <Tag
                        {...headingProps}
                        className="abt-bibliography__heading"
                    >
                        {heading}
                    </Tag>
                    <ol className="abt-bibliography__body" {...containerAttrs}>
                        {items.map(({ content, id }) => (
                            <RichText.Content<'li'>
                                key={id}
                                tagName="li"
                                id={id}
                                value={content}
                            />
                        ))}
                    </ol>
                </section>
            );
        }
        return (
            <section
                className="abt-bibliography"
                role="region"
                aria-label={__('Bibliography', 'academic-bloggers-toolkit')}
            >
                <ol className="abt-bibliography__body" {...containerAttrs}>
                    {items.map(({ content, id }) => (
                        <RichText.Content<'li'>
                            key={id}
                            tagName="li"
                            id={id}
                            value={content}
                        />
                    ))}
                </ol>
            </section>
        );
    }
}

export default BibliographySave;
