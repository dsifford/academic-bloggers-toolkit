import { TeXParser, parsePeople } from '../TeXParser';

describe('parsePeople()', () => {
    it('Last, First MI', () => {
        const people = parsePeople('Doe, John Q and Smith, Bob D and de Camp, Catherine C');
        const expected = [
            ['Doe', 'John Q.'],
            ['Smith', 'Bob D.'],
            ['de Camp', 'Catherine C.'],
        ];
        for (const [k, p] of people.entries()) {
            expect(p.family).toEqual(expected[k][0]);
            expect(p.given).toEqual(expected[k][1]);
        }
    });
    it('First Middle Last', () => {
        const people = parsePeople('Kim Stanley Robinson and Raymond Edward Carrington and James von Issac and Jean de La Fontaine'); // tslint:disable-line
        const expected = [
            ['Robinson', 'Kim S.'],
            ['Carrington', 'Raymond E.'],
            ['von Issac', 'James'],
            ['de La Fontaine', 'Jean'],
        ];
        for (const [k, p] of people.entries()) {
            expect(p.family).toEqual(expected[k][0]);
            expect(p.given).toEqual(expected[k][1]);
        }
    });
    it('should handle a mixture', () => {
        const people = parsePeople('Lacroix, Jacques and Hébert, Paul C. and Fergusson, Dean A. and Tinmouth, Alan and Cook, Deborah J. and Marshall, John C. and Clayton, Lucy and McIntyre, Lauralyn and Callum, Jeannie and Turgeon, Alexis F. and Blajchman, Morris A. and Walsh, Timothy S. and Stanworth, Simon J. and Campbell, Helen and Capellier, Gilles and Tiberghien, Pierre and Bardiaux, Laurent and van de Watering, Leo and van der Meer, Nardo J. and Sabri, Elham and Vo, Dong and {ABLE Investigators and the Canadian Critical Care Trials Group}'); // tslint:disable-line
        const expected = [
            ['Lacroix', 'Jacques'],
            ['Hébert', 'Paul C.'],
            ['Fergusson', 'Dean A.'],
            ['Tinmouth', 'Alan'],
            ['Cook', 'Deborah J.'],
            ['Marshall', 'John C.'],
            ['Clayton', 'Lucy'],
            ['McIntyre', 'Lauralyn'],
            ['Callum', 'Jeannie'],
            ['Turgeon', 'Alexis F.'],
            ['Blajchman', 'Morris A.'],
            ['Walsh', 'Timothy S.'],
            ['Stanworth', 'Simon J.'],
            ['Campbell', 'Helen'],
            ['Capellier', 'Gilles'],
            ['Tiberghien', 'Pierre'],
            ['Bardiaux', 'Laurent'],
            ['van de Watering', 'Leo'],
            ['van der Meer', 'Nardo J.'],
            ['Sabri', 'Elham'],
            ['Vo', 'Dong'],
            ['ABLE Investigators and the Canadian Critical Care Trials Group'],
        ];
        for (const [k, p] of people.entries()) {
            if (k === expected.length - 1) {
                expect(p.literal).toEqual(expected[k][0]);
                continue;
            }
            expect(p.family).toEqual(expected[k][0]);
            expect(p.given).toEqual(expected[k][1]);
        }
    });
});

