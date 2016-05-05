
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

        let p1 = new Promise((resolve, reject) => {
            this.getLocale(locale, (data: string) => {
                resolve({
                    retrieveLocale: (lang) => data,
                    retrieveItem: (id: string | number) => this.citations[id],
                });
            });
        });

        p1.then((data: Citeproc.SystemObj) => {
            this.citeprocSys = data;
            this.getProcessor(style, data, callback);
        });

    }

    /**
     * Retrieves the locale rules for CSL using HTTP and passes it to a callback function.
     * @param {string}   locale   The user's locale.
     * @param {Function} callback Callback function.
     */
    getLocale(locale: string, callback: Function): void {
        let req = new XMLHttpRequest();

        let cslLocale = this.locales[locale];
        if (typeof cslLocale === 'boolean') {
            locale = 'en-US';
        }
        else {
            locale = cslLocale;
        }

        req.onreadystatechange = () => {
            if (req.readyState === 4) {
                callback(req.responseText);
            }
        };

        req.open('GET', `https://raw.githubusercontent.com/citation-style-language/locales/8c976408d3cb287d0cecb29f97752ec3a28db9e5/locales-${locale}.xml`);
        req.send(null);
    }

    /**
     * Retrieves the CSL style rules for the selected style using HTTP. When the
     *   style instructions are received, a CSL.Engine is created and passed to
     *   the callback function.
     * @param  {string}   styleID  The style ID for the style of interest (no .csl extension)
     * @param  {Function} callback Callback function.
     */
    getProcessor(styleID: string, data: Citeproc.SystemObj, callback: Function): void {
        let req = new XMLHttpRequest();
        req.open('GET', `https://raw.githubusercontent.com/citation-style-language/styles/master/${styleID}.csl`);

        req.onreadystatechange = () => {
            if (req.readyState === 4) {
                let citeproc = new CSL.Engine(data, req.responseText);
                callback(citeproc);
            }
        };

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
     * Removes outer HTML formatting served from citeproc, sparing inner `<i>` or `<a>` tags.
     * @param  {string} ref The reference payload from citeproc.
     * @return {string}     A formatted reference string without outer HTML.
     */
    trimHTML(ref: string): string {
        return ref
            .replace(/<(?!(i|\/i|a|\/a)).+?>/g, '')
            .trim()
            .replace(/^\d+\.\s?/, '');
    }

    /**
     * This object converts the locale names in wordpress (keys) to the locales
     *   in CSL (values). If CSL doesn't have a locale for a given WordPress locale,
     *   then false is used (which will default to en-US).
     */
    private locales: {[wp: string]: string|boolean} = {
        'af': 'af-ZA',
        'ak': false,
        'am': false,
        'ar': 'ar',
        'arq': 'ar',
        'art_xemoji': 'ar',
        'ary': 'ar',
        'as': 'en-US',
        'az_TR': 'tr-TR',
        'az': 'tr-TR',
        'azb': 'en-US',
        'ba': false,
        'bal': false,
        'bcc': false,
        'bel': false,
        'bg_BG': 'bg-BG',
        'bn_BD': 'en-US',
        'bo': false,
        'bre': false,
        'bs_BA': false,
        'ca': 'ca-AD',
        'ceb': false,
        'ckb': false,
        'co': false,
        'cs_CZ': 'cs-CZ',
        'cy': 'cy-GB',
        'da_DK': 'da-DK',
        'de_CH': 'de-CH',
        'de_DE': 'de-DE',
        'dv': false,
        'dzo': false,
        'el': 'el-GR',
        'en_AU': 'en-US',
        'en_CA': 'en-US',
        'en_GB': 'en-GB',
        'en_NZ': 'en-US',
        'en_US': 'en-US',
        'en_ZA': 'en-US',
        'eo': false,
        'es_AR': 'es-ES',
        'es_CL': 'es-CL',
        'es_CO': 'es-CL',
        'es_ES': 'es-ES',
        'es_GT': 'es-ES',
        'es_MX': 'es-MX',
        'es_PE': 'es-CL',
        'es_PR': 'es-CL',
        'es_VE': 'es-CL',
        'et': 'et-ET',
        'eu': 'eu',
        'fa_AF': 'fa-IR',
        'fa_IR': 'fa-IR',
        'fi': 'fi-FI',
        'fo': false,
        'fr_BE': 'fr-FR',
        'fr_CA': 'fr-CA',
        'fr_FR': 'fr-FR',
        'frp': false,
        'fuc': false,
        'fur': false,
        'fy': false,
        'ga': false,
        'gd': false,
        'gl_ES': false,
        'gn': false,
        'gsw': 'de-CH',
        'gu': false,
        'haw_US': 'en-US',
        'haz': false,
        'he_IL': 'he-IL',
        'hi_IN': false,
        'hr': 'hr-HR',
        'hu_HU': 'hu-HU',
        'hy': false,
        'id_ID': 'id-ID',
        'ido': false,
        'is_IS': 'is-IS',
        'it_IT': 'it-IT',
        'ja': 'ja-JP',
        'jv_ID': false,
        'ka_GE': false,
        'kab': false,
        'kal': false,
        'kin': false,
        'kk': false,
        'km': 'km-KH',
        'kn': false,
        'ko_KR': 'ko-KR',
        'ky_KY': false,
        'lb_LU': 'lt-LT',
        'li': false,
        'lin': false,
        'lo': false,
        'lt_LT': 'lt-LT',
        'lv': 'lv-LV',
        'me_ME': false,
        'mg_MG': false,
        'mk_MK': false,
        'ml_IN': false,
        'mn': 'mn-MN',
        'mr': false,
        'mri': false,
        'ms_MY': false,
        'my_MM': false,
        'nb_NO': 'nb-NO',
        'ne_NP': false,
        'nl_BE': 'nl-NL',
        'nl_NL': 'nl-NL',
        'nn_NO': 'nn-NO',
        'oci': false,
        'ory': false,
        'os': false,
        'pa_IN': false,
        'pl_PL': 'pl-PL',
        'ps': false,
        'pt_BR': 'pt-PR',
        'pt_PT': 'pt-PT',
        'rhg': false,
        'ro_RO': 'ro-RO',
        'roh': false,
        'ru_RU': 'ru-RU',
        'rue': false,
        'rup_MK': false,
        'sa_IN': false,
        'sah': false,
        'si_LK': false,
        'sk_SK': 'sk-SK',
        'sl_SI': 'sl-SI',
        'snd': false,
        'so_SO': false,
        'sq': false,
        'sr_RS': 'sr-RS',
        'srd': false,
        'su_ID': false,
        'sv_SE': 'sv-SE',
        'sw': false,
        'szl': false,
        'ta_IN': false,
        'ta_LK': false,
        'tah': false,
        'te': false,
        'tg': false,
        'th': 'th-TH',
        'tir': false,
        'tl': false,
        'tr_TR': 'tr-TR',
        'tt_RU': false,
        'tuk': false,
        'twd': false,
        'tzm': false,
        'ug_CN': false,
        'uk': 'uk-UA',
        'ur': false,
        'uz_UZ': false,
        'vi': 'vi-VN',
        'wa': false,
        'xmf': false,
        'yor': false,
        'zh_CN': 'zh-CN',
        'zh_HK': 'zh-CN',
        'zh_TW': 'zh-TW',
    };


}
