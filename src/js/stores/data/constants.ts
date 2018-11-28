export const enum Actions {
    ADD_REFERENCE = 'ADD_REFERENCE',
    DELETE_REFERENCE = 'DELETE_REFERENCE',
    SET_DISPLAY_OPTIONS = 'SET_DISPLAY_OPTIONS',
    SET_LOCALE = 'SET_LOCALE',
    SET_STYLE = 'SET_STYLE',
}

export const enum BibFormat {
    FIXED = 'fixed',
    TOGGLE = 'toggle',
}

export const enum HeadingLevel {
    H1 = 'h1',
    H2 = 'h2',
    H3 = 'h3',
    H4 = 'h4',
    H5 = 'h5',
    H6 = 'h6',
}

export const enum LinkFormat {
    ALWAYS = 'always',
    ALWAYS_ALT = 'always-full-surround',
    URLS = 'urls',
    NEVER = 'never',
}

export const enum StyleKind {
    PREDEFINED = 'predefined',
    CUSTOM = 'custom',
}