describe('TeXParser', () => {
    it('should construct with empty input', () => {
        const parser = new TeXParser('');
        expect(parser.parse().length).toBe(0);
    });
    it('should handle simple fields', () => {
        const bib = `
            @article{testing,
                abstract = {test abstract},
                annote = {test annote},
                edition = {test edition},
                language = {test language},
                note = {test note},
                publisher = {test publisher},
                version = {test version},
                volume = {test volume}
            }
        `;
        const expected = {
            abstract: 'test abstract',
            annote: 'test annote',
            edition: 'test edition',
            language: 'test language',
            note: 'test note',
            publisher: 'test publisher',
            version: 'test version',
            volume: 'test volume',
        };
        const parsed = new TeXParser(bib).parse()[0];
        for (const k of Object.keys(expected)) {
            expect(expected[k]).toEqual(parsed[k]);
        }
    });
    it('should replace {} from titles/short-titles', () => {
        const bib = `
            @article{testing,
                title = {this {is {a}} {test}},
                shorttitle = {{deeply {{{{nested {{{brackets}}}}}}}}},
            }
        `;
        const parsed = new TeXParser(bib).parse()[0];
        expect(parsed.title).toEqual('this is a test');
        expect(parsed['title-short']).toEqual('deeply nested brackets');
    });
    it('should rename fields according to CSL specifications', () => {
        const bib = `
            @article{testing,
                address = {testing place},
                booktitle = {testing collection title},
                chapter = {testing title},
                institution = {testing publisher},
                journal = {testing container title},
                keywords = {testing keyword},
                number = {testing number/issue},
                pagetotal = {testing number-of-pages},
                series = {testing collection title},
                volumes = {testing number-of-volumes},
                invalid = {should be skipped}
            }
        `;
        const expected = {
            'collection-title': 'testing collection title',
            'container-title': 'testing container title',
            'event-place': 'testing place',
            issue: 'testing number/issue',
            keyword: 'testing keyword',
            number: 'testing number/issue',
            'number-of-pages': 'testing number-of-pages',
            'number-of-volumes': 'testing number-of-volumes',
            publisher: 'testing publisher',
            'publisher-place': 'testing place',
            title: 'testing title',
        };
        const parsed = new TeXParser(bib).parse()[0];
        expect(Object.keys(parsed).length).toBe(14);
        for (const k of Object.keys(expected)) {
            expect(parsed[k]).toEqual(expected[k]);
        }
    });
    it('should transform certain field keys to uppercase', () => {
        const bib = `
            @article{testing,
                doi = {10.10000/1},
                isbn = {1234567890},
                issn = {12345},
                pmcid = {PMC12345},
                pmid = {11111},
                url = {https://www.google.com}
            }
        `;
        const expected = {
            DOI: '10.10000/1',
            ISBN: '1234567890',
            ISSN: '12345',
            PMCID: 'PMC12345',
            PMID: '11111',
            URL: 'https://www.google.com',
        };
        const parsed = new TeXParser(bib).parse()[0];
        for (const k of Object.keys(expected)) {
            expect(parsed[k]).toEqual(expected[k]);
        }
    });
    it('should parse dates appropriately', () => {
        const bib = `
            @article{testing,
                month = {nov},
                year = {2016}
            }
        `;
        const parsed = new TeXParser(bib).parse()[0];
        expect(parsed.issued['date-parts'][0][0]).toBe('2016');
        expect(parsed.issued['date-parts'][0][0]).toBe('2016');
        expect(parsed['event-date']['date-parts'][0][1]).toBe('11');
        expect(parsed['event-date']['date-parts'][0][1]).toBe('11');
    });
    it('should handle various forms of page ranges', () => {
        const bib = `
            @article{test1,
                pages = {250--51}
            }
            @article{test2,
                pages = {250-51}
            }
            @article{test3,
                pages = {95-105}
            }
            @article{test4,
                pages = {5}
            }
        `;
        const expected = [
            '250-51',
            '250-51',
            '95-105',
            '5',
        ];
        const parsed = new TeXParser(bib).parse();
        for (const [k, v] of parsed.entries()) {
            expect(v.page).toEqual(expected[k]);
        }
    });
    it('should parse citation types correctly', () => {
        const bib = `
            @article{test1, title = {test}}
            @manual{test2, title = {test}}
            @periodical{test3, title = {test}}
            @booklet{test4, title = {test}}
            @inbook{test5, title = {test}}
            @conference{test6, title = {test}}
            @mastersthesis{test7, title = {test}}
            @techreport{test8, title = {test}}
            @patent{test9, title = {test}}
            @electronic{test10, title = {test}}
            @standard{test11, title = {test}}
            @unpublished{test12, title = {test}}
            @gibberish{test13, title = {test}}
        `;
        const expected = [
            'article-journal',
            'book',
            'article-magazine',
            'pamphlet',
            'chapter',
            'paper-conference',
            'thesis',
            'report',
            'patent',
            'webpage',
            'legislation',
            'manuscript',
            'article',
        ];
        const parsed = new TeXParser(bib).parse();
        for (const [k, v] of parsed.entries()) {
            expect(v.type).toEqual(expected[k]);
        }
    });
    it('should parse a simple collection of authors/editors', () => {
        const bib = `
            @article{testing,
                author = {Doe, John and Smith, Bob D.},
                editor = {Doe, John and Smith, Bob D.}
            }
        `;
        const parsed = new TeXParser(bib).parse()[0];
        const expected = [
            ['Doe', 'John'],
            ['Smith', 'Bob D.'],
        ];
        for (const [k, person] of parsed.author.entries()) {
            expect(person.family).toEqual(expected[k][0]);
            expect(person.given).toEqual(expected[k][1]);
        }
        for (const [k, person] of parsed.editor.entries()) {
            expect(person.family).toEqual(expected[k][0]);
            expect(person.given).toEqual(expected[k][1]);
        }
    });
});
