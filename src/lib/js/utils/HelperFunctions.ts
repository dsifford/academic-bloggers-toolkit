import { localeMapper } from './Constants';
import { ObservableMap } from 'mobx';

/**
 * Creates a "unique" ID value to be used for an ID field.
 * @return {string}  Unique ID.
 */
export function generateID(): string {
    return Math.round(Math.random() * Date.now()).toString(30); // tslint:disable-line
}

/**
 * Responsible for parsing RIS or PubMed fields containing names into the correct
 *   shape for CSL.
 *
 * Shape of PubMed string   => Lastname FM
 * Shape of CrossRef string => Lastname, Firstname M
 *
 * @param  {string} input          Raw, unformatted name
 * @param  {'RIS'|'pubmed'} source Source of the name field
 * @return {CSL.Person}            Formatted CSL.Person object
 */
export function processCSLName(input: string, source: 'RIS'|'pubmed'): CSL.Person {

    let family: string;
    let given: string;

    switch (source) {
        case 'RIS':
            let splitName = input.split(', ');
            if (splitName.length === 1) {
                return { literal: input };
            }
            family = splitName[0];
            given = splitName[1];
            break;
        case 'pubmed':
        default:
            family = input.split(' ')[0];
            given = input.split(' ')[1];
            break;
    }

    return { family, given };
}

/**
 * Takes a RIS or PubMed date string as input and returns a CSL.Date object.
 *
 * A RIS date string has the following shape: `YYYY/MM/DD/OtherInfo`
 * A PubMed date string has the following shape: `1975/12/01 00:00`
 *
 * @param  {string} input           Date string
 * @param  {'RIS'|'pubmed'} source  Source of the input
 * @return {CSL.Date}               Formatted CSL.Date object
 */
export function processCSLDate(input: string, source: 'RIS'|'pubmed'): CSL.Date {

    const date: CSL.Date = { 'date-parts': [[]] };
    if (input.length === 0) { return date; }

    switch (source) {
        case 'RIS':
            input.split('/').forEach((part: string, i: number) => {
                if (!part) { return; }
                if (i === 3 && part.search(/(winter|spring|summer|fall)/i) > -1) {
                    date.season = part;
                    return;
                }
                date['date-parts'][0][i] = part;
            });
            break;
        case 'pubmed':
        default:
            date['date-parts'][0] = input.substr(0, 10).split('/');
            break;
    }

    return date;
}

/**
 * Takes the raw response from pubmed and processes it into CSL.
 *
 * @note The following response fields were skipped:
 *   - articleids // skipped in favor of `uid`
 *   - attributes
 *   - doccontriblist
 *   - docdate
 *   - doctype
 *   - elocationid
 *   - epubdate
 *   - essn
 *   - history
 *   - locationlabel
 *   - nlmuniqueid
 *   - pmcrefcount
 *   - pubdate // skipped in favor of `sortpubdate`
 *   - pubstatus
 *   - pubtype
 *   - recordstatus
 *   - references
 *   - srccontriblist
 *   - srcdate
 *   - vernaculartitle
 *   - viewcount
 *
 * @param {PubMed.SingleReference[]} res  Pubmed api response
 * @return CSL.Data[]
 */
