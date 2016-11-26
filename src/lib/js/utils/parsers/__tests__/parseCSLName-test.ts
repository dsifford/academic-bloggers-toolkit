import { parseCSLName } from '../parseCSLName';

describe('parseCSLName()', () => {
    const risNames = [
        'Paterson, Quinten S',
        'Rezaie, Salim R',
        'Lawrentschuk, Nathan',
        'Straus, Sharon E',
        'Chan, Teresa M',
    ];

    const pubmedNames = [
        'Giebel W',
        'Reijula A',
        'Breuninger H',
        'Ullmann U',
        'Doe JM',
    ];

    it('should process RIS names correctly', () => {
        expect(parseCSLName(risNames[0], 'RIS')).toEqual({ family: 'Paterson', given: 'Quinten S' });
        expect(parseCSLName(risNames[1], 'RIS')).toEqual({ family: 'Rezaie', given: 'Salim R' });
        expect(parseCSLName(risNames[2], 'RIS')).toEqual({ family: 'Lawrentschuk', given: 'Nathan' });
        expect(parseCSLName(risNames[3], 'RIS')).toEqual({ family: 'Straus', given: 'Sharon E' });
        expect(parseCSLName(risNames[4], 'RIS')).toEqual({ family: 'Chan', given: 'Teresa M' });
    });
    it('should process PubMed names correctly', () => {
        expect(parseCSLName(pubmedNames[0], 'pubmed')).toEqual({ family: 'Giebel', given: 'W' });
        expect(parseCSLName(pubmedNames[1], 'pubmed')).toEqual({ family: 'Reijula', given: 'A' });
        expect(parseCSLName(pubmedNames[2], 'pubmed')).toEqual({ family: 'Breuninger', given: 'H' });
        expect(parseCSLName(pubmedNames[3], 'pubmed')).toEqual({ family: 'Ullmann', given: 'U' });
        expect(parseCSLName(pubmedNames[4], 'pubmed')).toEqual({ family: 'Doe', given: 'JM' });
    });
});
