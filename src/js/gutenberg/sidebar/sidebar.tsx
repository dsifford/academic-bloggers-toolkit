import { RichText } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-post';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import CountIcon from 'components/count-icon';
import ReferenceItem from 'gutenberg/components/reference-item';
import SidebarItemList from 'gutenberg/components/sidebar-item-list';
import EditReferenceDialog from 'gutenberg/dialogs/edit-reference';
import usePrevious from 'hooks/use-previous';

import SidebarToolbar from './toolbar';

export default function Sidebar() {
    const { parseCitations, parseFootnotes, updateReference } = useDispatch(
        'abt/data',
    );
    const { toggleItemSelected } = useDispatch('abt/ui');

    const {
        citedItems,
        footnotes,
        isTyping,
        selectedItems,
        uncitedItems,
    } = useSelect(select => {
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
            isTyping: select('core/block-editor').isTyping(),
            selectedItems: getSelectedItems(),
            uncitedItems: getSortedItems(
                getSidebarSortMode(),
                getSidebarSortOrder(),
                'uncited',
            ),
        };
    });

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

    const parseEditorItems = () => {
        parseCitations();
        parseFootnotes();
    };

    return (
        <>
            <EditReferenceDialog
                isOpen={!!editReferenceId}
                itemId={editReferenceId}
                title={__('Edit reference', 'academic-bloggers-toolkit')}
                onClose={() => setEditReferenceId('')}
                onSubmit={(data: CSL.Data) => {
                    updateReference(data);
                    setEditReferenceId('');
                }}
            />
            <PluginSidebarMoreMenuItem
                icon="welcome-learn-more"
                target="abt-reference-list"
            >
                {__("Academic Blogger's Toolkit", 'academic-bloggers-toolkit')}
            </PluginSidebarMoreMenuItem>
            <PluginSidebar
                name="abt-reference-list"
                title={__('Reference List', 'academic-bloggers-toolkit')}
            >
                <SidebarToolbar selectedItems={selectedItems} />
                <PanelBody
                    icon={<CountIcon count={citedItems.length} />}
                    initialOpen={citedItems.length > 0}
                    opened={citedItems.length === 0 ? false : undefined}
                    title={__('Cited Items', 'academic-bloggers-toolkit')}
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
                    icon={<CountIcon count={uncitedItems.length} />}
                    initialOpen={
                        uncitedItems.length > 0 && citedItems.length === 0
                    }
                    opened={uncitedItems.length === 0 ? false : undefined}
                    title={__('Uncited Items', 'academic-bloggers-toolkit')}
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
                    icon={<CountIcon count={footnotes.length} />}
                    initialOpen={false}
                    opened={footnotes.length === 0 ? false : undefined}
                    title={__('Footnotes', 'academic-bloggers-toolkit')}
                >
                    <SidebarItemList
                        items={footnotes}
                        renderItem={({ content = '' }) => (
                            <RichText.Content
                                style={{ fontWeight: 'bold' }}
                                tagName="div"
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
