import { ReactNode } from '@wordpress/element';

import styles from './style.scss';

interface HasID {
    id: string;
}

interface Props<T> {
    items: readonly T[];
    selectedItems?: readonly string[];
    renderItem(item: T): ReactNode;
    onItemClick?(id: string): void;
    onItemDoubleClick?(id: string): void;
}

export default function SidebarItemList<T extends HasID>({
    items,
    onItemClick,
    onItemDoubleClick,
    selectedItems = [],
    renderItem,
}: Props<T>) {
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
