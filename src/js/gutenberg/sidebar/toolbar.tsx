import {
    createSlotFill,
    FormFileUpload,
    IconButton,
    PanelBody,
    PanelRow,
    withNotices,
} from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { withDispatch } from '@wordpress/data';
import { Component } from '@wordpress/element';
import { FormEvent, ReactNode } from 'react';

import AddReferenceDialog from 'gutenberg/dialogs/add-reference';
import { readReferencesFile } from 'utils/file';

import ToolbarMenu from './toolbar-menu';
import styles from './toolbar.scss';

const { Slot: ToolbarButtonSlot, Fill: ToolbarButtonFill } = createSlotFill(
    'abt-toolbar-buttons',
);
const { Slot: SidebarNoticeSlot, Fill: SidebarNoticeFill } = createSlotFill(
    'abt-sidebar-notices',
);

const RemoveIcon = () => (
    <svg viewBox="0 0 20 20" width={20} height={20}>
        <path
            d={`M10 1c-5 0-9 4-9 9s4 9 9 9 9-4
            9-9-4-9-9-9zm0 16c-3.9 0-7-3.1-7-7s3.1-7
            7-7 7 3.1 7 7-3.1 7-7 7zM6 9v2h8V9H6z`}
        />
    </svg>
);

export const SidebarNotice = ({ children }: { children: ReactNode }) => (
    <SidebarNoticeFill>{children}</SidebarNoticeFill>
);

export const ToolbarButton = (props: IconButton.Props) => (
    <ToolbarButtonFill>
        <IconButton {...props} />
    </ToolbarButtonFill>
);

interface DispatchProps {
    addItems(data: CSL.Data[]): void;
    removeSelectedItems(): void;
}

type Props = DispatchProps &
    withNotices.Props & {
        selectedItems: ReadonlyArray<string>;
    };

class Toolbar extends Component<Props> {
    render(): JSX.Element {
        const { removeSelectedItems, selectedItems, noticeUI } = this.props;
        return (
            <PanelBody opened={true} className={styles.container}>
                {noticeUI}
                <SidebarNoticeSlot />
                <PanelRow>
                    <ToolbarButtonSlot />
                    <AddReferenceDialog />
                    <IconButton
                        icon={<RemoveIcon />}
                        label="Remove selected References"
                        disabled={selectedItems.length === 0}
                        onClick={() => removeSelectedItems()}
                    />
                    <FormFileUpload
                        icon="welcome-add-page"
                        label="Import references"
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
            this.props.noticeOperations.createErrorNotice(
                'Invalid import file type. File must be a valid BibTeX or RIS file.',
            );
        }
        target.value = '';
    };
}

export default compose([
    withDispatch<DispatchProps, Props>((dispatch, ownProps) => ({
        addItems(data: CSL.Data[]) {
            dispatch('abt/data').addReferences(data);
        },
        removeSelectedItems() {
            dispatch('abt/data').removeReferences([...ownProps.selectedItems]);
            dispatch('abt/ui').clearSelectedItems();
        },
    })),
    withNotices,
])(Toolbar);
