import { compose } from '@wordpress/compose';
import { withDispatch } from '@wordpress/data';

import SidebarItem from './sidebar-item';
import styles from './sidebar-item-list.scss';

interface DispatchProps {
    toggleItemSelected(id: string): void;
}

interface OwnProps {
    items: ReadonlyArray<CSL.Data>;
    selectedItems: ReadonlyArray<string>;
}

type Props = DispatchProps & OwnProps;

const SidebarItemList = ({
    items,
    selectedItems,
    toggleItemSelected,
}: Props) => (
    <div className={styles.list} role="listbox" aria-multiselectable={true}>
        {items.map(item => (
            <SidebarItem
                key={item.id}
                isSelected={selectedItems.includes(item.id)}
                item={item}
                onClick={id => toggleItemSelected(id)}
            />
        ))}
    </div>
);

export default compose([
    withDispatch<DispatchProps>(dispatch => ({
        toggleItemSelected(id: string) {
            dispatch('abt/ui').toggleItemSelected(id);
        },
    })),
])(SidebarItemList);
