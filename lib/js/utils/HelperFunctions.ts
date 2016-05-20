

/**
 * Function that takes a sorted array of integers as input and returns
 * an inline citation string representation of the numbers.
 *
 * Example: [1,3,4,5,10] => "1,3-5,10"
 *
 * @param  {number[]} numArr Sorted array of integers.
 * @returns {string} A formatted inline citation string.
 */
export function parseInlineCitationString(numArr: number[]): string {
    if (numArr.length === 0) { return ''; }

    let output: string = numArr[0].toString();

    for (let i = 1; i < numArr.length; i++) {
        switch (output[output.length - 1]) {
            case ',':
                output += numArr[i];
                break;
            case '-':
                if (numArr[i + 1] === numArr[i] + 1) { break; }
                if (i === numArr.length - 1) { output += numArr[i]; break; }
                output += numArr[i] + ',';
                break;
            default:
                let lastNum = parseInt(output.split(',')[output.split(',').length - 1]);
                if (lastNum === numArr[i] - 1 && numArr[i + 1] === numArr[i] + 1) {
                    output += '-';
                    break;
                }
                output += ',' + numArr[i];
        }
    }

    return output;
}

/**
 * Function that takes an inline citation string and returns an array of
 * integers for that string.
 *
 * Example: "1-3,6,8-10" => [1,2,3,6,8,9,10]
 *
 * @param  {string} input An inline citation string.
 * @returns {number[]} An array of integers that represent the input string.
 */
export function parseCitationNumArray(input: string): number[] {
    let x = input.split(',');
    let output: number[] = [];

    if (x.length === 0 || (x.length === 1 && x[0] === '')) { return []; }

    for (let i = 0; i < x.length; i++) {
        switch (x[i].match('-')) {
            case null:
                output.push(parseInt(x[i]));
                break;
            default:
                for (let j = parseInt(x[i].split('-')[0]); j <= parseInt(x[i].split('-')[1]); j++) {
                    output.push(j);
                }
        }
    }

    return output;
}


/**
 * Takes a string as input and returns the same string, but in title case.
 * @param  {string} str String to be formatted.
 * @return {string}     Formatted string in title case.
 */
export function toTitleCase(str: string): string {
    let smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;

    return str.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function(match, index, title) {
        if (index > 0 && index + match.length !== title.length &&
            match.search(smallWords) > -1 && title.charAt(index - 2) !== ':' &&
            (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') &&
            title.charAt(index - 1).search(/[^\s-]/) < 0) {
            return match.toLowerCase();
        }

        if (match.substr(1).search(/[A-Z]|\../) > -1) {
            return match;
        }

        return match.charAt(0).toUpperCase() + match.substr(1);
    });
};

/**
 * Takes an array of reference strings and makes the following replacements to each
 *   reference:
 *   - Any URL => wrapped with an anchor tag (to make clickable).
 *   - DOIs => wrapped with an anchor tag (link to DOI.org resolver).
 * @param  {string[]} input Array of reference strings.
 * @return {string[]}       Array of reference strings with parsed links.
 */
export function parseReferenceURLs(input: string[]): string[] {
    input.forEach((ref: string, i: number) => {

        let url: RegExp = /((http:\/\/|https:\/\/|www.)(www.)?[^;\s]+[0-9a-zA-Z\/])/g;
        let doi: RegExp = /doi:(\S+)./g;
        let match: RegExpExecArray;
        let replacements: [string, string][] = [];


        while ((match = url.exec(ref)) !== null) {
            if (match[0].search(/^www./) > -1) {
                replacements.push([match[0], `<a href="http://${match[0]}" target="_blank">${match[0]}</a>`, ]);
            }
            else {
                replacements.push([match[0], `<a href="${match[0]}" target="_blank">${match[0]}</a>`, ]);
            }
        }

        while ((match = doi.exec(ref)) !== null) {
            replacements.push([match[1], `<a href="https://doi.org/${match[1]}" target="_blank">${match[1]}</a>`, ]);
        }

        replacements.forEach(r => ref = ref.replace(r[0], r[1]));
        input[i] = ref;

    });
    return input;
}

/**
 * Creates a "unique" ID value to be used for an ID field.
 * @return {string}              Unique ID.
 */
export const generateID = (): string => Math.round(Math.random() * Date.now()).toString(30);
