
/**
 * Global Event Types
 */
export const EVENTS = {
    INSERT_REFERENCE: 'INSERT_REFERENCE',
    OPEN_REFERENCE_WINDOW: 'OPEN_REFERENCE_WINDOW',
    REFERENCE_ADDED: 'REFERENCE_ADDED',
    TINYMCE_HIDDEN: 'TINYMCE_HIDDEN',
    TINYMCE_READY: 'TINYMCE_READY',
    TINYMCE_VISIBLE: 'TINYMCE_VISIBLE',
    TOGGLE_PINNED_STATE: 'TOGGLE_PINNED_STATE',
};

/**
 * Object containing event types that are used in the ReferenceWindow component.
 * @type {Object}
 */
export const referenceWindowEvents = {
    ADD_PERSON: 'ADD_PERSON',
    CHANGE_CITATION_STYLE: 'CHANGE_CITATION_STYLE',
    CHANGE_CITATION_TYPE: 'CHANGE_CITATION_TYPE',
    IDENTIFIER_FIELD_CHANGE: 'IDENTIFIER_FIELD_CHANGE',
    META_FIELD_CHANGE: 'META_FIELD_CHANGE',
    PERSON_CHANGE: 'PERSON_CHANGE',
    PUBMED_DATA_SUBMIT: 'PUBMED_DATA_SUBMIT',
    REMOVE_PERSON: 'REMOVE_PERSON',
    TOGGLE_INCLUDE_LINK: 'TOGGLE_INCLUDE_LINK',
    TOGGLE_INLINE_ATTACHMENT: 'TOGGLE_INLINE_ATTACHMENT',
    TOGGLE_MANUAL: 'TOGGLE_MANUAL',
};

/**
 * Empty object for holding the field data for manual input
 * @note - The following fields were skipped:
 *   - type
 *   - categories
 *   - Person Fields (author, collection-editor, composer, container-author,
 *     director, editor, editorial-director, interfiewer, illustrator,
 *     original-author, recipient, reviewed-author, translator)
 *   - Date Fields (container, original-date, submitted)
 *   - abstract
 *   - annote
 *   - archive-location
 *   - archive-place
 *   - dimensions
 *   - first-reference-note-number
 *   - keyword
 *   - locator
 *   - note
 *   - references
 *   - reviewed-title
 *   - scale
 *
 * @type {Object}
 */
export const manualDataObj: CSL.Data = {
    DOI: '',
    ISBN: '',
    ISSN: '',
    PMCID: '',
    PMID: '',
    URL: '',
    accessed: '',
    authority: '',
    'call-number': '',
    'chapter-number': '',
    'citation-label': '',
    'citation-number': '',
    'collection-number': '',
    'collection-title': '',
    'container-title': '',
    'container-title-short': '',
    edition: '',
    event: '',
    'event-date': '',
    'event-place': '',
    genre: '',
    id: '0',
    issue: '',
    issued: '',
    journalAbbreviation: '',
    jurisdiction: '',
    language: '',
    medium: '',
    number: '',
    'number-of-pages': '',
    'number-of-volumes': '',
    'original-publisher': '',
    'original-publisher-place': '',
    'original-title': '',
    page: '',
    'page-first': '',
    publisher: '',
    'publisher-place': '',
    section: '',
    shortTitle: '',
    source: '',
    status: '',
    title: '',
    'title-short': '',
    type: 'article-journal',
    version: '',
    volume: '',
    'year-suffix': '',
};

/**
 * This object converts the locale names in wordpress or PubMed (keys) to the locales
 *   in CSL (values). If CSL doesn't have a locale for a given WordPress locale,
 *   then false is used (which will default to en-US).
 */
