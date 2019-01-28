import {
    createSlotFill,
    Dropdown,
    ExternalLink,
    IconButton,
    MenuGroup,
    MenuItem,
    MenuItemsChoice,
    NavigableMenu,
} from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';
import { ComponentType } from '@wordpress/element';
import { __, _x } from '@wordpress/i18n';

import styles from './toolbar-menu.scss';

const { Slot: ToolbarMenuItemSlot, Fill: ToolbarMenuItemFill } = createSlotFill(
    'abt-toolbar-menu-item',
);

const Separator = () => <hr className={styles.separator} />;

export const ToolbarMenuItem = (props: MenuItem.Props) => (
    <ToolbarMenuItemFill>
        <MenuItem {...props} />
    </ToolbarMenuItemFill>
);

namespace ToolbarMenu {
    export interface DispatchProps {
        refreshItems(): void;
        removeAllCitations(): void;
        setSortMode(mode: 'date' | 'publication' | 'title'): void;
        setSortOrder(order: 'asc' | 'desc'): void;
    }

    export interface SelectProps {
        sortMode: 'date' | 'publication' | 'title';
        sortOrder: 'asc' | 'desc';
    }

    export type Props = DispatchProps & SelectProps;
}
const ToolbarMenu = ({
    refreshItems,
    removeAllCitations,
    setSortMode,
    setSortOrder,
    sortMode,
    sortOrder,
}: ToolbarMenu.Props) => (
    <Dropdown
        contentClassName={styles.dropdown}
        renderToggle={({ onToggle }) => (
            <IconButton
                icon="ellipsis"
                label={_x(
                    'More options',
                    'Button label telling users that clicking shows additional options',
                    'academic-bloggers-toolkit',
                )}
                className={styles.moreIcon}
                onClick={onToggle}
            />
        )}
        renderContent={({ onClose }) => (
            <NavigableMenu className={styles.menu}>
                <section role="list" onClick={() => onClose()}>
                    <MenuItem icon="trash" onClick={removeAllCitations}>
                        {__(
                            'Remove all citations',
                            'academic-bloggers-toolkit',
                        )}
                    </MenuItem>
                    <MenuItem icon="update" onClick={refreshItems}>
                        {__('Refresh all items', 'academic-bloggers-toolkit')}
                    </MenuItem>
                    <ToolbarMenuItemSlot />
                </section>
                <Separator />
                <MenuGroup
                    label={_x(
                        'Sort uncited by',
                        'Form label',
                        'academic-bloggers-toolkit',
                    )}
                    className={styles.sortChoices}
                >
                    <MenuItemsChoice
                        value={sortMode}
                        choices={[
                            {
                                label: _x(
                                    'Date',
                                    'Button label for sorting by date',
                                    'academic-bloggers-toolkit',
                                ),
                                value: 'date',
                            },
                            {
                                label: _x(
                                    'Publication',
                                    'Button label for sorting by publication',
                                    'academic-bloggers-toolkit',
                                ),
                                value: 'publication',
                            },
                            {
                                label: _x(
                                    'Title',
                                    'Button label for sorting by title',
                                    'academic-bloggers-toolkit',
                                ),
                                value: 'title',
                            },
                        ]}
                        onSelect={value =>
                            setSortMode(value as
                                | 'date'
                                | 'publication'
                                | 'title')
                        }
                    />
                </MenuGroup>
                <MenuGroup
                    label={_x(
                        'Sort order',
                        'Form label',
                        'academic-bloggers-toolkit',
                    )}
                    className={styles.sortChoices}
                >
                    <MenuItemsChoice
                        value={sortOrder}
                        choices={[
                            {
                                label: 'Ascending',
                                value: 'asc',
                            },
                            {
                                label: 'Descending',
                                value: 'desc',
                            },
                        ]}
                        onSelect={order =>
                            setSortOrder(order as 'asc' | 'desc')
                        }
                    />
                </MenuGroup>
                <Separator />
                <MenuItem icon="editor-help">
                    <ExternalLink href="https://github.com/dsifford/academic-bloggers-toolkit/wiki">
                        {_x(
                            'Usage instructions',
                            'Link that goes to usage instructions',
                            'academic-bloggers-toolkit',
                        )}
                    </ExternalLink>
                </MenuItem>
            </NavigableMenu>
        )}
    />
);

export default compose([
    withDispatch<ToolbarMenu.DispatchProps, ToolbarMenu.SelectProps>(
        (dispatch, ownProps) => {
            return {
                refreshItems() {
                    dispatch('abt/data').parseCitations();
                    dispatch('abt/data').parseFootnotes();
                },
                removeAllCitations() {
                    dispatch('abt/data').removeAllCitations();
                },
                setSortMode(mode) {
                    if (mode !== ownProps.sortMode) {
                        dispatch('abt/ui').setSidebarSortMode(mode);
                    }
                },
                setSortOrder(order) {
                    if (order !== ownProps.sortOrder) {
                        dispatch('abt/ui').setSidebarSortOrder(order);
                    }
                },
            };
        },
    ),
    withSelect<ToolbarMenu.SelectProps>(select => ({
        sortMode: select('abt/ui').getSidebarSortMode(),
        sortOrder: select('abt/ui').getSidebarSortOrder(),
    })),
])(ToolbarMenu) as ComponentType;
