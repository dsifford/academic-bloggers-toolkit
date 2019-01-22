import _ from 'lodash';

type Widen<T> = T extends string ? string : T extends number ? number : T;

export function clone<T>(data: T): T {
    if (data === undefined) {
        return data;
    }
    return JSON.parse(JSON.stringify(data));
}

export function firstTruthyValue<T extends Record<string, any>, U>(
    obj: T,
    paths: string[],
    fallback: Widen<U>,
): Widen<U>;
export function firstTruthyValue<T extends Record<string, any>, U>(
    obj: T,
    paths: string[],
): U | undefined;
export function firstTruthyValue<T extends Record<string, any>, U>(
    obj: T,
    paths: string[],
    fallback?: Widen<U>,
) {
    for (const path of paths) {
        const val = _.get(obj, path);
        if (val) {
            return val;
        }
    }
    return fallback;
}

export function swapWith<T>(arr: T[], a: number, b: number): T[] {
    const list = [...arr];
    const item = list.splice(a, 1);
    return [...list.slice(0, b), ...item, ...list.slice(b)];
}
