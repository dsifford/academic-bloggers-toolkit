import { Map, List } from 'immutable';

declare var CSL;

export class CSLProcessor {

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
    private locale: string;

    public style: string;
    public state: Immutable.Map<
        string, (Immutable.Map<string, {}> | Immutable.List<{}>)
    >;
    public citeproc;

    /**
     * @param locale Locale string passed in from WordPress.
     * @param style  Selected citation style (chosen on options page).
     */
    constructor(locale: string, style: string) {
        this.state = Map({
            citations: Map({}),
            citationIDs: List([]),
        });
        this.style = style === '' ? 'american-medical-association' : style;
        this.locale = locale;

        this.init(this.style).then(data => {
            if (data instanceof Error) {
                console.error(data.message);
                return;
            }
            this.citeproc = new CSL.Engine(data.sys, data.style);
        });
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
                        retrieveItem: (id: string|number) => this.state.getIn(['citations', id]),
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
    init(styleID: string): Promise<{style: string, sys: Citeproc.SystemObj}|Error> {
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
        .catch(e => e);
    }

    /**
     * Updates the Citeproc object and the local state with new citation data.
     * @param citations Array of CSL.Data.
     */
    consumeCitations(citations: CSL.Data[]): void {
        citations.forEach(c => {
            this.state = this.state.setIn(['citations', c.id], c);
            this.state = this.state.updateIn(['citationIDs'], arr => arr.push(c.id));
        });
        this.citeproc.updateItems(this.state.toJS().citationIDs);
    }

    /**
     * Either retrieves a Citeproc.CitationByIndexSingle object from the citeproc
     *   registry or, if it doesn't exist in the registry, transforms the CSL.Data[]
     *   param into that shape.
     * @param currentIndex The current inline-citation's index.
     * @param csl Fallback CSL.Data[].
     * @return Citeproc.CitationByIndexSingle for the current inline citation.
     */
    getSingleCitationData(currentIndex: number, csl: CSL.Data[]): Citeproc.CitationByIndexSingle {
        let payload: Citeproc.CitationByIndexSingle = this.citeproc.registry.citationreg.citationByIndex[currentIndex];
        if (!payload) {
            payload = {
                citationItems: [],
                properties: { noteIndex: 0 },
            };
            csl.forEach((c) => payload.citationItems.push({id: c.id}));
        }
        return payload;
    }

    /** TODO */
    testing(citationSingle: Citeproc.CitationByIndexSingle, citationsBefore: Citeproc.CitationsPrePost, citationsAfter: Citeproc.CitationsPrePost): any {
        return this.citeproc.processCitationCluster(citationSingle, citationsBefore, citationsAfter);
    }


}
