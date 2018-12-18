import { BlockSaveProps } from '@wordpress/blocks';
import { Component } from '@wordpress/element';

import { Attributes } from './';

type HeadingType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

class BibliographySave extends Component<BlockSaveProps<Attributes>> {
    render() {
        const { content, heading, headingLevel } = this.props.attributes;
        const Tag = `h${headingLevel}` as HeadingType;
        return (
            <section className="abt-bibliography">
                {heading !== '' && <Tag>{heading}</Tag>}
                {/* tslint:disable-next-line:react-no-dangerous-html */}
                <ol
                    className="abt-bibliography__body"
                    dangerouslySetInnerHTML={{
                        __html: content,
                    }}
                />
            </section>
        );
    }
}

export default BibliographySave;
