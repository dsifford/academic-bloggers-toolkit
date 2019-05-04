import { _x } from '@wordpress/i18n';
import { get } from 'lodash';

export const CSLDate = {
    getYear(date?: CSL.Date): string | number {
        if (date && date.raw) {
            return new Date(date.raw).getUTCFullYear();
        }
        return get(
            date,
            '[date-parts][0][0]',
            _x(
                'n.d.',
                'Abbreviation for "no date"',
                'academic-bloggers-toolkit',
            ),
        );
    },
    raw2parts(date: string): CSL.Date {
        const [year, month, day] = date.split('/');
        return {
            'date-parts': [[year, month, day]],
        };
    },
    date2raw(date?: CSL.Date): string {
        if (date && date.raw) {
            return date.raw;
        } else if (date && date['date-parts']) {
            return date['date-parts'][0].filter(d => d !== undefined).join('/');
        }
        return '';
    },
};

export const CSLPerson = {
    getNames(people: CSL.Person[] = [], count?: number): string {
        const names = people
            .slice(0, count)
            .map(({ family = '', given = '', literal = '' }) => {
                if (family) {
                    return `${family} ${given.slice(0, 1)}`.trim();
                }
                return literal;
            })
            .filter(Boolean)
            .join(', ');
        return names ? `${names}.` : '';
    },
};
