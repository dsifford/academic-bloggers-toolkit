type StyleCache = Array<[string, string]>;

export class StyleStore {
    static readonly CACHE_KEY = 'abt-style-cache';
    private cache: Map<string, string>;
    private filenames: Map<string, string>;
    constructor() {
        this.filenames = new Map([
            ...top.ABT.styles.styles.map(style => <[string, string]>[style.id, style.value]),
            ...Object.entries(top.ABT.styles.renamed),
        ]);
        const cache: StyleCache = JSON.parse(sessionStorage.getItem('abt-style-cache') || '[]');
        this.cache = new Map(cache);
    }
    fetch = async (style: string): Promise<string> => {
        if (this.cache.has(style)) {
            return this.cache.get(style)!;
        }
        const req = await fetch(
            `https://raw.githubusercontent.com/citation-style-language/styles/master/${this.filenames.get(
                style,
            )}.csl`,
        );
        if (!req.ok) {
            throw new Error(req.statusText);
        }
        const text = await req.text();
        this.cache.set(style, text);
        sessionStorage.setItem(
            StyleStore.CACHE_KEY,
            JSON.stringify(Array.from(this.cache.entries())),
        );
        return text;
    };
}
