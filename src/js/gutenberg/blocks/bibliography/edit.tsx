import { BlockEditProps } from '@wordpress/blocks';
import { PanelBody, ToggleControl, Toolbar } from '@wordpress/components';
import {
    AlignmentToolbar,
    InspectorControls,
    RichText,
} from '@wordpress/editor';
import { Component } from '@wordpress/element';
import classNames from 'classnames';

import TextareaAutosize from 'gutenberg/components/textarea-autosize';

import { Attributes } from './';
import styles from './style.scss';

type HeadingType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

class BibliographyEdit extends Component<BlockEditProps<Attributes>> {
    render() {
        const {
            attributes: {
                content,
                heading,
                headingAlign,
                headingLevel,
                isToggleable,
            },
            setAttributes,
        } = this.props;
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
                        <ToggleControl
                            label="Enable toggle"
                            checked={isToggleable}
                            help="Toggle mode can only be enabled if the bibliography has a heading."
                            onChange={toggleable =>
                                heading &&
                                setAttributes({ isToggleable: toggleable })
                            }
                        />
                    </PanelBody>
                </InspectorControls>
                <section className="abt-bibliography">
                    {isToggleable && (
                        <details>
                            <summary>{this.maybeRenderHeading()}</summary>
                            <RichText.Content<'ol'>
                                className="abt-bibliography__body"
                                multiline="li"
                                tagName="ol"
                                value={content}
                            />
                        </details>
                    )}
                    {!isToggleable && (
                        <>
                            {this.maybeRenderHeading()}
                            <RichText.Content<'ol'>
                                className="abt-bibliography__body"
                                multiline="li"
                                tagName="ol"
                                value={content}
                            />
                        </>
                    )}
                </section>
            </>
        );
    }

    private maybeRenderHeading = () => {
        const {
            attributes: { heading, headingAlign, headingLevel, isToggleable },
            isSelected,
            setAttributes,
        } = this.props;
        if (!isSelected && !heading) {
            return null;
        }
        const Tag = `h${headingLevel}` as HeadingType;
        return (
            <Tag
                className={classNames(
                    {
                        'abt-bibliography__heading': !isToggleable,
                    },
                    styles.heading,
                )}
                style={{ textAlign: headingAlign }}
            >
                {isSelected && (
                    <TextareaAutosize
                        placeholder="Write heading..."
                        value={heading}
                        onChange={e => {
                            setAttributes({
                                heading: e.currentTarget.value,
                            });
                        }}
                        onBlur={() =>
                            !heading && setAttributes({ isToggleable: false })
                        }
                    />
                )}
                {!isSelected && heading}
            </Tag>
        );
    };
}

export default BibliographyEdit;
