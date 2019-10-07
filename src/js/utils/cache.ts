import { omit } from 'lodash';

interface CacheJSON<T> {
    [k: string]: {
        expires: number;
        data: Record<string, T>;
    };
}

interface StorageFallback extends Storage {
    _value: Map<string, string>;
}

abstract class AbstractCache<T> {
    private readonly PREFIX = 'ABT_CACHE_';
    private readonly VERSION = 'v1.0';
    private readonly EXPIRES: number;
    private readonly ITEM_KEY: string;
    private readonly KEY = `${this.PREFIX}${this.VERSION}`;
    private readonly _cache = this.storageIsAvailable()
        ? top.localStorage
        : this.createFallbackStorage();

    constructor(key: string, daysTilExpiration = 30) {
        const ONE_DAY = 86400000;
        this.ITEM_KEY = key;
        this.EXPIRES = Date.now() + ONE_DAY * daysTilExpiration;
        const { KEY, PREFIX } = this;

        // Purge old cache versions
        Object.keys(this._cache)
            .filter(k => k.startsWith(PREFIX) && k !== KEY)
            .forEach(k => this._cache.removeItem(k));
    }

    abstract async fetchItem(key: string): Promise<T>;

    getItem(key: string): T | null {
        return this.cache[key] || null;
    }
    removeItem(key: string): void {
        this.cache = omit(this.cache, key);
    }
    setItem(key: string, value: T): void {
        this.cache = {
            ...this.cache,
            [key]: value,
        };
    }

    private get cache(): Record<string, T> {
        const { EXPIRES: expires, ITEM_KEY, KEY } = this;
        const value: CacheJSON<T> = JSON.parse(
            this._cache.getItem(KEY) || '{}',
        );
        let item = value[ITEM_KEY];
        if (!item || item.expires < Date.now()) {
            item = {
                expires,
                data: {},
            };
            this._cache.setItem(
                KEY,
                JSON.stringify({
                    ...value,
                    [ITEM_KEY]: { ...item },
                }),
            );
        }
        return { ...item.data };
    }
    private set cache(data: Record<string, T>) {
        const { ITEM_KEY, KEY } = this;
        const value: CacheJSON<T> = JSON.parse(
            this._cache.getItem(KEY) || '{}',
        );
        const item = value[ITEM_KEY];
        this._cache.setItem(
            KEY,
            JSON.stringify({ ...value, [ITEM_KEY]: { ...item, data } }),
        );
    }

    private storageIsAvailable(): boolean {
        const TEST_KEY = '__storage_test__';
        try {
            const storage = window.localStorage;
            storage.setItem(TEST_KEY, 'test');
            storage.removeItem(TEST_KEY);
            return true;
        } catch {
            return false;
        }
    }

    private createFallbackStorage(): StorageFallback {
        return {
            _value: new Map(),
            get length() {
                return this._value.size;
            },
            clear() {
                this._value.clear();
            },
            getItem(key) {
                return this._value.get(key) || null;
            },
            key(index) {
                return [...this._value.keys()][index] || null;
            },
            removeItem(key) {
                this._value.delete(key);
            },
            setItem(key, value) {
                this._value.set(key, value);
            },
        };
    }
}

export const localeCache = new (class extends AbstractCache<string> {
    private parser = new DOMParser();

    async fetchItem(style: string): Promise<string> {
        const xml = this.parser.parseFromString(style, 'application/xml');
        const styleNode = xml.querySelector('style');
        if (xml.querySelector('parsererror')) {
            throw new Error('Invalid style XML');
        }
        if (!styleNode) {
            throw new Error('CSL style is not valid');
        }
        const localeId = styleNode.getAttribute('default-locale') || 'en-US';
        const response = await fetch(
            `https://raw.githubusercontent.com/citation-style-language/locales/master/locales-${localeId}.xml`,
        );
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const locale = await response.text();
        this.setItem(localeId, locale);
        return locale;
    }
})('locales');

export const styleCache = new (class extends AbstractCache<string> {
    async fetchItem(styleId: string): Promise<string> {
        const cached = this.getItem(styleId);
        if (cached !== null) {
            return cached;
        }
        const response = await fetch(
            `https://raw.githubusercontent.com/citation-style-language/styles/master/${styleId}.csl`,
        );
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const style = await response.text();
        this.setItem(styleId, style);
        return style;
    }
})('styles');
