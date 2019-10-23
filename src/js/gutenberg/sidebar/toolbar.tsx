import {
    createSlotFill,
    FormFileUpload,
    IconButton,
    PanelBody,
    PanelRow,
} from '@wordpress/components';
import { useCallback } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import RemoveIcon from 'components/icons/remove';
import AddReferenceDialog from 'gutenberg/dialogs/add-reference';
import StyleDialog from 'gutenberg/dialogs/update-style';
import { readReferencesFile } from 'utils/file';

import ToolbarMenu from './toolbar-menu';
import styles from './toolbar.scss';

interface Props {
    selectedItems: readonly string[];
}

const { Slot: ToolbarButtonSlot, Fill: ToolbarButtonFill } = createSlotFill(
    'abt-toolbar-buttons',
);

export const ToolbarButton = (props: IconButton.Props) => (
    <ToolbarButtonFill>
        <IconButton {...props} />
    </ToolbarButtonFill>
);

export default function Toolbar({ selectedItems }: Props) {
    const { addReferences, removeFootnotes, removeReferences } = useDispatch(
        'abt/data',
    );
    const { clearSelectedItems } = useDispatch('abt/ui');
    const { createErrorNotice } = useDispatch('core/notices');
    const removeSelectedItems = useCallback(() => {
        removeReferences([...selectedItems]);
        removeFootnotes([...selectedItems]);
        clearSelectedItems();
    }, [selectedItems]);
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
                                    addReferences(
                                        await readReferencesFile(files[0]),
                                    );
                                } catch {
                                    createErrorNotice(
                                        __(
                                            'Invalid import file type. File must be a valid BibTeX or RIS file.',
                                            'academic-bloggers-toolkit',
                                        ),
                                        { type: 'snackbar' },
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
