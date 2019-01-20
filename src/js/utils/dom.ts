export function getJSONScriptData<T>(id: string): T {
    const script = document.querySelector<HTMLScriptElement>(
        `script[type="application/json"]#${id}`,
    );
    if (!script) {
        throw new Error(`Unable to retrieve JSON data using ID "${id}"`);
    }
    return JSON.parse(script.innerHTML);
}
