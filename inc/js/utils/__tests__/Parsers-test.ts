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
    chapter: '12',
    edition: '2',
    fulljournalname: 'Journal of Applied Developmental Psychology',
    issue: '5',
    location: 'New York',
    updated: '01/01/2016',
    url: 'www.google.com',
    volume: '33'
}

describe('AMA Format Tests', () => {
    it('should parse manual journals correctly', () => {
        let ama = new AMA(false, 'journal');
        let reference = ama.parse([testData]);
        expect(reference[0]).toBe('Wooldridge MB, Shapka J. Playing With Technology: Mother-Toddler Interaction Scores Lower During Play With Electronic Toys. <em>Journal of Applied Developmental Psychology.</em> 2012; 33(5):211-218.');
    });
});

describe('APA Format Tests', () => {
    it('should parse manual journals correctly', () => {
        let apa = new APA(false, 'journal');
        let reference = apa.parse([testData]);
        expect(reference[0]).toBe('Wooldridge, M.B., & Shapka, J. (2012). Playing with technology: Mother-toddler interaction scores lower during play with electronic toys. <em>Journal of Applied Developmental Psychology, 33</em>(5), 211-218.');
    });
});
