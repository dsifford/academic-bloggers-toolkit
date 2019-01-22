import { _x } from '@wordpress/i18n';

import { CSLDate, CSLPerson } from 'utils/csl';
import { firstTruthyValue } from 'utils/data';

import styles from './style.scss';

export default function ReferenceItem(item: CSL.Data) {
    return (
        <>
            <strong>{item.title}</strong>
            {item.author && item.author.length > 0 && (
                <div className={styles.authors}>
                    {CSLPerson.getNames(item.author, 3)}
                </div>
            )}
            <div>
                <i>
                    {firstTruthyValue(
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
                    )}
                </i>
                <span>{CSLDate.getYear(item.issued)}</span>
            </div>
        </>
    );
}
