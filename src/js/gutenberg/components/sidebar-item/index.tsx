import { date, person } from 'utils/data';

import styles from './style.scss';

namespace SidebarItem {
    export interface Props {
        item: CSL.Data;
        isSelected?: boolean;
        children?: never;
        onClick?(itemId: string): void;
        onDoubleClick?(itemId: string): void;
    }
}

const SidebarItem = ({
    isSelected,
    item,
    onClick,
    onDoubleClick,
}: SidebarItem.Props) => {
    const publication =
        item.journalAbbreviation ||
        item['container-title-short'] ||
        item['container-title'] ||
        item.publisher ||
        'n.p.';
    return (
        <div
            className={styles.item}
            role="option"
            aria-selected={isSelected}
            onClick={() => onClick && onClick(item.id)}
            onDoubleClick={() => onDoubleClick && onDoubleClick(item.id)}
        >
            <strong>{item.title}</strong>
            {item.author && item.author.length > 0 && (
                <div className={styles.authors}>
                    {person.getNames(item.author, 3)}
                </div>
            )}
            <div>
                {publication && <i>{publication}</i>},{' '}
                <span>{date.getYear(item.issued)}</span>
            </div>
        </div>
    );
};

export default SidebarItem;
