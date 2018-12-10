import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';
import { Component } from '@wordpress/element';
import { create, FormatProps, insert } from '@wordpress/rich-text';

import { ToolbarButton } from 'gutenberg/sidebar/toolbar';
import {
    createCitationHtml,
    getNeighboringFormats,
    mergeItems,
} from 'utils/editor';

import './citation.scss';

interface DispatchProps {
    parseCitations: () => void;
}

interface SelectProps {
    selectedItems: string[];
    selectedElement: HTMLElement | null;
}

class Citation extends Component<FormatProps & DispatchProps & SelectProps> {
    static readonly formatName = 'abt/citation';
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
        const {
            onChange,
            parseCitations,
            selectedItems,
            selectedElement,
            value,
        } = this.props;
        console.log(this.props);

        // TODO: Maybe clean this up and extract it out to a utility function.
        if (selectedElement) {
            for (const items of value.formats.filter(Boolean)) {
                for (const item of items) {
                    if (
                        item.type === Citation.formatName &&
                        item.attributes &&
                        item.attributes.id === selectedElement.dataset.id
                    ) {
                        item.attributes = {
                            ...item.attributes,
                            items: mergeItems(
                                selectedItems,
                                item.attributes.items,
                            ),
                        };
                    }
                }
            }
            onChange(value);
            return parseCitations();
        }

        const formats = getNeighboringFormats(Citation.formatName, value);
        if (formats.length > 0) {
            for (const format of formats) {
                format.attributes = format.attributes || {};
                format.attributes = {
                    ...format.attributes,
                    items: mergeItems(selectedItems, format.attributes.items),
                };
            }
            onChange(value);
        } else {
            const newValue = create({
                html: createCitationHtml(selectedItems),
            });
            onChange(insert(value, newValue));
        }

        parseCitations();
    };
}

export default compose([
    withDispatch<DispatchProps, FormatProps>(dispatch => ({
        parseCitations() {
            dispatch('abt/data').parseCitations();
            dispatch('abt/ui').clearSelectedItems();
        },
    })),
    withSelect<SelectProps, FormatProps>(select => {
        return {
            selectedItems: select('abt/ui').getSelectedItems(),
            selectedElement: document.querySelector<HTMLDivElement>(
                '.abt-citation[data-mce-selected]',
            ),
        };
    }),
])(Citation);
