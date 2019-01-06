import { ReactNode } from '@wordpress/element';

import styles from './style.scss';

namespace SidebarItemList {
    export interface Props<T> {
        items: ReadonlyArray<T>;
        selectedItems?: ReadonlyArray<string>;
        renderItem(item: Partial<T>): ReactNode;
        onItemClick?(id: string): void;
        onItemDoubleClick?(id: string): void;
    }
}

function SidebarItemList<T extends { id: string }>({
    items,
    onItemClick,
    onItemDoubleClick,
    renderItem,
    selectedItems = [],
}: SidebarItemList.Props<T>) {
    return (
        <div className={styles.list} role="listbox" aria-multiselectable={true}>
            {items.map(item => (
                <div
                    key={item.id}
                    className={styles.item}
                    role="option"
                    aria-selected={selectedItems.includes(item.id)}
                    onClick={() => onItemClick && onItemClick(item.id)}
                    onDoubleClick={() =>
                        onItemDoubleClick && onItemDoubleClick(item.id)
                    }
                >
                    {renderItem(item)}
                </div>
            ))}
        </div>
    );
}

export default SidebarItemList;
