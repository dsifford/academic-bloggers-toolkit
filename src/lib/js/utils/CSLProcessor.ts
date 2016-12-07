import { localeMapper } from './Constants';
import { formatBibliography } from './formatters/';
import { Store } from '../reference-list/Store';
import { toJS } from 'mobx';

declare const ABT_Custom_CSL: BackendGlobals.ABT_Custom_CSL;
declare const ABT_wp: BackendGlobals.ABT_wp;
declare const CSL;

export class CSLProcessor {

    /**
     * CSL.Engine instance created by this class.
     */
    public citeproc: Citeproc.Processor;

    /**
     * Converts the locale names in wordpress (keys) to the locales
     *   in CSL (values). If CSL doesn't have a locale for a given WordPress locale,
     *   then false is used (which will default to en-US).
     */
    private locales: {[wp: string]: string|boolean} = localeMapper;

    /**
     * Key/value store for locale XML. Locale XML is fetched off the main thread
     *   and then saved to this Map for Citeproc to consume as needed.
     */
    private localeStore: Map<string, string> = new Map();

    /**
     * The main store for the reference list.
     */
    private store: Store;

    /**
     * Worker used to fetch locale XML off thread and save it into the localeStore.
     *   After all locales are fetched, this worker destroys itself.
     */
    private worker: Worker;

    /**
     * @param store The main store for the reference list.
     */
    constructor(store: Store) {
        this.store = store;
        this.worker = new Worker(`${ABT_wp.abt_url}/vendor/worker.js`);
        this.worker.addEventListener('message', this.receiveWorkerMessage);
        this.worker.postMessage('');
    }

    /**
     * Instantiates a new CSL.Engine (either when initially constructed or when
     *   the user changes his/her selected citation style)
     *
     *   The middle (index, or 'b') value in the returned array is ignored
     *   and the literal index is used because of an issue with Citeproc-js.
     *   This small change seems to fix a breaking issue.
     *
     * @param styleID CSL style filename.
     * @return Promise that resolves to either an object containing the style XML
     *   and the `sys` object, or an Error depending on the responses from the
     *   network.
     */
    async init(): Promise<Citeproc.CitationClusterData[]> {
        const style = this.store.citationStyle === 'abt-user-defined'
            ? ABT_Custom_CSL.CSL
            : await this.getCSLStyle(this.store.citationStyle);
        const sys = await this.generateSys(this.store.locale);
        this.citeproc = new CSL.Engine(sys, style);
        return <[number, string, string][]>
            this.citeproc.rebuildProcessorState(this.store.citations.citationByIndex)
            .map(([a, , c], i) => [i, c, a]);
    }

    /**
     * Wrapper function for citeproc.makeBibliography that ensures the citation store
     *   is also kept in sync with the processor store as well as formats the
     *   bibliography output.
     *
     * This function returns `false` if the user is using a citation style that does
     *   not include a bibliography (e.g. `Mercatus Center`)
     *
     * @return {ABT.Bibliography|boolean}
     */
    makeBibliography(): ABT.Bibliography|boolean {
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
     * @return Citeproc.CitationByIndexSingle for the current inline citation.
     */
    prepareInlineCitationData(csl: CSL.Data[], currentIndex: number): Citeproc.Citation {
        const payload = {
            citationItems: [],
            properties: { noteIndex: currentIndex },
        };
        csl.forEach((c) => payload.citationItems.push({id: c.id}));
        return payload;
    }

    /**
     * Wrapper function around Citeproc.processCitationCluster that ensures the store
     *   is kept in sync with the processor.
     *
     * @param  citation Single Citeproc.Citation
     * @param  before   Citations before the current citation.
     * @param  after    Citations after the current citation.
     * @return Citeproc.CitationClusterData[]
     */
    processCitationCluster(
        citation: Citeproc.Citation,
        before: Citeproc.CitationsPrePost,
        after: Citeproc.CitationsPrePost,
    ): Citeproc.CitationClusterData[] {
        const [status, clusters] =
            this.citeproc.processCitationCluster(
                citation,
                before,
                after,
            );
        if (status['citation_errors'].length) console.error(status['citation_errors']);
        this.store.citations.init(this.citeproc.registry.citationreg.citationByIndex);
        return clusters;
    }

    /**
     * Spawns a new temporary CSL.Engine and creates a static, untracked bibliography
     *
     * @param  {CSL.Data[]}                data Array of CSL.Data
     * @return {Promise<ABT.Bibliography>}
     */
    async createStaticBibliography(data: CSL.Data[]): Promise<ABT.Bibliography|boolean> {
        const style = this.store.citationStyle === 'abt-user-defined'
            ? ABT_Custom_CSL.CSL
            : await this.getCSLStyle(this.store.citationStyle);
        const sys = {...this.citeproc.sys};
        const citeproc = new CSL.Engine(sys, style);
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
        this.localeStore.set(e.data[0], e.data[1]);
    }

    /**
     * Called exclusively from the `init` method to generate the `sys` object
     *   required by the CSL.Engine.
     *
     * @param locale The locale string from this.locales (handled in constructor)
     * @return Promise that resolves either to a Citeproc.SystemObj or Error,
     *   depending on the response from the network request.
     */
    private generateSys(locale: string): Promise<Citeproc.SystemObj> {
        return new Promise((resolve, reject) => {
            const req = new XMLHttpRequest();
            const cslLocale = <string> this.locales[locale] || 'en-US';
            req.onreadystatechange = () => {
                if (req.readyState === 4) {
                    if (req.status !== 200) reject(new Error(req.responseText));
                    this.localeStore.set(cslLocale, req.responseText);
                    resolve({
                        retrieveItem: (id: string) => toJS(this.store.citations.CSL.get(id)),
                        retrieveLocale: this.getRemoteLocale.bind(this),
                    });
                }
            }; // tslint:disable-next-line
            req.open('GET', `https://raw.githubusercontent.com/citation-style-language/locales/master/locales-${cslLocale}.xml`);
            req.send(null);
        })
        .catch(e => e);
    }

    /**
     * Called exclusively from the `init` method to get the CSL style file over
     *   the air from the Github repo.
     *
     * @param style CSL style filename
     * @return Promise that resolves to a string of CSL XML or an Error, depending
     *   on the response from the network request.
     */
    private getCSLStyle(style: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const req = new XMLHttpRequest();
            req.open('GET', `https://raw.githubusercontent.com/citation-style-language/styles/master/${style}.csl`);
            req.onreadystatechange = () => {
                if (req.readyState === 4) {
                    if (req.status !== 200) reject(new Error(req.responseText));
                    resolve(req.responseText);
                }
            };
            req.send(null);
        })
        .catch(e => e);
    }

    /**
     * Acts as the retrieveLocale function for the Citeproc.SystemObj.
     *
     * First, this function checks too see if there is the desired locale available
     *   in the localeStore. If there is, it returns that. If not, it returns the
     *   fallback locale (the primary locale for the current user).
     *
     * @param  loc  The locale name.
     * @return      Locale XML (as a string)
     */
    private getRemoteLocale(loc: string): string {
        const normalizedLocale = <string> this.locales[loc] || 'en-US';
        const fallback = <string> this.locales[this.store.locale] || 'en-US';
        return this.localeStore.has(normalizedLocale)
            ? this.localeStore.get(normalizedLocale)
            : this.localeStore.get(fallback);
    }

}
