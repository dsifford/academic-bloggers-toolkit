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
import { __ } from '@wordpress/i18n';

import styles from './toolbar-menu.scss';

interface DispatchProps {
    refreshItems(): void;
    removeAllCitations(): void;
    setSortMode(mode: 'date' | 'publication' | 'title'): void;
    setSortOrder(order: 'asc' | 'desc'): void;
}

interface SelectProps {
    sortMode: 'date' | 'publication' | 'title';
    sortOrder: 'asc' | 'desc';
}

type Props = DispatchProps & SelectProps;

const Separator = () => <hr className={styles.separator} />;

const { Slot: ToolbarMenuItemSlot, Fill: ToolbarMenuItemFill } = createSlotFill(
    'abt-toolbar-menu-item',
);

export const ToolbarMenuItem = (props: MenuItem.Props) => (
    <ToolbarMenuItemFill>
        <MenuItem {...props} />
    </ToolbarMenuItemFill>
);

function ToolbarMenu({
    refreshItems,
    removeAllCitations,
    setSortMode,
    setSortOrder,
    sortMode,
    sortOrder,
}: Props) {
    return (
        <Dropdown
            contentClassName={styles.dropdown}
            renderToggle={({ onToggle }) => (
                <IconButton
                    icon="ellipsis"
                    label={
                        // translators: Button label telling users that clicking shows additional options.
                        __('More options', 'academic-bloggers-toolkit')
                    }
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
                            {__(
                                'Refresh all items',
                                'academic-bloggers-toolkit',
                            )}
                        </MenuItem>
                        <ToolbarMenuItemSlot />
                    </section>
                    <Separator />
                    <MenuGroup
                        label={
                            // translators: Form label.
                            __('Sort uncited by', 'academic-bloggers-toolkit')
                        }
                        className={styles.sortChoices}
                    >
                        <MenuItemsChoice
                            value={sortMode}
                            choices={[
                                {
                                    label:
                                        // translators: Button label for sorting by date.
                                        __('Date', 'academic-bloggers-toolkit'),
                                    value: 'date',
                                },
                                {
                                    label:
                                        // translators: Button label for sorting by publication.
                                        __(
                                            'Publication',
                                            'academic-bloggers-toolkit',
                                        ),
                                    value: 'publication',
                                },
                                {
                                    label:
                                        // translators: Button label for sorting by title.
                                        __(
                                            'Title',
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
                        label={
                            // translators: Form label.
                            __('Sort order', 'academic-bloggers-toolkit')
                        }
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
                            {// translators: Link that goes to usage instructions.
                            __(
                                'Usage instructions',
                                'academic-bloggers-toolkit',
                            )}
                        </ExternalLink>
                    </MenuItem>
                </NavigableMenu>
            )}
        />
    );
}

export default compose(
    withDispatch<DispatchProps, {}, SelectProps>(
        (dispatch, { sortMode, sortOrder }) => {
            return {
                refreshItems() {
                    dispatch('abt/data').parseCitations();
                    dispatch('abt/data').parseFootnotes();
                },
                removeAllCitations() {
                    dispatch('abt/data').removeAllCitations();
                },
                setSortMode(mode) {
                    if (mode !== sortMode) {
                        dispatch('abt/ui').setSidebarSortMode(mode);
                    }
                },
                setSortOrder(order) {
                    if (order !== sortOrder) {
                        dispatch('abt/ui').setSidebarSortOrder(order);
                    }
                },
            };
        },
    ),
    withSelect<SelectProps, Props>(select => ({
        sortMode: select('abt/ui').getSidebarSortMode(),
        sortOrder: select('abt/ui').getSidebarSortOrder(),
    })),
)(ToolbarMenu);