export function processPubmedJSON(res: PubMed.SingleReference[]): CSL.Data[] {
    const payload: CSL.Data[] = [];

    res.forEach((ref: PubMed.SingleReference, i: number) => {

        const output: CSL.Data = {};
        output.id = `${i}`;
        output.type = 'article-journal';
        output.author = [];

        Object.keys(ref).forEach(key => {

            if (typeof ref[key] === 'string' && ref[key] === '') { return; }

            switch (key) {
                case 'authors':
                    ref[key].forEach(author => {
                        output.author.push(processCSLName(author.name, 'pubmed'));
                    });
                    break;
                case 'availablefromurl':
                    output.URL = ref[key];
                    break;
                case 'bookname':
                case 'booktitle':
                    output.title = ref[key];
                    break;
                case 'chapter':
                    output['chapter-number'] = ref[key];
                    break;
                case 'edition':
                    output.edition = ref[key];
                    break;
                case 'fulljournalname':
                    output['container-title'] = ref[key];
                    break;
                case 'issn':
                    output.ISSN = ref[key];
                    break;
                case 'issue':
                    output.issue = ref[key];
                    break;
                case 'lang':
                    output.language = localeMapper[ref[key][0]]
                        ? localeMapper[ref[key][0]]
                        : 'en-US';
                    break;
                case 'medium':
                    output.medium = ref[key];
                    break;
                case 'pages':
                    output.page = ref[key];
                    break;
                case 'publisherlocation':
                    output['publisher-place'] = ref[key];
                    break;
                case 'publishername':
                    output.publisher = ref[key];
                    break;
                case 'reportnumber':
                    output.number = ref[key];
                    break;
                case 'sortpubdate':
                    output.issued = processCSLDate(ref[key], 'pubmed');
                    break;
                case 'source':
                    output.journalAbbreviation = ref[key];
                    output['container-title-short'] = ref[key];
                    break;
                case 'title':
                    output.title = ref[key];
                    break;
                case 'uid':
                    output.PMID = ref[key];
                    break;
                case 'volume':
                    output.volume = ref[key];
                    break;
                default:
                    break;
            }
        });

        payload.push(output);
    });

    return payload;
}

/**
 * Wrapper function for citeproc.makeBibliography that takes the output and
 *   inlines CSS classes that are appropriate for the style (according to the
 *   generated bibmeta).
 *
 * @param {'always'|'urls'|'never'} links   Link format
 * @param {Citeproc.Bibliography} rawBib    Raw output from citeproc.makeBibliography()
 * @return {ABT.Bibliography}
 */
export function formatBibliography(
    rawBib: Citeproc.Bibliography,
    links: ABT.LinkStyle,
    CSL: ObservableMap<CSL.Data>,
): ABT.Bibliography {
    const [bibmeta, bibHTML] = rawBib;
    const temp = document.createElement('DIV');

    const payload: {id: string, html: string}[] = bibHTML.map((html, i) => {

        if (/CSL STYLE ERROR/.test(html)) {
            return { html, id: bibmeta.entry_ids[i][0] };
        }

        temp.innerHTML = html;

        /**
         * The outermost <div> element -> (class="csl-entry")
         */
        const el = <HTMLDivElement>temp.firstElementChild;
        const item: CSL.Data = CSL.get(bibmeta.entry_ids[i][0]);

        if (bibmeta.hangingindent) {
            el.classList.add('hanging-indent');
        }

        if (bibmeta.entryspacing > 1) {
            el.style.lineHeight = `${bibmeta.entryspacing}`;
        }

        if (bibmeta.linespacing > 1) {
            el.style.margin = `${bibmeta.linespacing - 1}em auto`;
        }

        switch (bibmeta['second-field-align']) {
            case 'margin':
                el.classList.add('margin');
                break;
            case 'flush':
                el.classList.add('flush');
                break;
            default:
                break;
        }

        const innerEl = el.querySelector('.csl-right-inline') || el;
        const innerHTML = innerEl.innerHTML;
        switch (true) {
            case item.PMID !== undefined && ! new RegExp(item.PMID).test(innerHTML): {
                innerEl.innerHTML = parseReferenceURL(innerHTML, links, { kind: 'PMID', value: item.PMID });
                break;
            }
            case item.DOI !== undefined && ! new RegExp(item.DOI).test(innerHTML): {
                innerEl.innerHTML = parseReferenceURL(innerHTML, links, { kind: 'DOI', value: item.DOI });
                break;
            }
            case item.PMCID !== undefined && ! new RegExp(item.PMCID).test(innerHTML): {
                innerEl.innerHTML = parseReferenceURL(innerHTML, links, { kind: 'PMCID', value: item.PMCID });
                break;
            }
            case item.URL !== undefined && ! new RegExp(item.URL).test(innerHTML) && ! /https?:\/\/(?:www\.)?(?:dx\.)?doi.org\//.test(item.URL): { // tslint:disable-line
                innerEl.innerHTML = parseReferenceURL(innerHTML, links, { kind: 'URL', value: item.URL });
                break;
            }
            default: {
                innerEl.innerHTML = parseReferenceURL(innerHTML, links);
                break;
            }
        }

        return { html: temp.innerHTML, id: bibmeta.entry_ids[i][0] };
    });
    temp.remove();
    return payload;
}

