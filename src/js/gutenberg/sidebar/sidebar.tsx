import { PanelBody } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-post';
import { RichText } from '@wordpress/editor';
import { Component, ComponentType } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import _ from 'lodash';

import CountIcon from 'components/count-icon';
import ReferenceItem from 'gutenberg/components/reference-item';
import SidebarItemList from 'gutenberg/components/sidebar-item-list';
import EditReferenceDialog from 'gutenberg/dialogs/edit-reference';
import { Style } from 'stores/data';

import SidebarToolbar from './toolbar';

namespace Sidebar {
    export interface DispatchProps {
        parseEditorItems(): void;
        toggleItemSelected(id: string): void;
        updateReference(data: CSL.Data): void;
    }

    export interface SelectProps {
        citedItems: ReadonlyArray<CSL.Data>;
        footnotes: ReadonlyArray<{ id: string; content: string }>;
        isTyping: boolean;
        selectedItems: ReadonlyArray<string>;
        style: Readonly<Style>;
        uncitedItems: ReadonlyArray<CSL.Data>;
    }

    export type Props = DispatchProps & SelectProps;

    export interface State {
        editReferenceId: string;
        needsUpdate: boolean;
    }
}

class Sidebar extends Component<Sidebar.Props, Sidebar.State> {
    state = {
        editReferenceId: '',
        needsUpdate: false,
    };
    componentDidUpdate(prevProps: Sidebar.Props) {
        const {
            citedItems,
            footnotes,
            isTyping,
            parseEditorItems,
        } = this.props;
        const needsUpdate =
            prevProps.citedItems.length !== citedItems.length ||
            prevProps.footnotes.length !== footnotes.length;
        if (isTyping && needsUpdate) {
            this.setState({ needsUpdate });
        } else if (this.state.needsUpdate || needsUpdate) {
            parseEditorItems();
            this.setState({ needsUpdate: false });
        }
    }
    render() {
        const {
            citedItems,
            footnotes,
            selectedItems,
            toggleItemSelected,
            uncitedItems,
            updateReference,
        } = this.props;
        const { editReferenceId } = this.state;
        return (
            <>
                <EditReferenceDialog
                    title={__('Edit reference', 'academic-bloggers-toolkit')}
                    isOpen={!!editReferenceId}
                    itemId={editReferenceId}
                    onClose={() => this.setEditReferenceId()}
                    onSubmit={data => {
                        updateReference(data);
                        this.setEditReferenceId();
                    }}
                />
                <PluginSidebarMoreMenuItem
                    target="abt-reference-list"
                    icon="welcome-learn-more"
                >
                    {__(
                        "Academic Blogger's Toolkit",
                        'academic-bloggers-toolkit',
                    )}
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
                            renderItem={ReferenceItem}
                            selectedItems={selectedItems}
                            onItemClick={toggleItemSelected}
                            onItemDoubleClick={this.setEditReferenceId}
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
                            renderItem={ReferenceItem}
                            selectedItems={selectedItems}
                            onItemClick={toggleItemSelected}
                            onItemDoubleClick={this.setEditReferenceId}
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
                            renderItem={({ content }) => (
                                <RichText.Content
                                    tagName="div"
                                    style={{ fontWeight: 'bold' }}
                                    value={content || ''}
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

    private setEditReferenceId = (id: string = '') =>
        this.setState({ editReferenceId: id });
}

export default compose([
    withSelect<Sidebar.SelectProps>(select => {
        const {
            getCitedItems,
            getFootnotes,
            getSortedItems,
            getStyle,
        } = select('abt/data');
        const {
            getSelectedItems,
            getSidebarSortMode,
            getSidebarSortOrder,
        } = select('abt/ui');
        return {
            citedItems: getCitedItems(),
            footnotes: getFootnotes(),
            isTyping: select<boolean>('core/editor').isTyping(),
            selectedItems: getSelectedItems(),
            style: getStyle(),
            uncitedItems: getSortedItems(
                getSidebarSortMode(),
                getSidebarSortOrder(),
                'uncited',
            ),
        };
    }),
    withDispatch<Sidebar.DispatchProps>(dispatch => ({
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
])(Sidebar) as ComponentType;
