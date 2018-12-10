import { Panel, PanelBody } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-post';
import { Component } from '@wordpress/element';

import CountIcon from 'gutenberg/components/count-icon';
import SidebarItemList from 'gutenberg/components/sidebar-item-list';

import Toolbar from './toolbar';

interface SelectProps {
    citedItems: ReadonlyArray<CSL.Data>;
    selectedItems: ReadonlyArray<string>;
    uncitedItems: ReadonlyArray<CSL.Data>;
}

type Props = SelectProps;

class Sidebar extends Component<Props> {
    render() {
        const { citedItems, selectedItems, uncitedItems } = this.props;
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
                            icon={<CountIcon count={citedItems.length} />}
                            initialOpen={citedItems.length > 0}
                            opened={citedItems.length === 0 ? false : undefined}
                        >
                            <SidebarItemList
                                items={citedItems}
                                selectedItems={selectedItems}
                            />
                        </PanelBody>
                        <PanelBody
                            title="Uncited Items"
                            icon={<CountIcon count={uncitedItems.length} />}
                            initialOpen={false}
                            opened={
                                uncitedItems.length === 0 ? false : undefined
                            }
                        >
                            <SidebarItemList
                                items={uncitedItems}
                                selectedItems={selectedItems}
                            />
                        </PanelBody>
                        {/* <PanelBody
                            title="Footnotes"
                            icon="info"
                            initialOpen={false}
                        >
                            <PanelRow>My Panel Inputs and Labels</PanelRow>
                        </PanelBody> */}
                    </Panel>
                </PluginSidebar>
            </>
        );
    }
}

export default compose([
    withSelect<SelectProps>(select => ({
        citedItems: select('abt/data').getCitedItems(),
        selectedItems: select('abt/ui').getSelectedItems(),
        uncitedItems: select('abt/data').getUncitedItems(),
        bitches: 3,
    })),
])(Sidebar);
