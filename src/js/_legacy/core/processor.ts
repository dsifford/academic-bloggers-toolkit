import { Citation, CitationResult, Engine, Locator, Sys } from 'citeproc';
import { toJS } from 'mobx';
import uuid from 'uuid/v4';

import CSLCache from '_legacy/stores/cache/csl-cache';
import LocaleCache from '_legacy/stores/cache/locale-cache';
import Store from '_legacy/stores/data';
import { formatBibliography } from '_legacy/utils/formatters';

export class Processor {
    /**
     * CSL.Engine instance created by this class
     */
    citeproc!: Engine;

    private locales: LocaleCache;
    private store: Store;
    private styles: CSLCache;

    /**
     * @param store The main store for the reference list
     */
    constructor(store: Store) {
        this.store = store;
        this.styles = new CSLCache();
        this.locales = new LocaleCache();
    }

    /**
     * Spawns a new temporary CSL.Engine and creates a static, untracked bibliography
     *
     * @param data - Array of CSL.Data
     */
    async createStaticBibliography(
        data: CSL.Data[],
    ): Promise<ABT.Bibliography | boolean> {
        const style =
            this.store.citationStyle.kind === 'custom'
                ? this.store.citationStyle.value
                : await this.styles.fetch(this.store.citationStyle.value);
        const sys = { ...this.citeproc.sys };
        const citeproc = new Engine(sys, style);
        citeproc.updateItems(toJS(data.map(d => d.id)));
        const bib = citeproc.makeBibliography();
        return typeof bib === 'boolean'
            ? bib
            : formatBibliography(
                  bib,
                  this.store.displayOptions.links,
                  this.store.citations.CSL,
              );
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
    async init(): Promise<CitationResult[]> {
        const style =
            this.store.citationStyle.kind === 'custom'
                ? this.store.citationStyle.value
                : await this.styles.fetch(this.store.citationStyle.value);
        const sys = await this.generateSys(this.store.locale);
        this.citeproc = new Engine(sys, style);
        return <Array<[number, string, string]>>(
            this.citeproc
                .rebuildProcessorState(this.store.citations.citationByIndex)
                .map(([a, , c], i) => [i, c, a])
        );
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
        this.store.citations.init(
            this.citeproc.registry.citationreg.citationByIndex,
        );
        return typeof bib === 'boolean'
            ? bib
            : formatBibliography(
                  bib,
                  this.store.displayOptions.links,
                  this.store.citations.CSL,
              );
    }

    /**
     * Transforms the CSL.Data[] into a Citeproc.Citation.
     *
     * @param csl CSL.Data[].
     */
    prepareInlineCitationData(csl: CSL.Data[]): Citation {
        // prettier-ignore
        const citationItems = Array.from(
            new Set(
                csl.map(item => item.id)
            )
        ).map(id => ({ id }));
        return {
            citationID: uuid(),
            citationItems,
        };
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
        citation: Citation,
        before: Locator,
        after: Locator,
    ): CitationResult[] {
        const [, citations] = this.citeproc.processCitationCluster(
            citation,
            before,
            after,
        );
        this.store.citations.init(
            this.citeproc.registry.citationreg.citationByIndex,
        );
        return citations;
    }

    /**
     * Called exclusively from the `init` method to generate the `sys` object
     * required by the CSL.Engine
     *
     * @param locale The locale string from this.locales (handled in constructor)
     */
    private async generateSys(locale: string): Promise<Sys> {
        // "primes the pump" since citeproc currently runs synchronously
        await this.locales.fetch(locale);
        return {
            retrieveItem: (id: string): CSL.Data =>
                toJS(this.store.citations.CSL.get(id)!),
            retrieveLocale: this.locales.retrieve,
        };
    }
}
