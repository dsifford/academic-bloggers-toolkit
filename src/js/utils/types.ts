/**
 * Narrow `Object.keys()` to an array of keys of the passed object.
 * Note: this is inferred from type, not runtime, so could be potentially dangerous. Be cautious.
 */
export const typedKeys = Object.keys as <T>(o: T) => Array<Extract<keyof T, string>>; // prettier-ignore
