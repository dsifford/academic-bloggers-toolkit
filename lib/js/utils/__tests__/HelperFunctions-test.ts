jest.unmock('../HelperFunctions');

import * as helpers from '../HelperFunctions';

const testNames: PubMed.Author[] = [
    { firstname: 'john', lastname: 'doe', middleinitial: 'p' },
    { firstname: 'derek', lastname: 'sifford', middleinitial: 'p' },
    { firstname: 'susan', lastname: 'smith', middleinitial: '' },
    { firstname: 'francis', lastname: 'underwood', middleinitial: 'j' },
    { firstname: 'wendy', lastname: 'peterson', middleinitial: '' },
];

describe('HelperFunctions Tests', () => {
    it('should parse inline citation strings correctly', () => {
        expect(helpers.parseInlineCitationString([1,2,3,4,5,7,12])).toBe('1-5,7,12');
        expect(helpers.parseInlineCitationString([1,3,5,6,7,9,10])).toBe('1,3,5-7,9,10');
        expect(helpers.parseInlineCitationString([1])).toBe('1');
        expect(helpers.parseInlineCitationString([1,2,3,4,5,6,7,8,9,10])).toBe('1-10');
        expect(helpers.parseInlineCitationString([4,25,235,678])).toBe('4,25,235,678');
        expect(helpers.parseInlineCitationString([2,6,7,8,9,10,11,12])).toBe('2,6-12');
        expect(helpers.parseInlineCitationString([])).toBe('');
    });

    it('should parse citation number arrays correctly', () => {
        expect(helpers.parseCitationNumArray('1-5,7,12')).toEqual([1,2,3,4,5,7,12]);
        expect(helpers.parseCitationNumArray('1,3,5-7,9,10')).toEqual([1,3,5,6,7,9,10]);
        expect(helpers.parseCitationNumArray('1')).toEqual([1]);
        expect(helpers.parseCitationNumArray('1-10')).toEqual([1,2,3,4,5,6,7,8,9,10]);
        expect(helpers.parseCitationNumArray('4,25,235,678')).toEqual([4,25,235,678]);
        expect(helpers.parseCitationNumArray('2,6-12')).toEqual([2,6,7,8,9,10,11,12]);
        expect(helpers.parseCitationNumArray('')).toEqual([]);
    });

    it('should format titles properly', () => {
        expect(helpers.toTitleCase('this is a test title')).toBe('This Is a Test Title');
        expect(helpers.toTitleCase('THIS IS A TEST TITLE')).toBe('THIS IS a TEST TITLE');
        expect(helpers.toTitleCase('wack-A-mole')).toBe('Wack-a-Mole');
        expect(helpers.toTitleCase(`a chronological history of new-england in the form of annals: being a summary and exact account of the most material transactions and occurences`)).toBe(`A Chronological History of New-England in the Form of Annals: Being a Summary and Exact Account of the Most Material Transactions and Occurences`);
        expect(helpers.toTitleCase('writing science: how to write papers that get cited and proposals that get funded')).toBe('Writing Science: How to Write Papers That Get Cited and Proposals That Get Funded');
        expect(helpers.toTitleCase('the demon-haunted world: science as a candle in the dark')).toBe('The Demon-Haunted World: Science as a Candle in the Dark');
        expect(helpers.toTitleCase('a brief history of time: from the big bang to black holes')).toBe('A Brief History of Time: From the Big Bang to Black Holes');
    });

});
