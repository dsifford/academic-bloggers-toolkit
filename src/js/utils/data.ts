import _ from 'lodash';

type Widen<T> = T extends string ? string : T extends number ? number : T;

export function firstTruthyValue<T extends Record<string, any>, U>(
    obj: T,
    paths: string[],
    fallback?: Widen<U>,
): Widen<U> | undefined {
    for (const path of paths) {
        const val = _.get(obj, path);
        if (val) {
            return val;
        }
    }
    return fallback;
}

export function clone<T>(data: T): T {
    if (data === undefined) {
        return data;
    }
    return JSON.parse(JSON.stringify(data));
}

export function swapWith<T>(arr: T[], a: number, b: number): T[] {
    const list = [...arr];
    const item = list.splice(a, 1);
    return [...list.slice(0, b), ...item, ...list.slice(b)];
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
