import { PanelBody } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-post';
import { Component } from '@wordpress/element';
import _ from 'lodash';

import CountIcon from 'gutenberg/components/count-icon';
import SidebarItemList from 'gutenberg/components/sidebar-item-list';

import Toolbar from './toolbar';

interface DispatchProps {
    parseCitations(): void;
}

interface SelectProps {
    citedItems: ReadonlyArray<CSL.Data>;
    selectedItems: ReadonlyArray<string>;
    uncitedItems: ReadonlyArray<CSL.Data>;
    isTyping: boolean;
}

type Props = DispatchProps & SelectProps;

interface State {
    needsUpdate: boolean;
}

class Sidebar extends Component<Props, State> {
    state = {
        needsUpdate: false,
    };
    componentDidUpdate(prevProps: Props) {
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
        const { citedItems, selectedItems, uncitedItems } = this.props;
        return (
            <>
                <PluginSidebarMoreMenuItem
                    target="abt-reference-list"
                    icon="welcome-learn-more"
                >
                    Academic Blogger's Toolkit
                </PluginSidebarMoreMenuItem>
                {/* TODO: consider TabPanel component here */}
                <PluginSidebar name="abt-reference-list" title="Reference List">
                    <Toolbar selectedItems={selectedItems} />
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
                        initialOpen={
                            uncitedItems.length > 0 && citedItems.length === 0
                        }
                        opened={uncitedItems.length === 0 ? false : undefined}
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
                </PluginSidebar>
            </>
        );
    }
}

export default compose([
    withSelect<SelectProps>(select => {
        const { getCitedItems, getUncitedItems } = select('abt/data');
        const {
            getSelectedItems,
            getSidebarSortMode,
            getSidebarSortOrder,
        } = select('abt/ui');
        let uncitedItems = _.sortBy(getUncitedItems(), item => {
            switch (getSidebarSortMode()) {
                case 'date':
                    const date = _.get(item.issued, '[date-parts][0]', []);
                    if (date.length === 0) {
                        return 0;
                    }
                    return new Date(date[0], date[1], date[2]).toJSON();
                case 'publication':
                    return (
                        item.journalAbbreviation ||
                        item['container-title-short'] ||
                        item['container-title'] ||
                        item.publisher ||
                        'zzzzzzzzzzz'
                    );
                case 'title':
                default:
                    return item.title || 'zzzzzzzzzzz';
            }
        });
        if (getSidebarSortOrder() === 'desc') {
            uncitedItems = [...uncitedItems.reverse()];
        }
        return {
            uncitedItems,
            citedItems: getCitedItems(),
            selectedItems: getSelectedItems(),
            isTyping: select<boolean>('core/editor').isTyping(),
        };
    }),
    withDispatch<DispatchProps>(dispatch => ({
        parseCitations() {
            dispatch('abt/data').parseCitations();
        },
    })),
])(Sidebar);
