import _ from 'lodash';

export function clone<T>(data: T): T {
    if (data === undefined) {
        return data;
    }
    return JSON.parse(JSON.stringify(data));
}

export namespace date {
    export function getYear(d?: CSL.Date): number | string {
        if (!d) {
            return 'n.d.';
        } else if (d.raw) {
            return new Date(d.raw).getUTCFullYear();
        }
        return _.get(d, '[date-parts][0][0]', 'n.d.');
    }
}

export namespace person {
    export function getNames(people: CSL.Person[], count: number): string {
        return (
            people
                .slice(0, count)
                .map(({ family, given, literal }) => {
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
}
