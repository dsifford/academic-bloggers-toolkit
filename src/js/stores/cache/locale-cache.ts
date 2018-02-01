import { localeMapper } from 'utils/constants';

interface LocaleCache {
    /**
     * Array of enum; first value is the locale ID, second value is the locale XML as a string.
     * This format was chosen so that it can easily be moved from `localStorage` into a `Map` at
     * runtime.
     */
    locales: Array<[string, string]>;
    /**
     * Timestamp in milliseconds of when the cache was saved
     */
    time: number;
}

export default class LocaleStore {
    /**
     * The key of the storage item for the locales in `localStorage`
     */
    static readonly CACHE_KEY = 'abt-locale-cache';

    /**
     * The fallback locale is the locale that should be retrieved first and used as a fallback
     * locale if the requested locale has not been retrieved yet. This is necessary because
     * citeproc demands a synchronous way of retrieving locales.
     */
    private readonly fallback: string = localeMapper[
        top.ABT.state.cache.locale
    ] || 'en-US';

    /**
     * Map that holds all cached locales. Key is locale ID, value is raw locale XML as a string.
     */
    private cache: Map<string, string> = new Map();

    /**
     * Worker used to fetch locale XML off thread and save it into the cache.
     * After all locales are fetched, this worker destroys itself
     */
    private worker!: Worker;

    constructor() {
        const cache = localStorage.getItem(LocaleStore.CACHE_KEY);
        if (cache) {
            const localeJson: LocaleCache = JSON.parse(cache);
            if (Date.now() - localeJson.time < 2592000000) {
                this.cache = new Map(localeJson.locales);
                return;
            }
        }
        this.worker = new Worker(
            `${top.ABT.wp.abt_url}/workers/locale-worker.js`,
        );
        this.worker.addEventListener('message', this.receiveMessage);
        this.worker.postMessage('');
    }

    /**
     * Asynchronously fetches a locale file for a given locale if the file does not already exist
     * in the cache
     */
    fetch = async (locale: string): Promise<string> => {
        const localeId = localeMapper[locale] || 'en-US';
        if (this.cache.has(localeId)) {
            return this.cache.get(localeId)!;
        }
        const req = await fetch(
            `https://raw.githubusercontent.com/citation-style-language/locales/master/locales-${localeId}.xml`,
        );
        if (!req.ok) {
            throw new Error(req.statusText);
        }
        const file = await req.text();
        this.cache.set(localeId, file);
        return file;
    };

    /**
     * Synchronously retrieves a given locale file from cache or throws an error if the file or the
     * fallback does not exist. This method is used exclusively by citeproc.js since it requires a
     * synchronous way of getting locale files.
     */
    retrieve = (locale: string): string => {
        const localeId = localeMapper[locale];
        if (localeId && this.cache.has(locale)) {
            return this.cache.get(locale)!;
        } else if (this.cache.has(this.fallback)) {
            return this.cache.get(this.fallback)!;
        } else {
            throw new Error('Fallback locale could not be retrieved');
        }
    };

    /**
     * Takes locale files send via the Workers `postMessage` channel and saves them to the cache.
     * Once all files retrieved, the worker sends `done` and the cache is pushed into localStorage.
     */
    private receiveMessage = (e: MessageEvent): void => {
        if (e.data[0] === 'done') {
            const localeObj: LocaleCache = {
                time: Date.now(),
                locales: [...this.cache],
            };
            localStorage.setItem(
                LocaleStore.CACHE_KEY,
                JSON.stringify(localeObj),
            );
        } else {
            this.cache.set(e.data[0], e.data[1]);
        }
    };
}
