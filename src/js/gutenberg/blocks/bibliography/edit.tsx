import { BlockEditProps } from '@wordpress/blocks';
import { PanelBody, Toolbar } from '@wordpress/components';
import { AlignmentToolbar, InspectorControls } from '@wordpress/editor';
import { Component } from '@wordpress/element';
import classNames from 'classnames';

import { Attributes } from './';
import styles from './style.scss';

type HeadingType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

class BibliographyEdit extends Component<BlockEditProps<Attributes>> {
    render() {
        const { attributes, isSelected, setAttributes } = this.props;
        const { content, heading, headingAlign, headingLevel } = attributes;
        const Tag = `h${headingLevel}` as HeadingType;
        return (
            <>
                <InspectorControls>
                    <PanelBody title="Bibliography Settings">
                        <p>Heading Level</p>
                        <Toolbar
                            controls={[...Array(6).keys()].map(level => ({
                                icon: 'heading',
                                title: `Heading ${level + 1}`,
                                isActive: level + 1 === headingLevel,
                                onClick: () =>
                                    setAttributes({ headingLevel: level + 1 }),
                                subscript: `${level + 1}`,
                            }))}
                        />
                        <p>Heading Alignment</p>
                        <AlignmentToolbar
                            value={headingAlign}
                            onChange={align =>
                                setAttributes({ headingAlign: align })
                            }
                        />
                    </PanelBody>
                </InspectorControls>
                <section className="abt-bibliography">
                    {(isSelected || heading !== '') && (
                        <Tag
                            className={classNames(
                                'abt-bibliography__heading',
                                styles.heading,
                            )}
                        >
                            {isSelected && (
                                <input
                                    placeholder="Write heading..."
                                    style={{ textAlign: headingAlign }}
                                    className={styles.headingInput}
                                    value={heading}
                                    onInput={(e: any) =>
                                        setAttributes({
                                            heading: e.currentTarget.value,
                                        })
                                    }
                                />
                            )}
                            {!isSelected && heading}
                        </Tag>
                    )}
                    {/* tslint:disable-next-line:react-no-dangerous-html */}
                    <ol
                        className="abt-bibliography__body"
                        dangerouslySetInnerHTML={{
                            __html: content,
                        }}
                    />
                </section>
            </>
        );
    }
}

export default BibliographyEdit;
