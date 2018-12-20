import _ from 'lodash';

export function clone<T>(data: T): T {
    if (data === undefined) {
        return data;
    }
    return JSON.parse(JSON.stringify(data));
}

export function getYear(date?: CSL.Date): number | string {
    if (!date) {
        return 'n.d.';
    } else if (date.raw) {
        return new Date(date.raw).getUTCFullYear();
    }
    return _.get(date, '[date-parts][0][0]', 'n.d.');
}

export function getNames(people: CSL.Person[], count: number): string {
    return (
        people
            .slice(0, count)
            .map(person => {
                const { literal, family, given } = person;
                if (literal) {
                    return literal;
                } else if (family) {
                    return `${family} ${given ? given[0] : ''}`.trim();
                }
                return '';
            })
            .filter(Boolean)
            .join(', ') + '.'
    );
}
