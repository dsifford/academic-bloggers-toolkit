import {
    AlignmentToolbar,
    InspectorControls,
    RichText,
} from '@wordpress/block-editor';
import { BlockEditProps } from '@wordpress/blocks';
import { PanelBody, ToggleControl, Toolbar } from '@wordpress/components';
import { useMemo } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import classNames from 'classnames';
import { range } from 'lodash';

import TextareaAutosize from 'components/textarea-autosize';
import { parseBibAttributes } from 'utils/editor';

import { Attributes } from './';
import styles from './style.scss';

type HeadingType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

type Props = BlockEditProps<Attributes>;

export default function BibliographyEdit(props: Props) {
    const { attributes, setAttributes } = props;
    const { heading, headingAlign, headingLevel, isToggleable } = attributes;
    return (
        <>
            <InspectorControls>
                <PanelBody
                    title={__(
                        'Bibliography Settings',
                        'academic-bloggers-toolkit',
                    )}
                >
                    {__('Heading Level', 'academic-bloggers-toolkit')}
                    <Toolbar
                        controls={range(1, 7).map(level => ({
                            icon: 'heading',
                            title: sprintf(__('Heading %d'), level),
                            isActive: level === headingLevel,
                            onClick: () =>
                                setAttributes({ headingLevel: level }),
                            subscript: `${level}`,
                        }))}
                    />
                    {__('Heading Alignment', 'academic-bloggers-toolkit')}
                    <AlignmentToolbar
                        value={headingAlign}
                        onChange={align =>
                            setAttributes({
                                headingAlign: align as typeof headingAlign,
                            })
                        }
                    />
                    <ToggleControl
                        checked={isToggleable}
                        help={__(
                            'Toggle mode can only be enabled if the bibliography has a heading.',
                            'academic-bloggers-toolkit',
                        )}
                        label={__('Enable toggle', 'academic-bloggers-toolkit')}
                        onChange={toggleable =>
                            heading &&
                            setAttributes({ isToggleable: toggleable })
                        }
                    />
                </PanelBody>
            </InspectorControls>
            <Bibliography {...props} />
        </>
    );
}

function Bibliography(props: Props) {
    const { attributes } = props;
    const { isToggleable } = attributes;
    return (
        <section
            aria-label={__('Bibliography', 'academic-bloggers-toolkit')}
            className="abt-bibliography"
        >
            {isToggleable && (
                <details>
                    <summary>
                        <BibliographyHeading {...props} />
                    </summary>
                    <ItemList {...attributes} />
                </details>
            )}
            {!isToggleable && (
                <>
                    <BibliographyHeading {...props} />
                    <ItemList {...attributes} />
                </>
            )}
        </section>
    );
}

function BibliographyHeading({
    attributes: { heading, headingAlign, headingLevel, isToggleable },
    isSelected,
    setAttributes,
}: Props) {
    if (!isSelected && !heading) {
        return null;
    }
    const Tag = `h${headingLevel}` as HeadingType;
    const className = useMemo(
        () =>
            classNames(
                {
                    'abt-bibliography__heading': !isToggleable,
                },
                styles.heading,
            ),
        [isToggleable],
    );
    return (
        <Tag className={className} style={{ textAlign: headingAlign }}>
            {isSelected && (
                <TextareaAutosize
                    placeholder={__(
                        'Write heading...',
                        'academic-bloggers-toolkit',
                    )}
                    value={heading}
                    onBlur={() =>
                        !heading && setAttributes({ isToggleable: false })
                    }
                    onChange={e =>
                        setAttributes({ heading: e.currentTarget.value })
                    }
                />
            )}
            {!isSelected && heading}
        </Tag>
    );
}

function ItemList(atts: Props['attributes']) {
    const containerAttrs = useMemo(() => parseBibAttributes(atts), [atts]);
    return (
        <ol className="abt-bibliography__body" {...containerAttrs}>
            {atts.items.map(({ content, id }) => (
                <RichText.Content
                    key={id}
                    id={id}
                    tagName="li"
                    value={content}
                />
            ))}
        </ol>
    );
}
