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
import { __, _x } from '@wordpress/i18n';

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
                <MenuItem
                    icon="trash"
                    onClick={() => {
                        removeAllCitations();
                        onClose();
                    }}
                >
                    {__('Remove all citations', 'academic-bloggers-toolkit')}
                </MenuItem>
                <MenuItem
                    icon="update"
                    onClick={() => {
                        refreshCitations();
                        onClose();
                    }}
                >
                    {__('Refresh all citations', 'academic-bloggers-toolkit')}
                </MenuItem>
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
