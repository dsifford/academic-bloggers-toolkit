/// <reference types="jest" />

import { RISParser } from '../RISParser';

// tslint:disable
const testCases = [
    `
TY  - ICOMM
T1  - ARISE Up, ARISE Up (EGDT vs. Usual Care for Sepsis)
AU  - Milne, W. Kenneth
AU  - Upadhye, Suneel
Y1  - 2014///
JF  - The Skeptics Guide to Emergency Medicine
UR  - http://thesgem.com/2014/10/sgem92-arise-up-arise-up-egdt-vs-usual-care-for-sepsis/
ER  -
`,
    `
TY  - JOUR
T1  - The quality checklists for medical education blogs and podcasts
A1  - Colmers, Isabelle N
AU  - Paterson, Quinten S
AU  - Lin, Michelle
A1  - Thoma, Brent
A1  - Chan, Teresa M
Y1  - 2015///
JF  - The Winnower
DO  - 10.15200/winn.144720.08769
ER  -
`,
    `
TY  - BOOK
T1  - Guide to Knowledge Translation Planning at CIHR: Integrated and End-of-Grant Approaches
A1  - Canadian Institutes of Health Research
AU  - Stevens, James L
A2  - Doe, John M
ED  - Jones, Sally P
Y1  - 2012///
PB  - Canadian Institute of Health Research
JF  - CIHR Website
SP  - 1
EP  - 30
CY  - Ottawa
SN  - 9781100205175
N2  - This guide outlines those elements that contribute to strong KT projects. It is intended to be used both bythose developing project proposals and by those who are assessing such proposals for the purposes of funding or partnership.
ER  -
`,
    `
TY  - UNSUPPORTED
T1  - Shouldn't get to this point
A1  - Shouldn't get to this point
Y1  - 2012///
PB  - Shouldn't get to this point
JF  - Shouldn't get to this point
SP  - 1
EP  - 30
CY  - Shouldn't get to this point
SN  - Shouldn't get to this point
N2  - Shouldn't get to this point
ER  -
`,
    ``,
    `
TY  - CPAPER
T1  - The title of the paper
A2  - Smith, John L
ED  - Doe, Jane P
A3  - Translator, Name A
A3  - Translator, Name B
Y1  - 2011///
DA  - 2011/11/05/summer
Y2  - 2011/11/05/summer
KW  - Keyword 1
J2  - shortTitle
JA  - shortTitle
AN  - 1
C7  - 1
CN  - 1
CY  - United States
DB  - Medline
DO  - 10.000000thedoi
DP  - the archive
ET  - 1
LA  - English
IS  - 1
NV  - 1
C2  - 65481
C2  - PMC23423
OP  - the original title
PB  - the publisher
EP  - 20
SP  - 10
T2  - conference name
C3  - event name
T3  - collection title
ST  - shortTitle
VL  - 1
AB  - The abstract
UR  - www.google.com
ER  -
`,
];
// tslint:enable

describe('RISParser', () => {
    it('should parse webpage correctly', () => {
        const parser = new RISParser(testCases[0]);
        const expected: CSL.Data[] = [
            {
                URL:
                    'http://thesgem.com/2014/10/sgem92-arise-up-arise-up-egdt-vs-usual-care-for-sepsis/',
                author: [
                    { family: 'Milne', given: 'W. Kenneth' },
                    { family: 'Upadhye', given: 'Suneel' },
                ],
                'container-title': 'The Skeptics Guide to Emergency Medicine',
                id: '0',
                issued: {
                    'date-parts': [['2014']],
                },
                title: 'ARISE Up, ARISE Up (EGDT vs. Usual Care for Sepsis)',
                type: 'webpage',
            },
        ];
        expect(parser.parse()).toEqual(expected);
    });
    it('should parse journal-article correctly', () => {
        const parser = new RISParser(testCases[1]);
        const expected: CSL.Data[] = [
            {
                DOI: '10.15200/winn.144720.08769',
                author: [
                    { family: 'Colmers', given: 'Isabelle N' },
                    { family: 'Paterson', given: 'Quinten S' },
                    { family: 'Lin', given: 'Michelle' },
                    { family: 'Thoma', given: 'Brent' },
                    { family: 'Chan', given: 'Teresa M' },
                ],
                'container-title': 'The Winnower',
                id: '0',
                issued: {
                    'date-parts': [['2015']],
                },
                title:
                    'The quality checklists for medical education blogs and podcasts',
                type: 'article-journal',
            },
        ];
        expect(parser.parse()).toEqual(expected);
    });
    it('should parse books correctly', () => {
        const parser = new RISParser(testCases[2]);
        const expected: any = [
            {
                ISBN: '9781100205175',
                ISSN: '9781100205175',
                abstract:
                    'This guide outlines those elements that contribute to strong KT projects. It is intended to be used both bythose developing project proposals and by those who are assessing such proposals for the purposes of funding or partnership.', // tslint:disable-line
                author: [
                    { literal: 'Canadian Institutes of Health Research' },
                    { family: 'Stevens', given: 'James L' },
                ],
                'container-title': 'CIHR Website',
                editor: [
                    { family: 'Doe', given: 'John M' },
                    { family: 'Jones', given: 'Sally P' },
                ],
                id: '0',
                issued: {
                    'date-parts': [['2012']],
                },
                page: '1-30',
                publisher: 'Canadian Institute of Health Research',
                'publisher-place': 'Ottawa',
                title:
                    'Guide to Knowledge Translation Planning at CIHR: Integrated and End-of-Grant Approaches',
                type: 'book',
            },
        ];
        expect(parser.parse()).toEqual(expected);
    });
    it('should keep track of unsupported reference types', () => {
        const parser = new RISParser(testCases[3]);
        const val = parser.parse();
        expect(parser.unsupportedRefs.length).toBe(1);
        expect(val).toEqual([]);
    });
    it('should be able to handle empty strings', () => {
        const parser = new RISParser(testCases[4]);
        expect(parser.parse()).toEqual([]);
    });
    it('should process an assortment of fields correctly', () => {
        const parser = new RISParser(testCases[5]);
        const expected: any = [
            {
                DOI: '10.000000thedoi',
                PMCID: 'PMC23423',
                PMID: '65481',
                URL: 'www.google.com',
                abstract: 'The abstract',
                accessed: {
                    'date-parts': [['2011', '11', '05']],
                    season: 'summer',
                },
                archive: 'the archive',
                'call-number': '1',
                'collection-title': 'collection title',
                'container-title': 'conference name',
                'container-title-short': 'shortTitle',
                edition: '1',
                editor: [
                    { family: 'Smith', given: 'John L' },
                    { family: 'Doe', given: 'Jane P' },
                ],
                event: 'event name',
                'event-place': 'United States',
                id: '0',
                issue: '1',
                issued: {
                    'date-parts': [['2011', '11', '05']],
                    season: 'summer',
                },
                journalAbbreviation: 'shortTitle',
                keyword: 'Keyword 1',
                language: 'English',
                number: '1',
                'number-of-volumes': '1',
                'original-title': 'the original title',
                page: '10-20',
                publisher: 'the publisher',
                shortTitle: 'shortTitle',
                source: 'Medline',
                title: 'The title of the paper',
                translator: [
                    { family: 'Translator', given: 'Name A' },
                    { family: 'Translator', given: 'Name B' },
                ],
                type: 'paper-conference',
                volume: '1',
            },
        ];
        expect(parser.parse()).toEqual(expected);
    });
});
