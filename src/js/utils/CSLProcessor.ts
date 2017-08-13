import { toJS } from 'mobx';

import Store from 'reference-list/store';
import { localeMapper } from './constants';
import { formatBibliography } from './formatters/';

declare const ABT_Custom_CSL: BackendGlobals.ABT_Custom_CSL;
declare const ABT_wp: BackendGlobals.ABT_wp;
declare const CSL: Citeproc.EngineConstructor;

interface LocaleCache {
    time: number;
    locales: Array<[string, string]>;
}

export class CSLProcessor {
    /**
     * CSL.Engine instance created by this class
     */
    citeproc: Citeproc.Processor;

    /**
     * Converts the locale names in wordpress (keys) to the locales
     * in CSL (values). If CSL doesn't have a locale for a given WordPress locale,
     * then `false` is used (which will default to en-US)
     */
    private locales = localeMapper;

    /**
     * Key/value store for locale XML. Locale XML is fetched off the main thread
     * and then saved to this Map for Citeproc to consume as needed
     */
    private localeStore: Map<string, string> = new Map();

    /**
     * The main store for the reference list
     */
    private store: Store;

    /**
     * Map of style ID to style value. This is useful in cases where the user
     * is using a "dependent" (i.e. one that is actually referencing an
     * "independent" style)
     */
    private styles: Map<string, string>;

    /**
     * Worker used to fetch locale XML off thread and save it into the localeStore.
     * After all locales are fetched, this worker destroys itself
     */
    private worker: Worker;

    /**
     * @param store The main store for the reference list
     */
    constructor(store: Store) {
        const localeCache = localStorage.getItem('abt-locale-cache');
        this.store = store;
        this.styles = new Map(ABT_CitationStyles.map(style => <any>[style.id, style.value]));

        if (localeCache) {
            const localeJson: LocaleCache = JSON.parse(localeCache);
            if (Date.now() - localeJson.time < 2592000000) {
                this.localeStore = new Map(localeJson.locales);
                return;
            }
        }

        this.worker = new Worker(`${ABT_wp.abt_url}/vendor/worker.js`);
        this.worker.addEventListener('message', this.receiveWorkerMessage);
        this.worker.postMessage('');
    }

    /**
     * Instantiates a new CSL.Engine (either when initially constructed or when
     * the user changes his/her selected citation style)
     *
     * The middle (index, or 'b') value in the returned array is ignored
     * and the literal index is used because of an issue with Citeproc-js.
     * This small change seems to fix a breaking issue
     *
     * @param styleID - CSL style filename
     * @return Promise that resolves to either an object containing the style XML
     * and the `sys` object, or an Error depending on the responses from the network
     */
    async init(): Promise<Citeproc.CitationCluster[]> {
        const style =
            this.store.citationStyle.get() === 'abt-user-defined'
                ? ABT_Custom_CSL.CSL
                : await this.getCSLStyle(this.store.citationStyle.get());
        const sys = await this.generateSys(this.store.locale);
        this.citeproc = new CSL.Engine(sys, style);
        return <Array<[number, string, string]>>this.citeproc
            .rebuildProcessorState(this.store.citations.citationByIndex)
            .map(([a, , c], i) => [i, c, a]);
    }

    /**
     * Wrapper function for citeproc.makeBibliography that ensures the citation store
     * is also kept in sync with the processor store as well as formats the
     * bibliography output
     *
     * This function returns `false` if the user is using a citation style that does
     * not include a bibliography (e.g. `Mercatus Center`)
     */
    makeBibliography(): ABT.Bibliography | boolean {
        const bib = this.citeproc.makeBibliography();
        this.store.citations.init(this.citeproc.registry.citationreg.citationByIndex);
        return typeof bib === 'boolean'
            ? bib
            : formatBibliography(bib, this.store.links, this.store.citations.CSL);
    }

    /**
     * Transforms the CSL.Data[] into a Citeproc.Citation.
     *
     * @param csl CSL.Data[].
     */
    prepareInlineCitationData(csl: CSL.Data[], currentIndex: number): Citeproc.Citation {
        const payload = {
            citationItems: <Array<{ id: string }>>[],
            properties: { noteIndex: currentIndex },
        };
        csl.forEach(c => payload.citationItems.push({ id: c.id! }));
        return payload;
    }

