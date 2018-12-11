import {
    createSlotFill,
    IconButton,
    IconButtonProps,
    PanelBody,
    PanelRow,
} from '@wordpress/components';

import AddReferenceDialog from '../dialogs/add-reference';
import ImportDialog from '../dialogs/import';

import ToolbarMenu from './toolbar-menu';
import styles from './toolbar.scss';

const { Slot, Fill } = createSlotFill('abt-toolbar-buttons');

const RemoveIcon = () => (
    <svg viewBox="0 0 20 20" width={20} height={20}>
        <path
            d={`M10 1c-5 0-9 4-9 9s4 9 9 9 9-4
            9-9-4-9-9-9zm0 16c-3.9 0-7-3.1-7-7s3.1-7
            7-7 7 3.1 7 7-3.1 7-7 7zM6 9v2h8V9H6z`}
        />
    </svg>
);

const Toolbar = () => (
    <PanelBody opened={true} className={styles.container}>
        <PanelRow>
            <Slot />
            <AddReferenceDialog />
            <IconButton
                icon={<RemoveIcon />}
                label="Remove selected References"
            />
            <ImportDialog />
            <ToolbarMenu />
        </PanelRow>
    </PanelBody>
);

const ToolbarButton = (props: IconButtonProps) => (
    <Fill>
        <IconButton {...props} />
    </Fill>
);

export { ToolbarButton };
export default Toolbar;