export const localeMapper = {
    af: 'af-ZA',
    'af-ZA': 'af-ZA',
    afr: 'af-ZA',
    ak: false,
    alb: false,
    am: false,
    amh: false,
    ar: 'ar-AR',
    'ar-AR': 'ar-AR',
    ara: 'ar-AR',
    arm: false,
    arq: 'ar-AR',
    art_xemoji: 'ar-AR',
    ary: 'ar-AR',
    as: 'en-US',
    az: 'tr-TR',
    az_TR: 'tr-TR',
    azb: 'en-US',
    ba: false,
    bal: false,
    bcc: false,
    bel: false,
    ben: false,
    'bg-BG': 'bg-BG',
    bg_BG: 'bg-BG',
    bn_BD: 'en-US',
    bo: false,
    bos: false,
    bre: false,
    bs_BA: false,
    bul: 'bg-BG',
    ca: 'ca-AD',
    'ca-AD': 'ca-AD',
    cat: 'ca-AD',
    ceb: false,
    chi: 'zh-CN',
    ckb: false,
    co: false,
    'cs-CZ': 'cs-CZ',
    cs_CZ: 'cs-CZ',
    cy: 'cy-GB',
    cze: 'cs-CZ',
    'da-DK': 'da-DK',
    da_DK: 'da-DK',
    dan: 'da-DK',
    'de-AT': 'de-AT',
    'de-CH': 'de-CH',
    'de-DE': 'de-DE',
    de_CH: 'de-CH',
    de_DE: 'de-DE',
    dut: 'nl-NL',
    dv: false,
    dzo: false,
    el: 'el-GR',
    'el-GR': 'el-GR',
    'en-GB': 'en-GB',
    'en-US': 'en-US',
    en_AU: 'en-US',
    en_CA: 'en-US',
    en_GB: 'en-GB',
    en_NZ: 'en-US',
    en_US: 'en-US',
    en_ZA: 'en-US',
    eng: 'en-US',
    eo: false,
    epo: false,
    'es-CL': 'es-CL',
    'es-ES': 'es-ES',
    'es-MX': 'es-MX',
    es_AR: 'es-ES',
    es_CL: 'es-CL',
    es_CO: 'es-CL',
    es_ES: 'es-ES',
    es_GT: 'es-ES',
    es_MX: 'es-MX',
    es_PE: 'es-CL',
    es_PR: 'es-CL',
    es_VE: 'es-CL',
    est: 'et-ET',
    et: 'et-ET',
    'et-ET': 'et-ET',
    eu: 'eu',
    'fa-IR': 'fa-IR',
    fa_AF: 'fa-IR',
    fa_IR: 'fa-IR',
    fi: 'fi-FI',
    'fi-FI': 'fi-FI',
    fin: 'fi-FI',
    fo: false,
    'fr-CA': 'fr-CA',
    'fr-FR': 'fr-FR',
    fr_BE: 'fr-FR',
    fr_CA: 'fr-CA',
    fr_FR: 'fr-FR',
    fre: 'fr-FR',
    frp: false,
    fuc: false,
    fur: false,
    fy: false,
    ga: false,
    gd: false,
    geo: false,
    ger: 'de-DE',
    gl_ES: false,
    gla: false,
    gn: false,
    gre: 'el-GR',
    gsw: 'de-CH',
    gu: false,
    haw_US: 'en-US',
    haz: false,
    'he-IL': 'he-IL',
    he_IL: 'he-IL',
    heb: 'he-IL',
    hi_IN: false,
    hin: false,
    hr: 'hr-HR',
    'hr-HR': 'hr-HR',
    hrv: 'hr-HR',
    'hu-HU': 'hu-HU',
    hu_HU: 'hu-HU',
    hun: 'hu-HU',
    hy: false,
    ice: 'is-IS',
    'id-ID': 'id-ID',
    id_ID: 'id-ID',
    ido: false,
    ind: 'id-ID',
    'is-IS': 'is-IS',
    is_IS: 'is-IS',
    'it-IT': 'it-IT',
    it_IT: 'it-IT',
    ita: 'it-IT',
    ja: 'ja-JP',
    'ja-JP': 'ja-JP',
    jpn: 'ja-JP',
    jv_ID: false,
    ka_GE: false,
    kab: false,
    kal: false,
    kin: false,
    kk: false,
    km: 'km-KH',
    'km-KH': 'km-KH',
    kn: false,
    'ko-KR': 'ko-KR',
    ko_KR: 'ko-KR',
    kor: 'ko-KR',
    ky_KY: false,
    lat: false,
    lav: 'lv-LV',
    lb_LU: 'lt-LT',
    li: false,
    lin: false,
    lit: 'lt-LT',
    lo: false,
    'lt-LT': 'lt-LT',
    lt_LT: 'lt-LT',
    lv: 'lv-LV',
    'lv-LV': 'lv-LV',
    mac: false,
    mao: false,
    may: false,
    me_ME: false,
    mg_MG: false,
    mk_MK: false,
    ml_IN: false,
    mn: 'mn-MN',
    'mn-MN': 'mn-MN',
    mr: false,
    mri: false,
    ms_MY: false,
    mul: false,
    my_MM: false,
    'nb-NO': 'nb-NO',
    nb_NO: 'nb-NO',
    ne_NP: false,
    'nl-NL': 'nl-NL',
    nl_BE: 'nl-NL',
    nl_NL: 'nl-NL',
    'nn-NO': 'nn-NO',
    nn_NO: 'nn-NO',
    nor: 'nn-NO',
    oci: false,
    ory: false,
    os: false,
    pa_IN: false,
    per: 'fa-IR',
    'pl-PL': 'pl-PL',
    pl_PL: 'pl-PL',
    pol: 'pl-PL',
    por: 'pt-PT',
    ps: false,
    'pt-BR': 'pt-BR',
    'pt-PT': 'pt-PT',
    pt_BR: 'pt-PR',
    pt_PT: 'pt-PT',
    rhg: false,
    'ro-RO': 'ro-RO',
    ro_RO: 'ro-RO',
    roh: false,
    'ru-RU': 'ru-RU',
    ru_RU: 'ru-RU',
    rue: false,
    rum: 'ro-RO',
    rup_MK: false,
    rus: 'ru-RU',
    sa_IN: false,
    sah: false,
    san: false,
    si_LK: false,
    'sk-SK': 'sk-SK',
    sk_SK: 'sk-SK',
    'sl-SI': 'sl-SI',
    sl_SI: 'sl-SI',
    slo: 'sk-SK',
    slv: 'sl-SI',
    snd: false,
    so_SO: false,
    spa: 'es-ES',
    sq: false,
    'sr-RS': 'sr-RS',
    sr_RS: 'sr-RS',
    srd: false,
    srp: 'sr-RS',
    su_ID: false,
    'sv-SE': 'sv-SE',
    sv_SE: 'sv-SE',
    sw: false,
    swe: 'sv-SE',
    szl: false,
    ta_IN: false,
    ta_LK: false,
    tah: false,
    te: false,
    tg: false,
    th: 'th-TH',
    'th-TH': 'th-TH',
    tha: 'th-TH',
    tir: false,
    tl: false,
    'tr-TR': 'tr-TR',
    tr_TR: 'tr-TR',
    tt_RU: false,
    tuk: false,
    tur: 'tr-TR',
    twd: false,
    tzm: false,
    ug_CN: false,
    uk: 'uk-UA',
    'uk-UA': 'uk-UA',
    ukr: 'uk-UA',
    und: false,
    ur: false,
    urd: false,
    uz_UZ: false,
    vi: 'vi-VN',
    'vi-VN': 'vi-VN',
    vie: 'vi-VN',
    wa: false,
    wel: false,
    xmf: false,
    yor: false,
    'zh-CN': 'zh-CN',
    'zh-TW': 'zh-TW',
    zh_CN: 'zh-CN',
    zh_HK: 'zh-CN',
    zh_TW: 'zh-TW',
};
