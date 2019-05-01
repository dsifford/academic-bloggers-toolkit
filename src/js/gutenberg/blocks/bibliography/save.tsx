import { RichText } from '@wordpress/block-editor';
import { BlockSaveProps } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import { Attributes } from './';

import { parseBibAttributes } from 'utils/editor';
import styles from './style.scss';

type HeadingType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

type Props = BlockSaveProps<Attributes>;

export default function BibliographySave(props: Props) {
    const { attributes } = props;
    const { isToggleable } = attributes;
    return (
        <section
            className="abt-bibliography"
            role="region"
            aria-label={__('Bibliography', 'academic-bloggers-toolkit')}
        >
            {isToggleable && (
                <details>
                    <summary className={styles.summary}>
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
    attributes: { heading, headingAlign: textAlign, headingLevel },
}: Props) {
    if (!heading) {
        return null;
    }
    const Tag = `h${headingLevel}` as HeadingType;
    return (
        <Tag className="abt-bibliography__heading" style={{ textAlign }}>
            {heading}
        </Tag>
    );
}

function ItemList(atts: Props['attributes']) {
    const containerAttrs = parseBibAttributes(atts);
    return (
        <ol className="abt-bibliography__body" {...containerAttrs}>
            {atts.items.map(({ content, id }) => (
                <RichText.Content
                    key={id}
                    tagName="li"
                    id={id}
                    value={content}
                />
            ))}
        </ol>
    );
}
