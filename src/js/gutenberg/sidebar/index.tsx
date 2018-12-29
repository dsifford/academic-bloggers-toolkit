import { PanelBody } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-post';
import { Component, ComponentType } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import _ from 'lodash';

import CountIcon from 'gutenberg/components/count-icon';
import SidebarItemList from 'gutenberg/components/sidebar-item-list';
import EditReferenceDialog from 'gutenberg/dialogs/edit-reference';

import SidebarToolbar from './toolbar';

namespace Sidebar {
    export interface DispatchProps {
        parseCitations(): void;
        toggleItemSelected(id: string): void;
        updateReference(data: CSL.Data): void;
    }

    export interface SelectProps {
        citedItems: ReadonlyArray<CSL.Data>;
        isTyping: boolean;
        selectedItems: ReadonlyArray<string>;
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
        const { citedItems, isTyping, parseCitations } = this.props;
        const citedItemsDidChange =
            prevProps.citedItems.length !== citedItems.length;
        if (isTyping) {
            if (citedItemsDidChange) {
                this.setState({ needsUpdate: true });
            }
        } else if (this.state.needsUpdate || citedItemsDidChange) {
            parseCitations();
            this.setState({ needsUpdate: false });
        }
    }
    render() {
        const {
            citedItems,
            selectedItems,
            toggleItemSelected,
            uncitedItems,
            updateReference,
        } = this.props;
        const { editReferenceId } = this.state;
        return (
            <>
                <EditReferenceDialog
                    isOpen={!!editReferenceId}
                    itemId={editReferenceId}
                    onClose={this.setEditReferenceId}
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
                            selectedItems={selectedItems}
                            onItemClick={toggleItemSelected}
                            onItemDoubleClick={this.setEditReferenceId}
                        />
                    </PanelBody>
                    {/* <PanelBody
                            title="Footnotes"
                            icon="info"
                            initialOpen={false}
                        >
                            <PanelRow>My Panel Inputs and Labels</PanelRow>
                        </PanelBody> */}
                </PluginSidebar>
            </>
        );
    }

    private setEditReferenceId = (id: string = '') =>
        this.setState({ editReferenceId: id });
}

export default compose([
    withSelect<Sidebar.SelectProps>(select => {
        const { getCitedItems, getSortedItems } = select('abt/data');
        const {
            getSelectedItems,
            getSidebarSortMode,
            getSidebarSortOrder,
        } = select('abt/ui');
        return {
            citedItems: getCitedItems(),
            isTyping: select<boolean>('core/editor').isTyping(),
            selectedItems: getSelectedItems(),
            uncitedItems: getSortedItems(
                getSidebarSortMode(),
                getSidebarSortOrder(),
                'uncited',
            ),
        };
    }),
    withDispatch<Sidebar.DispatchProps>(dispatch => ({
        parseCitations() {
            dispatch('abt/data').parseCitations();
        },
        toggleItemSelected(id) {
            dispatch('abt/ui').toggleItemSelected(id);
        },
        updateReference(data) {
            dispatch('abt/data').updateReference(data);
        },
    })),
])(Sidebar) as ComponentType;
