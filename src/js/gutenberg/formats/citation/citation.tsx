import { parse } from '@wordpress/blocks';
import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';
import { Component } from '@wordpress/element';
import {
    create,
    FormatEditProps as OwnProps,
    insert,
} from '@wordpress/rich-text';
import { ToolbarButton } from 'gutenberg/sidebar/toolbar';

import { createCitationHtml } from './utils';

interface ProvidedDispatchProps {
    resetBlocks: (serialized: string) => void;
}

interface ProvidedSelectProps {
    getEditedPostContent: () => string;
}

type Props = OwnProps & ProvidedDispatchProps & ProvidedSelectProps;

class Citation extends Component<Props> {
    render() {
        return (
            <>
                <ToolbarButton
                    icon="exit"
                    label="Insert citation"
                    onClick={this.insertCitation}
                />
            </>
        );
    }

    private insertCitation = (): void => {
        const { onChange, value } = this.props;
        const newValue = create({
            html: createCitationHtml({
                id: `${Date.now()}`,
                items: ['25236231', 'asdfa-3g43gfjhf'],
                innerHTML: `<sup>hello</sup>`,
            }),
        });
        console.log(newValue);
        onChange(insert(value, newValue));
    };
}

export default compose([
    withDispatch<OwnProps, ProvidedDispatchProps>(dispatch => ({
        resetBlocks(serialized) {
            dispatch('core/editor').resetBlocks(parse(serialized));
        },
    })),
    withSelect<OwnProps, ProvidedSelectProps>(select => ({
        getEditedPostContent() {
            return select('core/editor').getEditedPostContent();
        },
    })),
])(Citation);
