type Cache = Array<[string, string]>;

export default class CSLCache {
    static readonly CACHE_KEY = 'abt-style-cache';
    private cache: Map<string, string>;
    constructor() {
        const cache: Cache = JSON.parse(
            sessionStorage.getItem('abt-style-cache') || '[]',
        );
        this.cache = new Map(cache);
    }
    fetch = async (style: string): Promise<string> => {
        if (this.cache.has(style)) {
            return this.cache.get(style)!;
        }
        const req = await fetch(
            `https://raw.githubusercontent.com/citation-style-language/styles/master/${style}.csl`,
        );
        if (!req.ok) {
            throw new Error(req.statusText);
        }
        const text = await req.text();
        this.cache.set(style, text);
        sessionStorage.setItem(
            CSLCache.CACHE_KEY,
            JSON.stringify(Array.from(this.cache.entries())),
        );
        return text;
    };
}
