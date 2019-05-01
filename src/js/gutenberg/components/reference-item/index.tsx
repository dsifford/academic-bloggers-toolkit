import { useMemo } from '@wordpress/element';
import { _x } from '@wordpress/i18n';
import DOMPurify from 'dompurify';

import { CSLDate, CSLPerson } from 'utils/csl';
import { firstTruthyValue } from 'utils/data';

import styles from './style.scss';

interface Props {
    item: CSL.Data;
}

export default function ReferenceItem({ item }: Props) {
    const title = useMemo(
        () => ({ __html: DOMPurify.sanitize(item.title || '') }),
        [item.title],
    );
    const authors = useMemo(() => CSLPerson.getNames(item.author, 3), [
        item.author,
    ]);
    const publication = useMemo(
        () =>
            firstTruthyValue(
                item,
                [
                    'journalAbbreviation',
                    'container-title-short',
                    'container-title',
                    'publisher',
                ],
                _x(
                    'n.p.',
                    'Abbreviation for "no publisher"',
                    'academic-bloggers-toolkit',
                ),
            ),
        [
            item.journalAbbreviation,
            item['container-title-short'],
            item['container-title'],
            item.publisher,
        ],
    );
    const year = useMemo(() => CSLDate.getYear(item.issued), [item.issued]);
    return (
        <>
            <strong dangerouslySetInnerHTML={title} />
            {authors && <div className={styles.authors}>{authors}</div>}
            <div className={styles.meta}>
                <i>{publication}</i>
                <span>({year})</span>
            </div>
        </>
    );
}