    /**
     * Wrapper function around Citeproc.processCitationCluster that ensures the store
     * is kept in sync with the processor
     *
     * @param  citation - Single Citeproc.Citation
     * @param  before   - Citations before the current citation
     * @param  after    - Citations after the current citation
     */
    processCitationCluster(
        citation: Citeproc.Citation,
        before: Citeproc.CitationsPrePost,
        after: Citeproc.CitationsPrePost,
    ): Citeproc.CitationCluster[] {
        const [status, clusters] = this.citeproc.processCitationCluster(citation, before, after);
        if (status['citation_errors'].length) {
            // tslint:disable-next-line
            console.error(status['citation_errors']);
        }
        this.store.citations.init(this.citeproc.registry.citationreg.citationByIndex);
        return clusters;
    }

    /**
     * Spawns a new temporary CSL.Engine and creates a static, untracked bibliography
     *
     * @param data - Array of CSL.Data
     */
    async createStaticBibliography(data: CSL.Data[]): Promise<ABT.Bibliography | boolean> {
        const style =
            this.store.citationStyle.get() === 'abt-user-defined'
                ? ABT_Custom_CSL.CSL
                : await this.getCSLStyle(this.store.citationStyle.get());
        const sys = { ...this.citeproc.sys };
        const citeproc: Citeproc.Processor = new CSL.Engine(sys, style);
        citeproc.updateItems(toJS(data.map(d => d.id)));
        const bib = citeproc.makeBibliography();
        return typeof bib === 'boolean'
            ? bib
            : formatBibliography(bib, this.store.links, this.store.citations.CSL);
    }

    /**
     * Saves locales from the Worker into the localeStore
     */
    private receiveWorkerMessage = (e: MessageEvent) => {
        if (e.data[0] === 'done') {
            return this.updateLocalStorage();
        }
        this.localeStore.set(e.data[0], e.data[1]);
    };

    /**
     * Updates the cached locales in localStorage from localeStore
     */
    private updateLocalStorage() {
        const localeObj: LocaleCache = {
            time: Date.now(),
            locales: [...this.localeStore],
        };
        localStorage.setItem('abt-locale-cache', JSON.stringify(localeObj));
    }

    /**
     * Called exclusively from the `init` method to generate the `sys` object
     * required by the CSL.Engine
     *
     * @param locale The locale string from this.locales (handled in constructor)
     * @return Promise that resolves to a Citeproc.SystemObj
     */
    private async generateSys(locale: string): Promise<Citeproc.SystemObj> {
        const cslLocale = this.locales[locale] || 'en-US';
        const cachedLocaleFile = this.localeStore.get(cslLocale);
        if (!cachedLocaleFile) {
            const req = await fetch(
                `https://raw.githubusercontent.com/citation-style-language/locales/master/locales-${cslLocale}.xml`,
            );
            if (!req.ok) {
                throw new Error(req.statusText);
            }
            const res = await req.text();
            this.localeStore.set(cslLocale, res);
        }
        return {
            retrieveItem: (id: string) => toJS(this.store.citations.CSL.get(id)!),
            retrieveLocale: this.getRemoteLocale.bind(this),
        };
    }

    /**
     * Called exclusively from the `init` method to get the CSL style file over
     *   the air from the Github repo
     *
     * @param style CSL style filename
     * @return Promise that resolves to a string of CSL XML or an Error, depending
     * on the response from the network request
     */
    private async getCSLStyle(style: string): Promise<string> {
        const req = await fetch(
            `https://raw.githubusercontent.com/citation-style-language/styles/master/${this.styles.get(
                style,
            )}.csl`,
        );
        if (!req.ok) {
            throw new Error(req.statusText);
        }
        return req.text();
    }

    /**
     * Acts as the retrieveLocale function for the Citeproc.SystemObj
     *
     * First, this function checks too see if there is the desired locale available
     * in the localeStore. If there is, it returns that. If not, it returns the
     * fallback locale (the primary locale for the current user)
     *
     * @param loc - The locale name
     * @return Locale XML (as a string)
     */
    private getRemoteLocale(loc: string): string {
        const normalizedLocale = (<string>this.locales[loc]) || 'en-US';
        const fallback = (<string>this.locales[this.store.locale]) || 'en-US';
        return this.localeStore.has(normalizedLocale)
            ? this.localeStore.get(normalizedLocale)!
            : this.localeStore.get(fallback)!;
    }
}
