import { compose } from '@wordpress/compose';
import { withDispatch } from '@wordpress/data';
import { Component, ComponentType } from '@wordpress/element';

import SidebarItem from 'gutenberg/components/sidebar-item';
import EditReferenceDialog from 'gutenberg/dialogs/edit-reference';

import styles from './style.scss';

interface DispatchProps {
    toggleItemSelected(id: string): void;
    updateReference(data: CSL.Data): void;
}

interface OwnProps {
    items: ReadonlyArray<CSL.Data>;
    selectedItems: ReadonlyArray<string>;
}

type Props = DispatchProps & OwnProps;

interface State {
    editReferenceId: string;
}

class SidebarItemList extends Component<Props, State> {
    state: State = {
        editReferenceId: '',
    };
    render() {
        const {
            items,
            selectedItems,
            toggleItemSelected,
            updateReference,
        } = this.props;
        const { editReferenceId } = this.state;
        const onClose = () => this.setState({ editReferenceId: '' });
        return (
            <>
                <EditReferenceDialog
                    isOpen={!!editReferenceId}
                    itemId={editReferenceId}
                    onClose={onClose}
                    onSubmit={data => {
                        updateReference(data);
                        onClose();
                    }}
                />
                <div
                    className={styles.list}
                    role="listbox"
                    aria-multiselectable={true}
                >
                    {items.map(item => (
                        <SidebarItem
                            key={item.id}
                            isSelected={selectedItems.includes(item.id)}
                            item={item}
                            onClick={id => toggleItemSelected(id)}
                            onDoubleClick={id =>
                                this.setState({ editReferenceId: id })
                            }
                        />
                    ))}
                </div>
            </>
        );
    }
}

export default compose([
    withDispatch<DispatchProps, OwnProps>(dispatch => ({
        toggleItemSelected(id: string) {
            dispatch('abt/ui').toggleItemSelected(id);
        },
        updateReference(data: CSL.Data) {
            dispatch('abt/data').updateReference(data);
        },
    })),
])(SidebarItemList) as ComponentType<OwnProps>;
