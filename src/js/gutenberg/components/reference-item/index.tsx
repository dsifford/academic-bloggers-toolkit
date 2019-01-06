import { _x } from '@wordpress/i18n';

import { date, person } from 'utils/data';

import styles from './style.scss';

export default function ReferenceItem(item: CSL.Data) {
    return (
        <>
            <strong>{item.title}</strong>
            {item.author && item.author.length > 0 && (
                <div className={styles.authors}>
                    {person.getNames(item.author, 3)}
                </div>
            )}
            <div>
                <i>{getPublicationName(item)}</i>
                <span>{date.getYear(item.issued)}</span>
            </div>
        </>
    );
}

function getPublicationName(item: CSL.Data): string {
    return (
        item.journalAbbreviation ||
        item['container-title-short'] ||
        item['container-title'] ||
        item.publisher ||
        _x(
            'n.p.',
            'Abbreviation for "no publisher"',
            'academic-bloggers-toolkit',
        )
    );
}
