import { _x } from '@wordpress/i18n';
import _ from 'lodash';

export abstract class CSLDate {
    static getYear(date?: CSL.Date): string | number {
        if (date && date.raw) {
            return new Date(date.raw).getUTCFullYear();
        }
        return _.get(
            date,
            '[date-parts][0][0]',
            _x(
                'n.d.',
                'Abbreviation for "no date"',
                'academic-bloggers-toolkit',
            ),
        );
    }
}

export abstract class CSLPerson {
    static getNames(people: CSL.Person[], count?: number): string {
        return (
            people
                .slice(0, count)
                .map(({ family, given, literal }) => {
                    if (literal) {
                        return literal;
                    }
                    if (family) {
                        return `${family} ${given ? given[0] : ''}`.trim();
                    }
                    return '';
                })
                .filter(Boolean)
                .join(', ') + '.'
        );
    }
}
