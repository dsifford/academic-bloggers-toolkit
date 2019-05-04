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
    onItemClick = () => void 0,
    onItemDoubleClick = () => void 0,
    selectedItems = [],
    renderItem,
}: Props<T>) {
    return (
        <div aria-multiselectable={true} className={styles.list} role="listbox">
            {items.map(item => (
                <div
                    key={item.id}
                    aria-selected={selectedItems.includes(item.id)}
                    className={styles.item}
                    role="option"
                    tabIndex={0}
                    onClick={() => onItemClick(item.id)}
                    onDoubleClick={() => onItemDoubleClick(item.id)}
                    onKeyDown={e => {
                        switch (e.key) {
                            case ' ':
                                return onItemClick(item.id);
                            case 'Enter':
                                return onItemDoubleClick(item.id);
                        }
                    }}
                >
                    {renderItem(item)}
                </div>
            ))}
        </div>
    );
}
