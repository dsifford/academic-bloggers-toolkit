import { getNames, getYear } from 'utils/data';

import styles from './style.scss';

interface Props {
    item: CSL.Data;
    isSelected?: boolean;
    children?: never;
    onClick(itemId: string): void;
    onDoubleClick(itemId: string): void;
}

const SidebarItem = ({ item, isSelected, onDoubleClick, onClick }: Props) => {
    const publication =
        item.journalAbbreviation ||
        item['container-title-short'] ||
        item['container-title'] ||
        item.publisher ||
        '';
    return (
        <div
            className={styles.item}
            role="option"
            aria-selected={isSelected}
            onClick={() => onClick(item.id)}
            onDoubleClick={() => onDoubleClick(item.id)}
        >
            <strong>{item.title}</strong>
            {item.author && item.author.length > 0 && (
                <div className={styles.authors}>{getNames(item.author, 3)}</div>
            )}
            <div>
                {publication && <i>{publication}</i>},{' '}
                <span>{getYear(item.issued)}</span>
            </div>
        </div>
    );
};

export default SidebarItem;
