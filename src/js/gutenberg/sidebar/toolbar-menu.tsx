import {
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

import styles from './toolbar-menu.scss';

interface DispatchProps {
    refreshCitations(): void;
    removeAllCitations(): void;
    setSortMode(mode: 'date' | 'publication' | 'title'): void;
    setSortOrder(order: 'asc' | 'desc'): void;
}

interface SelectProps {
    sortMode: 'date' | 'publication' | 'title';
    sortOrder: 'asc' | 'desc';
}

type Props = DispatchProps & SelectProps;

const ToolbarMenu = ({
    refreshCitations,
    removeAllCitations,
    setSortMode,
    setSortOrder,
    sortMode,
    sortOrder,
}: Props) => (
    <Dropdown
        contentClassName={styles.dropdown}
        renderToggle={({ onToggle }) => (
            <IconButton
                icon="ellipsis"
                label="More options"
                className={styles.moreIcon}
                onClick={onToggle}
            />
        )}
        renderContent={({ onClose }) => (
            <NavigableMenu className={styles.menu}>
                <MenuItem
                    icon="trash"
                    onClick={() => {
                        removeAllCitations();
                        onClose();
                    }}
                >
                    Remove all citations
                </MenuItem>
                <MenuItem
                    icon="update"
                    onClick={() => {
                        refreshCitations();
                        onClose();
                    }}
                >
                    Refresh all citations
                </MenuItem>
                <Separator />
                <MenuGroup
                    label="Sort uncited by"
                    className={styles.sortChoices}
                >
                    <MenuItemsChoice
                        value={sortMode}
                        choices={[
                            {
                                label: 'Date',
                                value: 'date',
                            },
                            {
                                label: 'Publication',
                                value: 'publication',
                            },
                            {
                                label: 'Title',
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
                <MenuGroup label="Sort order" className={styles.sortChoices}>
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
                        Usage instructions
                    </ExternalLink>
                </MenuItem>
            </NavigableMenu>
        )}
    />
);

const Separator = () => <hr className={styles.separator} />;

export default compose([
    withDispatch<DispatchProps, SelectProps>((dispatch, ownProps) => {
        return {
            refreshCitations() {
                dispatch('abt/data').parseCitations();
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
    }),
    withSelect<SelectProps>(select => ({
        sortMode: select('abt/ui').getSidebarSortMode(),
        sortOrder: select('abt/ui').getSidebarSortOrder(),
    })),
])(ToolbarMenu);
