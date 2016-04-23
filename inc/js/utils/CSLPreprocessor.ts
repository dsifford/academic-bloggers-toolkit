
declare var CSL;

export class CSLPreprocessor {

    public citeprocSys: Citeproc.SystemObj;
    public citations: { [id: string]: CSL.Data };

    /**
     * Constructor for the CSLPreprossor class.
     * @param  {string}  locale  The current user's locale string.
     * @param  {{[id: string]:CSL.Data}}  citations  An object of CSL.Data.
     *   Note, the object key MUST match the `id` param within the object.
     * @param  {string}   style  The user's selected style string.
     * @param  {Function} callback  Callback function
     * @return {void}
     */
    constructor(locale: string, citations: { [id: string]: CSL.Data }, style: string, callback: Function) {

        this.citations = citations;

        this.getLocale(locale, (data: string) => {

            this.citeprocSys = {
                retrieveLocale: (lang) => data,
                retrieveItem: (id: string|number) => this.citations[id],
            };

            this.getProcessor(style, callback);
        });

    }

    /**
     * Retrieves the locale rules for CSL using HTTP and passes it to a callback function.
     * @param {string}   locale   The user's locale.
     * @param {Function} callback Callback function.
     */
    getLocale(locale: string, callback: Function): void {
        let req = new XMLHttpRequest();

        req.onreadystatechange = () => {
            if (req.readyState === 4) {
                callback(req.responseText);
            }
        };

        req.open("GET", `https://raw.githubusercontent.com/citation-style-language/locales/8c976408d3cb287d0cecb29f97752ec3a28db9e5/locales-${locale}.xml`);
        req.send(null);
    }

    /**
     * Retrieves the CSL style rules for the selected style using HTTP. When the
     *   style instructions are received, a CSL.Engine is created and passed to
     *   the callback function.
     * @param  {string}   styleID  The style ID for the style of interest (no .csl extension)
     * @param  {Function} callback Callback function.
     */
    getProcessor(styleID: string, callback: Function): void {
        let req = new XMLHttpRequest();
        req.open('GET', `https://raw.githubusercontent.com/citation-style-language/styles/master/${styleID}.csl`);

        req.onreadystatechange = () => {
            if (req.readyState === 4) {
                let citeproc = new CSL.Engine(this.citeprocSys, req.responseText);
                callback(citeproc);
            }
        }

        req.send(null);
    }

    /**
     * Receives the response object from `getProcessor`, makes the bibliography,
     *   removes outer HTML, pushes it to an array, and returns the array.
     * @param  {Object}   citeproc The citeproc engine.
     * @return {string[]}          Array of citations to be served.
     */
    prepare(citeproc): string[] {
        citeproc.updateItems(Object.keys(this.citations));
        let bib = citeproc.makeBibliography();

        let data = [];
        bib[1].forEach(ref => {
            data.push(this.trimHTML(ref));
        });
        return data;
    }

    /**
     * Removes outer HTML formatting served from citeproc, sparing inner `<i>` tags.
     * @param  {string} ref The reference payload from citeproc.
     * @return {string}     A formatted reference string without outer HTML.
     */
    trimHTML(ref: string): string {
        return ref
            .replace(/<(?!(i|\/i)).+?>/g, '')
            .trim()
            .replace(/^\d+\.\s/, '');
    }

}
