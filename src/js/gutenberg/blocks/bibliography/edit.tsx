import { BlockEditProps } from '@wordpress/blocks';
import { PanelBody, Toolbar } from '@wordpress/components';
import { AlignmentToolbar, InspectorControls } from '@wordpress/editor';
import { Component } from '@wordpress/element';
import classnames from 'classnames';

import styles from './style.scss';

class BibliographyEdit extends Component<BlockEditProps> {
    render() {
        const { attributes, isSelected, setAttributes } = this.props;
        const { content, heading, headingAlign, headingLevel } = attributes;
        const Tag: any = `h${headingLevel}`;
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
                <section>
                    {(isSelected || heading !== '') && (
                        <Tag
                            className={classnames(
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
                    {content}
                    TODO: ...
                </section>
            </>
        );
    }
}

export default BibliographyEdit;
