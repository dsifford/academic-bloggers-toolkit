jest.unmock('../RISParser');
jest.unmock('../CSLFieldProcessors');

import { RISParser } from '../RISParser';

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

describe('RISParser', () => {
    it('should parse webpage correctly', () => {
        let parser = new RISParser(testCases[0]);
        let expected: CSL.Data[] = [{
            id: '0',
            type: 'webpage',
            'container-title': 'The Skeptics Guide to Emergency Medicine',
            title: 'ARISE Up, ARISE Up (EGDT vs. Usual Care for Sepsis)',
            author: [
                { family: 'Milne', given: 'W. Kenneth' },
                { family: 'Upadhye', given: 'Suneel' },
            ],
            issued: {
                'date-parts': [[ '2014', ], ],
            },
            URL: 'http://thesgem.com/2014/10/sgem92-arise-up-arise-up-egdt-vs-usual-care-for-sepsis/',
        }, ];
        expect(parser.parse()).toEqual(expected);
    });

    it('should parse journal-article correctly', () => {
        let parser = new RISParser(testCases[1]);
        let expected: CSL.Data[] = [{
            id: '0',
            type: 'article-journal',
            'container-title': 'The Winnower',
            title: 'The quality checklists for medical education blogs and podcasts',
            author: [
                { family: 'Colmers', given: 'Isabelle N' },
                { family: 'Paterson', given: 'Quinten S' },
                { family: 'Lin', given: 'Michelle' },
                { family: 'Thoma', given: 'Brent' },
                { family: 'Chan', given: 'Teresa M' },
            ],
            issued: {
                'date-parts': [['2015', ], ],
            },
            DOI: '10.15200/winn.144720.08769',
        }, ];
        expect(parser.parse()).toEqual(expected);
    });

    it('should parse books correctly', () => {
        let parser = new RISParser(testCases[2]);
        let expected: CSL.Data = [{
            id: '0',
            type: 'book',
            title: 'Guide to Knowledge Translation Planning at CIHR: Integrated and End-of-Grant Approaches',
            author: [
                { literal: 'Canadian Institutes of Health Research' },
                { family: 'Stevens', given: 'James L' },
            ],
            editor: [
                { family: 'Doe', given: 'John M' },
                { family: 'Jones', given: 'Sally P' },
            ],
            'container-title': 'CIHR Website',
            issued: {
                'date-parts': [['2012', ], ],
            },
            publisher: 'Canadian Institute of Health Research',
            'publisher-place': 'Ottawa',
            page: '1-30',
            ISBN: '9781100205175',
            ISSN: '9781100205175',
            abstract: 'This guide outlines those elements that contribute to strong KT projects. It is intended to be used both bythose developing project proposals and by those who are assessing such proposals for the purposes of funding or partnership.',
        }, ];
        expect(parser.parse()).toEqual(expected);
    });

    it('should keep track of unsupported reference types', () => {
        let parser = new RISParser(testCases[3]);
        let val = parser.parse();
        expect(parser.unsupportedRefs.length).toBe(1);
        expect(val).toEqual([]);
    });

    it('should be able to handle empty strings', () => {
        let parser = new RISParser(testCases[4]);
        expect(parser.parse()).toEqual([]);
    });

    it('should process an assortment of fields correctly', () => {
        let parser = new RISParser(testCases[5]);
        let expected: CSL.Data = [{
            id: '0',
            type: 'paper-conference',
            title: 'The title of the paper',
            editor: [
                { family: 'Smith', given: 'John L' },
                { family: 'Doe', given: 'Jane P' },
            ],
            translator: [
                { family: 'Translator', given: 'Name A' },
                { family: 'Translator', given: 'Name B' },
            ],
            issued: {
                'date-parts': [['2011', '11', '05', ], ],
                season: 'summer',
            },
            'event-date': {
                'date-parts': [['2011', '11', '05', ], ],
                season: 'summer',
            },
            keyword: 'Keyword 1',
            journalAbbreviation: 'shortTitle',
            'container-title-short': 'shortTitle',
            number: '1',
            'call-number': '1',
            'event-place': 'United States',
            source: 'Medline',
            DOI: '10.000000thedoi',
            archive: 'the archive',
            edition: '1',
            language: 'English',
            issue: '1',
            'number-of-volumes': '1',
            PMID: '65481',
            PMCID: 'PMC23423',
            'original-title': 'the original title',
            publisher: 'the publisher',
            page: '10-20',
            'container-title': 'conference name',
            'event': 'event name',
            'collection-title': 'collection title',
            'shortTitle': 'shortTitle',
            volume: '1',
            abstract: 'The abstract',
            URL: 'www.google.com',
        }, ];
        expect(parser.parse()).toEqual(expected);
    });
});
