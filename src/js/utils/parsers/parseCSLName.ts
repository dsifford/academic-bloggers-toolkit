/**
 * Responsible for parsing RIS or PubMed fields containing names into the correct
 * shape for CSL
 *
 * Shape of PubMed string   => Lastname FM
 * Shape of CrossRef string => Lastname, Firstname M
 *
 * @param input  - Raw, unformatted name
 * @param source - Source of the name field
 * @return Formatted CSL.Person object
 */
export function parseCSLName(input: string, source: 'RIS' | 'pubmed'): CSL.Person {
    let family: string;
    let given: string;

    switch (source) {
        case 'RIS':
            const splitName = input.split(', ');
            if (splitName.length === 1) {
                return { literal: input };
            }
            family = splitName[0];
            given = splitName[1];
            break;
        case 'pubmed':
        default:
            family = input.split(' ')[0];
            given = input.split(' ')[1];
            break;
    }

    return { family, given };
}
