import { localeConversions } from './Constants';
import { parseReferenceURLs } from './HelperFunctions';

declare var CSL;

export class CSLProcessor /* FIXME implements ABT.CSLProcessor */ {

    /**
     * This object converts the locale names in wordpress (keys) to the locales
     *   in CSL (values). If CSL doesn't have a locale for a given WordPress locale,
     *   then false is used (which will default to en-US).
     */
    private locales: {[wp: string]: string|boolean} = localeConversions;
    private store;
    public citeproc: Citeproc.Processor;

    /**
     * @param locale Locale string passed in from WordPress.
     * @param style  Selected citation style (chosen on options page).
     */
    constructor(store) {
        this.store = store;
        this.init();
    }

    /**
     * Called exclusively from the `init` method to generate the `sys` object
     *   required by the CSL.Engine.
     * @param locale The locale string from this.locales (handled in constructor)
     * @return Promise that resolves either to a Citeproc.SystemObj or Error,
     *   depending on the response from the network request.
     */
    private generateSys(locale: string): Promise<Citeproc.SystemObj|Error> {
        return new Promise((resolve, reject) => {
            const req = new XMLHttpRequest();
            const cslLocale = this.locales[locale] ? this.locales[locale] : 'en-US';
            req.onreadystatechange = () => {
                if (req.readyState === 4) {
                    if (req.status !== 200) reject(new Error(req.responseText));
                    resolve({
                        retrieveLocale: () => req.responseText,
                        retrieveItem: (id: string|number) => this.store.citations.CSL.get(id),
                    });
                }
            };
            req.open('GET', `https://raw.githubusercontent.com/citation-style-language/locales/8c976408d3cb287d0cecb29f97752ec3a28db9e5/locales-${cslLocale}.xml`);
            req.send(null);
        })
        .catch(e => e);
    }

    /**
     * Called exclusively from the `init` method to get the CSL style file over
     *   the air from the Github repo.
     * @param style CSL style filename
     * @return Promise that resolves to a string of CSL XML or an Error, depending
     *   on the response from the network request.
     */
    private getCSLStyle(style: string): Promise<string|Error> {
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
     * Instantiates a new CSL.Engine (either when initially constructed or when
     *   the user changes his/her selected citation style)
     * @param styleID CSL style filename.
     * @return Promise that resolves to either an object containing the style XML
     *   and the `sys` object, or an Error depending on the responses from the
     *   network.
     */
    async init(): Promise<Citeproc.CitationClusterData[]> {
        const style = await this.getCSLStyle(this.store.citationStyle);
        const sys = await this.generateSys(this.store.locale);
        if (style instanceof Error) throw style;
        if (sys instanceof Error) throw sys;
        this.citeproc = new CSL.Engine(sys, style);
        return <[number,string,string][]>
            this.citeproc.rebuildProcessorState(this.store.citations.citationByIndex)
            .map(([a, b, c]) => [b, c, a]);
    }

    // private getRemoteLocale(loc) {
    //     console.log('GET REMOTE LOCALE CALLED');
    //     console.log(loc);
    // }

    /**
     * Transforms the CSL.Data[] into a Citeproc.Citation.
     *
     * @param currentIndex The current inline-citation's index.
     * @param csl Fallback CSL.Data[].
     * @return Citeproc.CitationByIndexSingle for the current inline citation.
     */
    prepareInlineCitationData(csl: CSL.Data[]): Citeproc.Citation {
        const payload = {
            citationItems: [],
            properties: { noteIndex: 0 },
        };
        csl.forEach((c) => payload.citationItems.push({id: c.id}));
        return payload;
    }

    /**
     * Wrapper function for citeproc.makeBibliography that takes the output and
     *   inlines CSS classes that are appropriate for the style (according to the
     *   generated bibmeta).
     * NOTE: This still needs to be extended further.
     * @return {Citeproc.Bibliography} Parsed bibliography.
     */
    makeBibliography(links: 'always'|'urls'|'never'): ABT.Bibliography {
        const [bibmeta, bibHTML]: Citeproc.Bibliography = this.citeproc.makeBibliography();
        this.store.citations.init(this.citeproc.registry.citationreg);
        const temp = document.createElement('DIV');
        const payload: {id: string, html: string}[] = bibHTML.map((h: string, i: number) => {
            temp.innerHTML = h;
            const el = temp.firstElementChild as HTMLDivElement;
            const item: CSL.Data = this.store.citations.CSL.get(bibmeta.entry_ids[i][0]);

            switch (bibmeta['second-field-align']) {
                case false:
                    el.classList.add('hanging-indent');
                    break;
                case 'flush':
                    el.classList.add('flush');
                    break;
            }
            switch (links) {
                case 'always': {
                    el.innerHTML = parseReferenceURLs(el.innerHTML);
                    if (item.PMID) {
                        if (el.getElementsByClassName('csl-right-inline').length > 0) {
                            el.lastElementChild.innerHTML += `<span class="abt-url"> [<a href="http://www.ncbi.nlm.nih.gov/pubmed/${item.PMID}" target="_blank">PubMed</a>]</span>`;
                        }
                        else {
                            el.innerHTML += `<span class="abt-url"> [<a href="http://www.ncbi.nlm.nih.gov/pubmed/${item.PMID}" target="_blank">PubMed</a>]</span>`;
                        }
                    }
                    break;
                }
                case 'urls': {
                    el.lastElementChild.innerHTML = parseReferenceURLs(el.innerHTML);
                    break;
                }
            }

            return {id: bibmeta.entry_ids[i][0], html: temp.innerHTML};
        });
        temp.remove();
        return [bibmeta, payload];
    }

}

/*
NOTE: Locale list...
eng
rus
 */
