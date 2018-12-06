import { Panel, PanelBody, PanelRow } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-post';
import { Component } from '@wordpress/element';

import SidebarItemList from 'gutenberg/components/sidebar-item-list';
import Toolbar from './toolbar';

interface SelectProps {
    uncitedItems: ReadonlyArray<CSL.Data>;
    selectedItems: ReadonlyArray<string>;
}

type Props = SelectProps;

class Sidebar extends Component<Props> {
    render() {
        const { selectedItems, uncitedItems } = this.props;
        return (
            <>
                <PluginSidebarMoreMenuItem
                    target="abt-reference-list"
                    icon="welcome-learn-more"
                >
                    Academic Blogger's Toolkit
                </PluginSidebarMoreMenuItem>
                <PluginSidebar name="abt-reference-list" title="Reference List">
                    <Panel>
                        <Toolbar />
                        <PanelBody
                            title="Cited Items"
                            icon="info"
                            initialOpen={false}
                        >
                            <PanelRow>My Panel Inputs and Labels</PanelRow>
                        </PanelBody>
                        <PanelBody
                            title="Uncited Items"
                            icon="info"
                            initialOpen={false}
                        >
                            <SidebarItemList
                                items={uncitedItems}
                                selectedItems={selectedItems}
                            />
                        </PanelBody>
                        <PanelBody
                            title="Footnotes"
                            icon="info"
                            initialOpen={false}
                        >
                            <PanelRow>My Panel Inputs and Labels</PanelRow>
                        </PanelBody>
                    </Panel>
                </PluginSidebar>
            </>
        );
    }
}

export default compose([
    withSelect<{}, SelectProps>(select => ({
        uncitedItems: select('abt/data').getUncitedItems(),
        selectedItems: select('abt/ui').getSelectedItems(),
    })),
])(Sidebar);
