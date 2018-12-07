import _ from 'lodash';

import styles from './sidebar-item.scss';

interface Props {
    item: CSL.Data;
    isSelected?: boolean;
    children?: never;
    onClick(itemId: string): void;
}

const SidebarItem = ({ item, isSelected, onClick }: Props) => {
    const publication =
        item.journalAbbreviation ||
        item['container-title-short'] ||
        item['container-title'] ||
        item.publisher ||
        '';
    const handleClick = () => onClick(item.id);
    return (
        <div
            className={styles.item}
            role="option"
            aria-selected={isSelected}
            onClick={handleClick}
        >
            <strong>{item.title}</strong>
            {item.author && item.author.length > 0 && (
                <div className={styles.authors}>
                    {item.author
                        .slice(0, 3)
                        .map(
                            author =>
                                `${author.family} ${
                                    author.given ? author.given[0] : ''
                                }`,
                        )
                        .join(', ') + '.'}
                </div>
            )}
            <div>
                {publication && <i>{publication}</i>},{' '}
                <span>{_.get(item.issued, '[date-parts][0][0]', 'n.d.')}</span>
            </div>
        </div>
    );
};

export default SidebarItem;
