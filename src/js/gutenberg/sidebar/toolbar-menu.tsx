import {
    Dropdown,
    IconButton,
    MenuItem,
    NavigableMenu,
} from '@wordpress/components';

import styles from './toolbar.scss';

const ToolbarMenu = () => (
    <Dropdown
        renderToggle={({ onToggle }) => (
            <IconButton
                icon="ellipsis"
                label="More options"
                className={styles.moreIcon}
                onClick={onToggle}
            />
        )}
        renderContent={() => (
            <NavigableMenu>
                <MenuItem icon="trash">Thing 1</MenuItem>
                <MenuItem icon="carrot">Thing 2</MenuItem>
                <MenuItem icon="lightbulb">Thing 3</MenuItem>
            </NavigableMenu>
        )}
    />
);

export default ToolbarMenu;