/**
 * Parses and formats the bibliography links according to the user's chosen
 *   link format.
 * @param  {string} html                    HTML string of a single reference
 * @param  {ABT.LinkStyle} linkStyle        Selected link style
 * @param  {'PMID'|'DOI'|'PMCID'|'URL'} id  Identifier for linking out
 * @return {string}  HTML string with formatted links
 */
export function parseReferenceURL(
    html: string,
    linkStyle: ABT.LinkStyle,
    id?: { kind: 'PMID'|'DOI'|'PMCID'|'URL', value: string },
): string {

    if (linkStyle === 'never') return html;

    const url: RegExp = /((http:\/\/(?:www\.)?|https:\/\/(?:www\.)?)|www\.)([^;\s<]+[0-9a-zA-Z\/])/g;
    const doi: RegExp = /doi:(\S+)\./g;

    const linkedHtml = html
        .replace(/(&lt;|&amp;|&gt;|&quot;)/g, (match) => {
            switch (match) {
                case '&lt;':
                    return '<';
                case '&gt;':
                    return '>';
                case '&amp;':
                    return '&';
                case '&quot;':
                default:
                    return '"';
            }
        })
        .replace(url, (_match, _p1, p2 = 'http://', p3) => `<a href="${p2}${p3}" target="_blank">${p2}${p3}</a>`)
        .replace(doi, 'doi: <a href="https://dx.doi.org/$1" target="_blank">$1</a>');

    if (!id) return linkedHtml;

    switch (linkStyle) {
        case 'always': {
            switch (id.kind) {
                case 'PMID': {
                    return linkedHtml +
                        `<span class="abt-url"> ` +
                            `[<a href="http://www.ncbi.nlm.nih.gov/pubmed/${id.value}" target="_blank">PubMed</a>]` +
                        `</span>`;
                }
                case 'DOI': {
                    return linkedHtml +
                        `<span class="abt-url"> ` +
                            `[<a href="https://dx.doi.org/${id.value}" target="_blank">Source</a>]` +
                        `</span>`;
                }
                case 'PMCID': {
                    return linkedHtml +
                        `<span class="abt-url"> ` + // tslint:disable-next-line
                            `[<a href="http://www.ncbi.nlm.nih.gov/pmc/articles/${id.value}" target="_blank">PMC</a>]` +
                        `</span>`;
                }
                case 'URL':
                default: {
                    return linkedHtml +
                        `<span class="abt-url"> ` +
                            `[<a href="${id.value}" target="_blank">Source</a>]` +
                        `</span>`;
                }
            }
        }
        case 'always-full-surround': {
            switch (id.kind) {
                case 'PMID': {
                    return `<a href="http://www.ncbi.nlm.nih.gov/pubmed/${id.value}" target="_blank">${html}</a>`;
                }
                case 'DOI': {
                    return `<a href="https://dx.doi.org/${id.value}" target="_blank">${html}</a>`;
                }
                case 'PMCID': {
                    return `<a href="http://www.ncbi.nlm.nih.gov/pmc/articles/${id.value}" target="_blank">${html}</a>`;
                }
                case 'URL':
                default: {
                    return `<a href="${id.value}" target="_blank">${html}</a>`;
                }
            }
        }
        case 'urls':
        default: {
            return linkedHtml;
        }
    }
}

/**
 * Prevents the wheel event from bubbling through to parent elements.
 *
 * In order for this function to work, the component of interest's "this" must
 *   be bound and there must be an "element" property in the component.
 * @param {WheelEvent} e React Wheel Event
 * @return {void}
 */
export function preventScrollPropagation(e): void {
    e.stopPropagation();
    const atTopAndScrollingUp: boolean = this.element.scrollTop === 0 && e.deltaY < 0; // tslint:disable-line
    const atBottomAndScollingDown: boolean =
        ((this.element.scrollTop + this.element.offsetHeight) === this.element.scrollHeight) // tslint:disable-line
        && e.deltaY > 0;
    if (atTopAndScrollingUp || atBottomAndScollingDown) {
        e.preventDefault();
    }
}
