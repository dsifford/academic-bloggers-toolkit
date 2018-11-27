export default function pick<T>(input: T, ...keys: Array<keyof T>): Partial<T> {
    return keys.reduce((output, key) => ({ ...output, [key]: input[key] }), {});
}
