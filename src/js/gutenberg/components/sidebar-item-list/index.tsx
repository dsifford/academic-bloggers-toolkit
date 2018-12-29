import SidebarItem from 'gutenberg/components/sidebar-item';

import styles from './style.scss';

namespace SidebarItemList {
    export interface Props {
        items: ReadonlyArray<CSL.Data>;
        selectedItems?: ReadonlyArray<string>;
        onItemClick?(id: string): void;
        onItemDoubleClick?(id: string): void;
    }
}

const SidebarItemList = ({
    items,
    onItemClick,
    onItemDoubleClick,
    selectedItems = [],
}: SidebarItemList.Props) => (
    <div className={styles.list} role="listbox" aria-multiselectable={true}>
        {items.map(item => (
            <SidebarItem
                key={item.id}
                isSelected={selectedItems.includes(item.id)}
                item={item}
                onClick={onItemClick}
                onDoubleClick={onItemDoubleClick}
            />
        ))}
    </div>
);

export default SidebarItemList;
