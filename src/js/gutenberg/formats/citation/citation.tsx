import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { create, FormatProps, insert } from '@wordpress/rich-text';

import { ToolbarButton } from 'gutenberg/sidebar/toolbar';
import { createSelector } from 'utils/dom';
import { CitationElement } from 'utils/element';
import { getNeighbors, iterate, mergeItems } from 'utils/formats';

import { name as NAME } from './';

import './citation.scss?global';

namespace Citation {
    export interface DispatchProps {
        parseCitations(): void;
    }
    export interface SelectProps {
        selectedItems: string[];
        selectedElement: HTMLElement | null;
    }
    export type OwnProps = FormatProps;
    export type Props = DispatchProps & SelectProps & OwnProps;
}

class Citation extends Component<Citation.Props> {
    componentDidMount() {
        this.mergeLegacyCitations();
    }

    render() {
        const { selectedItems } = this.props;
        return (
            <>
                <ToolbarButton
                    icon="exit"
                    label={__('Insert citation', 'academic-bloggers-toolkit')}
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

        // If a citation format is currently selected, merge selected references
        // into that format.
        if (selectedElement) {
            for (const { attributes } of iterate(value, NAME)) {
                if (attributes && attributes.id === selectedElement.id) {
                    attributes.items = mergeItems(
                        selectedItems,
                        attributes.items,
                    );
                }
            }
            onChange(value);
        } else {
            // If no citations are currently selected, check to see if the cursor is
            // currently touching up against an existing format. If so, merge into
            // that citation format.
            const formats = getNeighbors(NAME, value);
            if (formats.length > 0) {
                for (const format of formats) {
                    format.attributes = format.attributes || {};
                    format.attributes = {
                        ...format.attributes,
                        items: mergeItems(
                            selectedItems,
                            format.attributes.items,
                        ),
                    };
                }
                onChange(value);
            }
            // Otherwise just insert a new citation format.
            else {
                const newValue = create({
                    html: CitationElement.create(selectedItems),
                    removeNode: node =>
                        !node.textContent || node.textContent.trim() === '',
                });
                onChange(insert(value, newValue));
            }
        }
        return parseCitations();
    };

    private mergeLegacyCitations = () => {
        const { onChange, value } = this.props;
        for (const format of iterate(value, NAME)) {
            format.attributes = {
                ...format.attributes,
                editable: 'false',
            };
            if (
                format.unregisteredAttributes &&
                format.unregisteredAttributes.hasOwnProperty('data-reflist')
            ) {
                format.attributes = {
                    ...format.attributes,
                    items: format.unregisteredAttributes['data-reflist'],
                };
            }
            delete format.unregisteredAttributes;
        }
        onChange(value);
    };
}

const selectedCitationSelector = createSelector({
    classNames: [CitationElement.className],
    attributes: { 'data-mce-selected': true },
});

export default compose([
    withDispatch<Citation.DispatchProps>(dispatch => ({
        parseCitations() {
            dispatch('abt/ui').clearSelectedItems();
            dispatch('abt/data').parseCitations();
        },
    })),
    withSelect<Citation.SelectProps>(select => {
        const referenceIds = select('abt/data')
            .getItems()
            .map(({ id }) => id);
        const selectedItems = select('abt/ui')
            .getSelectedItems()
            .filter(id => referenceIds.includes(id));
        return {
            selectedElement: document.querySelector<HTMLSpanElement>(
                selectedCitationSelector,
            ),
            selectedItems,
        };
    }),
])(Citation);
