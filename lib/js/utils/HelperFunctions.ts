
/**
 * Takes an array of reference strings and makes the following replacements to each
 *   reference:
 *   - Any URL => wrapped with an anchor tag (to make clickable).
 *   - DOIs => wrapped with an anchor tag (link to DOI.org resolver).
 * @param  {string[]} input Array of reference strings.
 * @return {string[]}       Array of reference strings with parsed links.
 */
export function parseReferenceURLs(input: string): string {
    const url: RegExp = /((http:\/\/|https:\/\/|www.)(www.)?[^;\s]+[0-9a-zA-Z\/])/g;
    const doi: RegExp = /doi:(\S+)\./g;
    let match: RegExpExecArray;
    const replacements: [string, string][] = [];


    while ((match = url.exec(input)) !== null) {
        if (match[0].search(/^www./) > -1) {
            replacements.push([match[0], `<a href="http://${match[0]}" target="_blank">${match[0]}</a>`, ]);
        }
        else {
            replacements.push([match[0], `<a href="${match[0]}" target="_blank">${match[0]}</a>`, ]);
        }
    }

    while ((match = doi.exec(input)) !== null) {
        replacements.push([match[1], `<a href="https://doi.org/${match[1]}" target="_blank">${match[1]}</a>`, ]);
    }

    replacements.forEach(r => input = input.replace(r[0], r[1]));

    return input;
}

/**
 * Creates a "unique" ID value to be used for an ID field.
 * @return {string}              Unique ID.
 */
export const generateID = (): string => Math.round(Math.random() * Date.now()).toString(30);
