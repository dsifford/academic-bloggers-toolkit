import {
    AlignmentToolbar,
    InspectorControls,
    RichText,
} from '@wordpress/block-editor';
import { BlockEditProps } from '@wordpress/blocks';
import { PanelBody, ToggleControl, Toolbar } from '@wordpress/components';
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';

import TextareaAutosize from 'components/textarea-autosize';
import { parseBibAttributes } from 'utils/editor';

import { Attributes } from './';
import styles from './style.scss';

type HeadingType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

class BibliographyEdit extends Component<BlockEditProps<Attributes>> {
    render() {
        const { attributes, setAttributes } = this.props;
        const {
            heading,
            headingAlign,
            headingLevel,
            isToggleable,
            items,
        } = attributes;
        const containerAttrs = parseBibAttributes(attributes);
        return (
            <>
                <InspectorControls>
                    <PanelBody
                        title={__(
                            'Bibliography Settings',
                            'academic-bloggers-toolkit',
                        )}
                    >
                        <p>
                            {__('Heading Level', 'academic-bloggers-toolkit')}
                        </p>
                        <Toolbar
                            controls={[...Array(6).keys()].map(level => ({
                                icon: 'heading',
                                title: `${__(
                                    'Heading',
                                    'academic-bloggers-toolkit',
                                )} ${level + 1}`,
                                isActive: level + 1 === headingLevel,
                                onClick: () =>
                                    setAttributes({ headingLevel: level + 1 }),
                                subscript: `${level + 1}`,
                            }))}
                        />
                        <p>
                            {__(
                                'Heading Alignment',
                                'academic-bloggers-toolkit',
                            )}
                        </p>
                        <AlignmentToolbar
                            value={headingAlign}
                            onChange={align =>
                                setAttributes({ headingAlign: align })
                            }
                        />
                        <ToggleControl
                            label={__(
                                'Enable toggle',
                                'academic-bloggers-toolkit',
                            )}
                            checked={isToggleable}
                            help={__(
                                'Toggle mode can only be enabled if the bibliography has a heading.',
                                'academic-bloggers-toolkit',
                            )}
                            onChange={toggleable =>
                                heading &&
                                setAttributes({ isToggleable: toggleable })
                            }
                        />
                    </PanelBody>
                </InspectorControls>
                <section
                    className="abt-bibliography"
                    role="region"
                    aria-label={__('Bibliography', 'academic-bloggers-toolkit')}
                >
                    {isToggleable && (
                        <details>
                            <summary className={styles.summary}>
                                {this.maybeRenderHeading()}
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
                    )}
                    {!isToggleable && (
                        <>
                            {this.maybeRenderHeading()}
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
                        placeholder={__(
                            'Write heading...',
                            'academic-bloggers-toolkit',
                        )}
                        value={heading}
                        onChange={({ currentTarget: { value } }) => {
                            setAttributes({
                                heading: value,
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
