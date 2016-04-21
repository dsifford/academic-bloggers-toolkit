
type Source = 'RIS'|'pubmed'

/**
 * Responsible for parsing RIS or PubMed fields containing names into the correct shape for CSL.
 *
 * @note This is largely unfinished.
 *
 * @param  {string}     input  The raw, unformatted name.
 * @param  {Source}     source The source of the name field.
 * @return {CSL.Person}        The formatted CSL.Person object.
 */
export function processName(input: string, source: Source): CSL.Person {

    let family: string;
    let given: string;

    switch (source) {
        case 'RIS':
            family = input.split(', ')[0];
            given = input.split(', ')[1];
            break;
        case 'pubmed':
            family = input.split(' ')[0];
            given = input.split(' ')[1];
            break;
    }

    return { family, given };
}


/**
 * Takes a RIS or PubMed date string as input and returns a CSL.Date object.
 *
 * A RIS date string has the following shape: `YYYY/MM/DD/OtherInfo`
 * A PubMed date string has the following shape: `1975/12/01 00:00`
 *
 * @param  {string}   input  Date string.
 * @param  {Source}   source The source of the input.
 * @return {CSL.Date}        Formatted CSL.Date object.
 */
export function processDate(input: string, source: Source): CSL.Date {

    let date: CSL.Date = { 'date-parts': [[], ], };
    switch (source) {
        case 'RIS':
            input.split('/').forEach((part: string, i: number) => {
                if (!part) { return; }
                if (i === 3 && part.search(/(winter|spring|summer|fall)/i) > -1) {
                    date.season = part;
                    return;
                }
                date['date-parts'][0][i] = part;
            });
            break;
        case 'pubmed':
            date['date-parts'][0] = input.substr(0,10).split('/');
            break;
    }

    return date;
}
