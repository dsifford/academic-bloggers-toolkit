import { localeConversions } from './Constants';
import { parseReferenceURLs } from './HelperFunctions';

declare var CSL;

export class CSLProcessor implements ABT.CSLProcessor {

    /**
     * This object converts the locale names in wordpress (keys) to the locales
     *   in CSL (values). If CSL doesn't have a locale for a given WordPress locale,
     *   then false is used (which will default to en-US).
     */
    private locales: {[wp: string]: string|boolean} = localeConversions;
    private locale: string;

    public style: string;
    public state: {
        citations: {
            [itemID: string]: CSL.Data;
        };
    };
    public citeproc: Citeproc.Processor;

    /**
     * @param locale Locale string passed in from WordPress.
     * @param style  Selected citation style (chosen on options page).
     */
    constructor(locale: string, style: string, state, citationsByIndex: Citeproc.Citation[]) {
        this.state = {
            citations: state,
        };
        this.style = style === '' ? 'american-medical-association' : style;
        this.locale = locale;

        this.init(this.style, citationsByIndex);
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
            const cslLocale = !this.locales[locale] ? 'en-US' : this.locales[locale];
            req.onreadystatechange = () => {
                if (req.readyState === 4) {
                    if (req.status !== 200) reject(new Error(req.responseText));
                    resolve({
                        retrieveLocale: (lang: string) => req.responseText,
                        retrieveItem: (id: string|number) => this.state.citations[id],
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
    init(styleID: string, citationsByIndex: Citeproc.Citation[]): Promise<Citeproc.CitationClusterData[]> {
        this.style = styleID;
        const p1 = this.getCSLStyle(styleID);
        const p2 = this.generateSys(this.locale);
        return Promise.all(
            [p1, p2]
        )
        .then(data => {
            const [style, sys] = data;
            if (style instanceof Error) return style;
            if (sys instanceof Error) return sys;
            return {style, sys};
        })
        .then(data => {
            if (data instanceof Error) {
                console.error(data.message);
                return;
            }
            this.citeproc = new CSL.Engine(data.sys, data.style);
        })
        .then(() => {
            return this.citeproc.rebuildProcessorState(citationsByIndex).map(([a, b, c]) => [b, c, a]);
        })
        .catch(e => e);
    }

    /**
     * Updates the local state with new citation data.
     * @param citations Array of CSL.Data.
     * @return State after adding items
     */
    consumeCitations(citations: CSL.Data[]): {[itemID: string]: CSL.Data} {
        const newCitations = {};
        citations.forEach(c => {
            newCitations[c.id] = c;
        });
        this.state = Object.assign({}, this.state, {
            citations: Object.assign({}, this.state.citations, newCitations),
        });
        return this.state.citations;
    }

    /**
     * Purges items from the local state whos ID is listed in `items`
     * @param  items Array of item IDs to remove from the state.
     * @return State after removing items
     */
    purgeCitations(items: string[]): {[itemID: string]: CSL.Data} {
        const citations = Object.keys(this.state.citations)
            .filter(id => items.indexOf(id) === -1)
            .reduce((result, id) => {
                result[id] = this.state.citations[id];
                return result;
            }, {});
        this.state = Object.assign({}, this.state, {
            citations,
        });
        return this.state.citations;
    }

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
    makeBibliography(links: 'always'|'urls'|'never'): Citeproc.Bibliography {
        const [bibmeta, bibHTML]: Citeproc.Bibliography = this.citeproc.makeBibliography();
        const temp = document.createElement('DIV');
        const payload: string[] = bibHTML.map((h: string, i: number) => {
            temp.innerHTML = h;
            const el = temp.firstElementChild as HTMLDivElement;
            const item: CSL.Data = this.state.citations[bibmeta.entry_ids[i][0]];

            switch (bibmeta['second-field-align']) {
                case false:
                    el.classList.add('hanging-indent');
                    break;
            }
            switch (links) {
                case 'always': {
                    el.innerHTML = parseReferenceURLs(el.innerHTML);
                    if (item.PMID) {
                        el.innerHTML += ` [<a href="http://www.ncbi.nlm.nih.gov/pubmed/${item.PMID}" target="_blank">PubMed</a>]`;
                    }
                    break;
                }
                case 'urls': {
                    el.innerHTML = parseReferenceURLs(el.innerHTML);
                    break;
                }
            }

            return temp.innerHTML;
        });
        temp.remove();
        return [bibmeta, payload];
    }

}
