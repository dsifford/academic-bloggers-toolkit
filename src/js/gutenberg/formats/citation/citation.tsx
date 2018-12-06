import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';
import { Component } from '@wordpress/element';
import {
    create,
    FormatEditProps as OwnProps,
    insert,
} from '@wordpress/rich-text';
import uuid from 'uuid/v4';

import { ToolbarButton } from 'gutenberg/sidebar/toolbar';
import { createCitationHtml } from './utils';

interface DispatchProps {
    parseCitations: () => void;
}

interface SelectProps {
    selectedItems: string[];
}

type Props = OwnProps & DispatchProps & SelectProps;

class Citation extends Component<Props> {
    render() {
        const { selectedItems } = this.props;
        return (
            <>
                <ToolbarButton
                    icon="exit"
                    label="Insert citation"
                    disabled={selectedItems.length === 0}
                    onClick={this.insertCitation}
                />
            </>
        );
    }

    private insertCitation = (): void => {
        const { onChange, parseCitations, selectedItems, value } = this.props;
        const newValue = create({
            html: createCitationHtml({
                id: uuid(),
                items: selectedItems,
            }),
        });
        onChange(insert(value, newValue));
        // TODO: Clear selected items here.
        parseCitations();
    };
}

export default compose([
    withDispatch<OwnProps, DispatchProps>(dispatch => ({
        parseCitations() {
            dispatch('abt/data').parseCitations();
        },
    })),
    withSelect<OwnProps, SelectProps>(select => ({
        selectedItems: select('abt/ui').getSelectedItems(),
    })),
])(Citation);
