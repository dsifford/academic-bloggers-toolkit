/**
 * Takes a RIS or PubMed date string as input and returns a CSL.Date object.
 *
 * A RIS date string has the following shape: `YYYY/MM/DD/OtherInfo`
 * A PubMed date string has the following shape: `1975/12/01 00:00`
 *
 * @param input  - Date string
 * @param source - Source of the input
 * @return Formatted CSL.Date object
 */
export function parseCSLDate(input: string, source: 'RIS' | 'pubmed'): CSL.Date {
    const date: CSL.Date = { 'date-parts': [[]] };
    if (input.length === 0) return date;

    switch (source) {
        case 'RIS':
            input.split('/').forEach((part: string, i: number) => {
                if (!part) return;
                if (i === 3 && part.search(/(winter|spring|summer|fall)/i) > -1) {
                    date.season = part;
                    return;
                }
                date['date-parts']![0][i] = part;
            });
            break;
        case 'pubmed':
        default:
            date['date-parts']![0] = input.substr(0, 10).split('/');
            break;
    }

    return date;
}
