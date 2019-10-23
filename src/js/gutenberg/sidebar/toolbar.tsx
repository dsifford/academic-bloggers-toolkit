import {
    createSlotFill,
    FormFileUpload,
    IconButton,
    PanelBody,
    PanelRow,
} from '@wordpress/components';
import { withDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import RemoveIcon from 'components/icons/remove';
import AddReferenceDialog from 'gutenberg/dialogs/add-reference';
import StyleDialog from 'gutenberg/dialogs/update-style';
import { readReferencesFile } from 'utils/file';

import ToolbarMenu from './toolbar-menu';
import styles from './toolbar.scss';

interface DispatchProps {
    addItems(data: CSL.Data[]): void;
    removeSelectedItems(): void;
    createErrorNotice(message: string): void;
}

interface OwnProps {
    selectedItems: readonly string[];
}

type Props = DispatchProps & OwnProps;

const { Slot: ToolbarButtonSlot, Fill: ToolbarButtonFill } = createSlotFill(
    'abt-toolbar-buttons',
);

export const ToolbarButton = (props: IconButton.Props) => (
    <ToolbarButtonFill>
        <IconButton {...props} />
    </ToolbarButtonFill>
);

function Toolbar({
    addItems,
    removeSelectedItems,
    selectedItems,
    ...props
}: Props) {
    return (
        <>
            <StyleDialog />
            <PanelBody className={styles.container} opened={true}>
                <PanelRow>
                    <ToolbarButtonSlot />
                    <AddReferenceDialog />
                    <IconButton
                        disabled={selectedItems.length === 0}
                        icon={<RemoveIcon />}
                        label={__(
                            'Remove selected items',
                            'academic-bloggers-toolkit',
                        )}
                        onClick={() => removeSelectedItems()}
                    />
                    <FormFileUpload
                        accept={[
                            '.ris',
                            '.bib',
                            '.bibtex',
                            'application/xresearch-info-systems',
                            'application/x-bibtex',
                        ].join()}
                        icon="welcome-add-page"
                        label={__(
                            'Import references',
                            'academic-bloggers-toolkit',
                        )}
                        onChange={async e => {
                            const inputEl = e.currentTarget;
                            const { files } = inputEl;
                            if (!files || files.length === 0) {
                                return;
                            }
                            if (files && files[0]) {
                                try {
                                    addItems(
                                        await readReferencesFile(files[0]),
                                    );
                                } catch {
                                    props.createErrorNotice(
                                        __(
                                            'Invalid import file type. File must be a valid BibTeX or RIS file.',
                                            'academic-bloggers-toolkit',
                                        ),
                                    );
                                } finally {
                                    inputEl.value = '';
                                }
                            }
                        }}
                    />
                    <ToolbarMenu />
                </PanelRow>
            </PanelBody>
        </>
    );
}

export default withDispatch<DispatchProps, OwnProps>(
    (dispatch, { selectedItems }) => ({
        addItems(data) {
            dispatch('abt/data').addReferences(data);
        },
        createErrorNotice(message) {
            dispatch('core/notices').createErrorNotice(message, {
                type: 'snackbar',
            });
        },
        removeSelectedItems() {
            dispatch('abt/data').removeReferences([...selectedItems]);
            dispatch('abt/data').removeFootnotes([...selectedItems]);
            dispatch('abt/ui').clearSelectedItems();
        },
    }),
)(Toolbar);
