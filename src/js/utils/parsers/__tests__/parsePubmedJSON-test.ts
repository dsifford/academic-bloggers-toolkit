import { parsePubmedJSON } from '../parsePubmedJSON';

describe('parsePubmedJSON()', () => {
    const testData: PubMed.DataPMID[] = [
        {
            authors: [
                {
                    authtype: 'Author',
                    clusterid: '',
                    name: 'Doe JD',
                },
            ],
            availablefromurl: 'http://www.test.com',
            bookname: 'Test Book Name',
            booktitle: 'Test Book Title',
            chapter: '1',
            edition: '2',
            fulljournalname: 'Journal of Testing',
            issn: '3',
            issue: '4',
            lang: ['eng'],
            medium: 'print',
            pages: '100-3',
            publisherlocation: 'USA',
            publishername: 'Test',
            reportnumber: '5',
            sortpubdate: '2016/08/19 00:00',
            source: 'J Test',
            title: 'Test Title',
            uid: '12345',
            volume: '6',
        },
    ];

    it('should process PubMed JSON to CSL', () => {
        expect(parsePubmedJSON('PMID', <any>testData)).toMatchObject([
            {
                ISSN: '3',
                PMID: '12345',
                URL: 'http://www.test.com',
                author: [{ family: 'Doe', given: 'JD' }],
                'chapter-number': '1',
                'container-title': 'Journal of Testing',
                'container-title-short': 'J Test',
                edition: '2',
                issue: '4',
                issued: { 'date-parts': [['2016', '08', '19']] },
                journalAbbreviation: 'J Test',
                language: 'en-US',
                medium: 'print',
                number: '5',
                page: '100-3',
                publisher: 'Test',
                'publisher-place': 'USA',
                title: 'Test Title',
                type: 'article-journal',
                volume: '6',
            },
        ]);
    });
    it('should move past empty fields', () => {
        expect(parsePubmedJSON('PMID', <any>[{ publishername: '' }])).toMatchObject([
            { author: [], type: 'article-journal' },
        ]);
    });
    it("should default to en-US when language can't be found", () => {
        expect(parsePubmedJSON('PMID', <any>[{ lang: ['Gibberish'] }])).toMatchObject([
            { author: [], language: 'en-US', type: 'article-journal' },
        ]);
    });
    it('should move past undefined fields', () => {
        expect(parsePubmedJSON('PMID', <any>[{ thisFieldDoesntExist: 'test' }])).toMatchObject([
            { author: [], type: 'article-journal' },
        ]);
    });
});
