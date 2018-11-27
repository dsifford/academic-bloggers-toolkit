import { Panel, PanelBody, PanelRow } from '@wordpress/components';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-post';

import Toolbar from './toolbar';

const Sidebar = () => (
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
                <PanelBody title="Cited Items" icon="info" initialOpen={false}>
                    <PanelRow>My Panel Inputs and Labels</PanelRow>
                </PanelBody>
                <PanelBody
                    title="Uncited Items"
                    icon="info"
                    initialOpen={false}
                >
                    <PanelRow>My Panel Inputs and Labels</PanelRow>
                </PanelBody>
                <PanelBody title="Footnotes" icon="info" initialOpen={false}>
                    <PanelRow>My Panel Inputs and Labels</PanelRow>
                </PanelBody>
            </Panel>
        </PluginSidebar>
    </>
);

export default Sidebar;
