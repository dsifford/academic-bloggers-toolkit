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
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import styles from './toolbar-menu.scss';

const Separator = () => <hr className={styles.separator} />;

const { Slot: ToolbarMenuItemSlot, Fill: ToolbarMenuItemFill } = createSlotFill(
    'abt-toolbar-menu-item',
);

export const ToolbarMenuItem = (props: MenuItem.Props) => (
    <ToolbarMenuItemFill>
        <MenuItem {...props} />
    </ToolbarMenuItemFill>
);

export default function ToolbarMenu() {
    const { parseCitations, parseFootnotes, removeAllCitations } = useDispatch(
        'abt/data',
    );
    const { setSidebarSortMode, setSidebarSortOrder } = useDispatch('abt/ui');

    const { sortMode, sortOrder } = useSelect(select => ({
        sortMode: select('abt/ui').getSidebarSortMode(),
        sortOrder: select('abt/ui').getSidebarSortOrder(),
    }));

    const refreshItems = () => {
        parseCitations();
        parseFootnotes();
    };

    const setSortMode = (mode: 'date' | 'publication' | 'title') => {
        if (mode !== sortMode) {
            setSidebarSortMode(mode);
        }
    };

    const setSortOrder = (order: 'asc' | 'desc') => {
        if (order !== sortOrder) {
            setSidebarSortOrder(order);
        }
    };

    return (
        <Dropdown
            contentClassName={styles.dropdown}
            renderContent={({ onClose }) => (
                <NavigableMenu className={styles.menu}>
                    <section role="list" onClickCapture={onClose}>
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
                        className={styles.sortChoices}
                        label={
                            // translators: Form label.
                            __('Sort uncited by', 'academic-bloggers-toolkit')
                        }
                    >
                        <MenuItemsChoice
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
                            value={sortMode}
                            onSelect={value =>
                                setSortMode(value as
                                    | 'date'
                                    | 'publication'
                                    | 'title')
                            }
                        />
                    </MenuGroup>
                    <MenuGroup
                        className={styles.sortChoices}
                        label={
                            // translators: Form label.
                            __('Sort order', 'academic-bloggers-toolkit')
                        }
                    >
                        <MenuItemsChoice
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
                            value={sortOrder}
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
            renderToggle={({ onToggle }) => (
                <IconButton
                    className={styles.moreIcon}
                    icon="ellipsis"
                    label={
                        // translators: Button label telling users that clicking shows additional options.
                        __('More options', 'academic-bloggers-toolkit')
                    }
                    onClick={onToggle}
                />
            )}
        />
    );
}
