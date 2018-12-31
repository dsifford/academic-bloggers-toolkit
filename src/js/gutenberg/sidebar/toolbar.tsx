import {
    createSlotFill,
    FormFileUpload,
    IconButton,
    PanelBody,
    PanelRow,
} from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { withDispatch } from '@wordpress/data';
import { Component, FormEvent } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import RemoveIcon from 'gutenberg/components/icons/remove';
import AddReferenceDialog from 'gutenberg/dialogs/add-reference';
import StyleDialog from 'gutenberg/dialogs/update-style';
import { readReferencesFile } from 'utils/file';

import ToolbarMenu from './toolbar-menu';
import styles from './toolbar.scss';

const { Slot: ToolbarButtonSlot, Fill: ToolbarButtonFill } = createSlotFill(
    'abt-toolbar-buttons',
);

export const ToolbarButton = (props: IconButton.Props) => (
    <ToolbarButtonFill>
        <IconButton {...props} />
    </ToolbarButtonFill>
);

namespace Toolbar {
    export interface DispatchProps {
        addItems(data: CSL.Data[]): void;
        removeSelectedItems(): void;
        createErrorNotice(message: string): void;
    }
    export interface OwnProps {
        selectedItems: ReadonlyArray<string>;
    }
    export type Props = DispatchProps & OwnProps;
}

class Toolbar extends Component<Toolbar.Props> {
    render(): JSX.Element {
        const { removeSelectedItems, selectedItems } = this.props;
        return (
            <>
                <StyleDialog />
                <PanelBody opened={true} className={styles.container}>
                    <PanelRow>
                        <ToolbarButtonSlot />
                        <AddReferenceDialog />
                        <IconButton
                            icon={<RemoveIcon />}
                            label={__(
                                'Remove selected References',
                                'academic-bloggers-toolkit',
                            )}
                            disabled={selectedItems.length === 0}
                            onClick={() => removeSelectedItems()}
                        />
                        <FormFileUpload
                            icon="welcome-add-page"
                            label={__(
                                'Import references',
                                'academic-bloggers-toolkit',
                            )}
                            accept={[
                                '.ris',
                                '.bib',
                                '.bibtex',
                                'application/xresearch-info-systems',
                                'application/x-bibtex',
                            ].join()}
                            onChange={this.handleFileUpload}
                        />
                        <ToolbarMenu />
                    </PanelRow>
                </PanelBody>
            </>
        );
    }
    private handleFileUpload = async (e: FormEvent<HTMLInputElement>) => {
        const target = e.currentTarget;
        const { files } = target;
        if (!files || files.length === 0) {
            return;
        }
        try {
            const data: CSL.Data[] = await readReferencesFile(files[0]);
            this.props.addItems(data);
        } catch (e) {
            this.props.createErrorNotice(
                __(
                    'Invalid import file type. File must be a valid BibTeX or RIS file.',
                    'academic-bloggers-toolkit',
                ),
            );
        }
        target.value = '';
    };
}

export default compose([
    withDispatch<Toolbar.DispatchProps, Toolbar.Props>(
        (dispatch, ownProps) => ({
            addItems(data) {
                dispatch('abt/data').addReferences(data);
            },
            createErrorNotice(message) {
                dispatch('core/notices').createErrorNotice(message);
            },
            removeSelectedItems() {
                dispatch('abt/data').removeReferences([
                    ...ownProps.selectedItems,
                ]);
                dispatch('abt/ui').clearSelectedItems();
            },
        }),
    ),
])(Toolbar);
