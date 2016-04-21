
declare var CSL; 

export class CSLPreprocessor {

    public citeprocSys: Citeproc.SystemObj;
    public citations: { [id: string]: CSL.Data };

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

    getProcessor(styleID: string, callback: Function) {
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

}
