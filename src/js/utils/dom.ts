interface SelectorData {
    element?: keyof HTMLElementTagNameMap;
    id?: string;
    classNames?: string[];
    attributes?: Record<string, string | number | boolean>;
}

export function createSelector(...selectors: SelectorData[]): string {
    return selectors
        .map(({ element, id, classNames = [], attributes = {} }) => {
            let selector = '';
            if (element) {
                selector += `${element}`;
            }
            if (id) {
                selector += `#${id}`;
            }
            for (const cls of classNames) {
                selector += `.${cls}`;
            }
            for (const [k, v] of Object.entries(attributes)) {
                if (typeof v === 'boolean') {
                    selector += v ? `[${k}]` : '';
                } else {
                    selector += `[${k}="${v}"]`;
                }
            }
            return selector;
        })
        .join();
}

export function getJSONScriptData<T>(id: string): T {
    const selector = createSelector({
        element: 'script',
        id,
        attributes: { type: 'application/json' },
    });
    const script = document.querySelector<HTMLScriptElement>(selector);
    if (!script) {
        throw new Error(`Unable to retrieve JSON data using ID "${id}"`);
    }
    return JSON.parse(script.innerHTML);
}
