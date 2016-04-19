jest.unmock('../Parsers');
jest.unmock('../HelperFunctions');

import { AMA, APA } from '../Parsers';

const testData: ReferenceObj = {
    authors: [
        { name: 'Wooldridge MB' },
        { name: 'Shapka J' },
    ],
    lastauthor: 'Shapka J',
    pages: '211-218',
    pubdate: '2012',
    source: 'Journal of Applied Developmental Psychology',
    title: 'Playing with technology: Mother-toddler interaction scores lower during play with electronic toys',
    accessdate: '01/01/2016',
    chapter: '',
    edition: '2',
    fulljournalname: 'Journal of Applied Developmental Psychology',
    issue: '5',
    location: 'New York',
    updated: '01/01/2016',
    url: 'www.google.com',
    volume: '33'
}

const test1AuthorNoIssue = Object.assign({}, testData, { authors: [testData.authors[1]], issue: '', });
const test7AuthorsNoVolume = Object.assign({}, testData, { authors: [
    testData.authors[1],
    testData.authors[0],
    testData.authors[1],
    testData.authors[0],
    testData.authors[1],
    testData.authors[0],
    testData.authors[1],
], volume: '' });
const test8Authors = Object.assign({}, testData, { authors: [
    testData.authors[0],
    testData.authors[1],
    testData.authors[0],
    testData.authors[1],
    testData.authors[0],
    testData.authors[1],
    testData.authors[0],
    testData.authors[1],
]});

const testNoAuthorsFromPubmed = Object.assign({}, testData, { authors: [] });

describe('AMA Format Tests', () => {
    it('should parse manual journals correctly', () => {
        let ama = new AMA(false, 'journal');
        let reference = ama.parse([testData]);
        expect(reference[0]).toBe('Wooldridge MB, Shapka J. Playing With Technology: Mother-Toddler Interaction Scores Lower During Play With Electronic Toys. <em>Journal of Applied Developmental Psychology.</em> 2012; 33(5):211-218.');
        reference = ama.parse([test1AuthorNoIssue]);
        expect(reference[0]).toBe('Shapka J. Playing With Technology: Mother-Toddler Interaction Scores Lower During Play With Electronic Toys. <em>Journal of Applied Developmental Psychology.</em> 2012; 33:211-218.');
        reference = ama.parse([test7AuthorsNoVolume]);
        expect(reference[0]).toBe('Shapka J, Wooldridge MB, Shapka J, et al. Playing With Technology: Mother-Toddler Interaction Scores Lower During Play With Electronic Toys. <em>Journal of Applied Developmental Psychology.</em> 2012; (5):211-218.');
    });

    it('should handle pubmed errors appropriately', () => {
        let ama = new AMA(true);
        let reference = ama.parse([testNoAuthorsFromPubmed]);
        console.log(reference);
        expect(reference[0]).toBeFalsy();
    });

    it('should parse manual websites correctly', () => {
        let ama = new AMA(false, 'website');
        let reference = ama.parse([testData]);
        expect(reference[0]).toBe('Wooldridge MB, Shapka J. Playing with technology: Mother-toddler interaction scores lower during play with electronic toys. <em>Journal of Applied Developmental Psychology</em>. Available at: <a href="www.google.com" target="_blank">www.google.com</a>. Published December 2011. Updated January 1, 2016. Accessed January 1, 2016.');
    });

    it('should parse manual books correctly', () => {
        let ama = new AMA(false, 'book');
        let reference = ama.parse([testData]);
        expect(reference[0]).toBe('Wooldridge MB, Shapka J. <em>Playing with technology: Mother-toddler interaction scores lower during play with electronic toys</em>. 2nd ed. New York: Journal of Applied Developmental Psychology; 2012: 211-218.');
    });
});

describe('APA Format Tests', () => {
    it('should parse manual journals correctly', () => {
        let apa = new APA(false, 'journal');
        let reference = apa.parse([testData]);
        expect(reference[0]).toBe('Wooldridge, M.B., & Shapka, J. (2012). Playing with technology: Mother-toddler interaction scores lower during play with electronic toys. <em>Journal of Applied Developmental Psychology, 33</em>(5), 211-218.');
        reference = apa.parse([test1AuthorNoIssue]);
        expect(reference[0]).toBe('Shapka, J. (2012). Playing with technology: Mother-toddler interaction scores lower during play with electronic toys. <em>Journal of Applied Developmental Psychology, 33</em>, 211-218.');
        reference = apa.parse([test7AuthorsNoVolume]);
        expect(reference[0]).toBe('Shapka, J., Wooldridge, M.B., Shapka, J., Wooldridge, M.B., Shapka, J., Wooldridge, M.B., & Shapka, J. (2012). Playing with technology: Mother-toddler interaction scores lower during play with electronic toys. <em>Journal of Applied Developmental Psychology,</em>(5), 211-218.');
        reference = apa.parse([test8Authors]);
        expect(reference[0]).toBe('Wooldridge, M.B., Shapka, J., Wooldridge, M.B., Shapka, J., Wooldridge, M.B., Shapka, J., . . . Shapka, J. (2012). Playing with technology: Mother-toddler interaction scores lower during play with electronic toys. <em>Journal of Applied Developmental Psychology, 33</em>(5), 211-218.');
    });

    it('should handle pubmed errors appropriately', () => {
        let apa = new APA(true);
        let reference = apa.parse([testNoAuthorsFromPubmed]);
        console.log(reference);
        expect(reference[0]).toBeFalsy();
    });

    it('should parse manual websites correctly', () => {
        let apa = new APA(false, 'website');
        let reference = apa.parse([testData]);
        expect(reference[0]).toBe('Wooldridge, M.B., & Shapka, J. (2011, December 31). Playing with technology: Mother-toddler interaction scores lower during play with electronic toys. <em>Journal of Applied Developmental Psychology</em>. Retrieved from <a href="www.google.com" target="_blank">www.google.com</a>');
    });

    it('should parse manual books correctly', () => {
        let apa = new APA(false, 'book');
        let reference = apa.parse([testData]);
        expect(reference[0]).toBe('Wooldridge, M.B., & Shapka, J. (2012). <em>Playing with technology: Mother-toddler interaction scores lower during play with electronic toys</em> (2nd ed., pp. 211-218). New York: Journal of Applied Developmental Psychology.');
    });
});
