import { RichText } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-post';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import CountIcon from 'components/count-icon';
import ReferenceItem from 'gutenberg/components/reference-item';
import SidebarItemList from 'gutenberg/components/sidebar-item-list';
import EditReferenceDialog from 'gutenberg/dialogs/edit-reference';
import usePrevious from 'hooks/use-previous';

import SidebarToolbar from './toolbar';

interface Footnote {
    id: string;
    content: string;
}

interface DispatchProps {
    parseEditorItems(): void;
    toggleItemSelected(id: string): void;
    updateReference(data: CSL.Data): void;
}

interface SelectProps {
    citedItems: readonly CSL.Data[];
    footnotes: readonly Footnote[];
    isTyping: boolean;
    selectedItems: readonly string[];
    uncitedItems: readonly CSL.Data[];
}

type Props = DispatchProps & SelectProps;

function Sidebar({
    citedItems,
    footnotes,
    isTyping,
    parseEditorItems,
    selectedItems,
    toggleItemSelected,
    uncitedItems,
    updateReference,
}: Props) {
    const [editReferenceId, setEditReferenceId] = useState('');
    const [needsUpdate, setNeedsUpdate] = useState(false);

    const prevCitedItemsLength = usePrevious(citedItems.length);
    const prevFootnotesLength = usePrevious(footnotes.length);

    useEffect(() => {
        const lengthMismatch =
            prevCitedItemsLength !== citedItems.length ||
            prevFootnotesLength !== footnotes.length;
        if (isTyping && lengthMismatch) {
            setNeedsUpdate(true);
        } else if (needsUpdate || lengthMismatch) {
            parseEditorItems();
            setNeedsUpdate(false);
        }
    });

    return (
        <>
            <EditReferenceDialog
                title={__('Edit reference', 'academic-bloggers-toolkit')}
                isOpen={!!editReferenceId}
                itemId={editReferenceId}
                onClose={() => setEditReferenceId('')}
                onSubmit={data => {
                    updateReference(data);
                    setEditReferenceId('');
                }}
            />
            <PluginSidebarMoreMenuItem
                target="abt-reference-list"
                icon="welcome-learn-more"
            >
                {__("Academic Blogger's Toolkit", 'academic-bloggers-toolkit')}
            </PluginSidebarMoreMenuItem>
            <PluginSidebar
                name="abt-reference-list"
                title={__('Reference List', 'academic-bloggers-toolkit')}
            >
                <SidebarToolbar selectedItems={selectedItems} />
                <PanelBody
                    title={__('Cited Items', 'academic-bloggers-toolkit')}
                    icon={<CountIcon count={citedItems.length} />}
                    initialOpen={citedItems.length > 0}
                    opened={citedItems.length === 0 ? false : undefined}
                >
                    <SidebarItemList
                        items={citedItems}
                        renderItem={item => <ReferenceItem item={item} />}
                        selectedItems={selectedItems}
                        onItemClick={toggleItemSelected}
                        onItemDoubleClick={setEditReferenceId}
                    />
                </PanelBody>
                <PanelBody
                    title={__('Uncited Items', 'academic-bloggers-toolkit')}
                    icon={<CountIcon count={uncitedItems.length} />}
                    initialOpen={
                        uncitedItems.length > 0 && citedItems.length === 0
                    }
                    opened={uncitedItems.length === 0 ? false : undefined}
                >
                    <SidebarItemList
                        items={uncitedItems}
                        renderItem={item => <ReferenceItem item={item} />}
                        selectedItems={selectedItems}
                        onItemClick={toggleItemSelected}
                        onItemDoubleClick={setEditReferenceId}
                    />
                </PanelBody>
                <PanelBody
                    title={__('Footnotes', 'academic-bloggers-toolkit')}
                    icon={<CountIcon count={footnotes.length} />}
                    initialOpen={false}
                    opened={footnotes.length === 0 ? false : undefined}
                >
                    <SidebarItemList
                        items={footnotes}
                        renderItem={({ content = '' }) => (
                            <RichText.Content
                                tagName="div"
                                style={{ fontWeight: 'bold' }}
                                value={content}
                            />
                        )}
                        selectedItems={selectedItems}
                        onItemClick={toggleItemSelected}
                    />
                </PanelBody>
            </PluginSidebar>
        </>
    );
}

export default compose(
    withSelect<SelectProps>(select => {
        const { getCitedItems, getFootnotes, getSortedItems } = select(
            'abt/data',
        );
        const {
            getSelectedItems,
            getSidebarSortMode,
            getSidebarSortOrder,
        } = select('abt/ui');
        return {
            citedItems: getCitedItems(),
            footnotes: getFootnotes(),
            isTyping: select<boolean>('core/block-editor').isTyping(),
            selectedItems: getSelectedItems(),
            uncitedItems: getSortedItems(
                getSidebarSortMode(),
                getSidebarSortOrder(),
                'uncited',
            ),
        };
    }),
    withDispatch<DispatchProps, SelectProps>(dispatch => ({
        parseEditorItems() {
            dispatch('abt/data').parseCitations();
            dispatch('abt/data').parseFootnotes();
        },
        toggleItemSelected(id) {
            dispatch('abt/ui').toggleItemSelected(id);
        },
        updateReference(data) {
            dispatch('abt/data').updateReference(data);
        },
    })),
)(Sidebar);
