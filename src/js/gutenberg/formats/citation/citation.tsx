import { parse, serialize } from '@wordpress/blocks';
import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { create, FormatProps, insert } from '@wordpress/rich-text';
import { get } from 'lodash';

import { ToolbarButton } from 'gutenberg/sidebar/toolbar';
import { ZERO_WIDTH_SPACE } from 'utils/constants';
import { createSelector } from 'utils/dom';
import { CitationElement } from 'utils/element';
import { getNeighbors, iterate, mergeItems } from 'utils/formats';

import { name as NAME } from './';

import './citation.scss?global';

interface DispatchProps {
    mergeLegacyCitations(): void;
    parseCitations(): void;
}

interface SelectProps {
    selectedItems: string[];
}

type OwnProps = FormatProps;
type Props = DispatchProps & SelectProps & OwnProps;

function Citation(props: Props) {
    useEffect(() => props.mergeLegacyCitations(), []);
    const { selectedItems } = props;
    return (
        <>
            <ToolbarButton
                disabled={selectedItems.length === 0}
                icon="exit"
                label={__('Insert citation', 'academic-bloggers-toolkit')}
                onClick={() => insertCitation(props)}
            />
        </>
    );
}

function insertCitation({
    onChange,
    parseCitations,
    selectedItems,
    value,
}: Props) {
    const { activeFormats = [] } = value;
    const activeCitation = activeFormats.find(f => f.type === NAME);

    // If a citation format is currently selected, merge selected references
    // into that format.
    if (activeCitation) {
        const selectedId = get(activeCitation, ['attributes', 'id']);
        for (const { attributes = {} } of iterate(value, NAME)) {
            if (attributes.id === selectedId) {
                attributes.items = mergeItems(selectedItems, attributes.items);
            }
        }
        onChange(value);
    }
    // If no citations are currently selected, check to see if the cursor is
    // currently touching up against an existing format. If so, merge into
    // that citation format.
    else {
        const formats = getNeighbors(NAME, value);
        if (formats.length > 0) {
            for (const format of formats) {
                format.attributes = format.attributes || {};
                format.attributes = {
                    ...format.attributes,
                    items: mergeItems(selectedItems, format.attributes.items),
                };
            }
            onChange(value);
        }
        // Otherwise just insert a new citation format.
        else {
            const newValue = create({
                html: CitationElement.create(selectedItems),
            });
            onChange(insert(value, newValue));
        }
    }
    return parseCitations();
}

const legacyCitationSelector = createSelector(
    ...CitationElement.legacyClassNames.map(cls => ({
        classNames: [cls],
        attributes: { 'data-reflist': true },
    })),
);

export default compose(
    withDispatch<DispatchProps, OwnProps>((dispatch, _, { select }) => ({
        mergeLegacyCitations() {
            const selectedBlock = select(
                'core/block-editor',
            ).getSelectedBlock();
            if (!selectedBlock) {
                return;
            }
            const block = document.createElement('div');
            block.innerHTML = serialize([selectedBlock]);
            const legacyNodes = block.querySelectorAll<HTMLElement>(
                legacyCitationSelector,
            );
            if (legacyNodes.length === 0) {
                return;
            }
            for (const node of legacyNodes) {
                node.className = CitationElement.className;
                node.contentEditable = 'false';
                node.dataset.items = node.dataset.reflist;
                delete node.dataset.reflist;
                if (node.firstElementChild) {
                    node.dataset.hasChildren = 'true';
                    node.firstElementChild.innerHTML =
                        ZERO_WIDTH_SPACE +
                        node.firstElementChild.innerHTML +
                        ZERO_WIDTH_SPACE;
                } else {
                    node.innerHTML =
                        ZERO_WIDTH_SPACE + node.innerHTML + ZERO_WIDTH_SPACE;
                }
            }
            const { clientId, ...updates } = parse(block.innerHTML)[0];
            dispatch('core/block-editor').updateBlock(
                selectedBlock.clientId,
                updates,
            );
        },
        parseCitations() {
            dispatch('abt/ui').clearSelectedItems();
            dispatch('abt/data').parseCitations();
        },
    })),
    withSelect<SelectProps, OwnProps & DispatchProps>(select => {
        const referenceIds = select('abt/data')
            .getItems()
            .map(({ id }) => id);
        const selectedItems = select('abt/ui')
            .getSelectedItems()
            .filter(id => referenceIds.includes(id));
        return {
            selectedItems,
        };
    }),
)(Citation);
