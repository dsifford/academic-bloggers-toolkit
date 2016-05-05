jest.unmock('../HelperFunctions');

import * as helpers from '../HelperFunctions';

const testNames: PubMed.Author[] = [
    { firstname: 'john', lastname: 'doe', middleinitial: 'p', },
    { firstname: 'derek', lastname: 'sifford', middleinitial: 'p', },
    { firstname: 'susan', lastname: 'smith', middleinitial: '', },
    { firstname: 'francis', lastname: 'underwood', middleinitial: 'j', },
    { firstname: 'wendy', lastname: 'peterson', middleinitial: '', },
];

const testRefs: string[] = [
    'Body R. The ProMISe Study: EGDT RIP? St. Emlyn’s website. http://stemlynsblog.org/the-promise-study-egdt-rip/; http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/. Published 2015.',
    'Chan T, Helman A, Davis T, Purdy E. MEdIC Series | The Case the FOAM Faux Pas – Expert Review and Curated Commentary. Academic Life in Emergency Medicine. www.aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary. Published 2015.',
    'Colmers IN, Paterson QS, Lin M, Thoma B, Chan TM. The quality checklists for medical education blogs and podcasts. <i>The Winnower</i>. 2015. doi:10.15200/winn.144720.08769.',
    'Mathieu S. Trial of Early, Goal-Directed Resuscitation for Septic Shock. The Bottom Line. http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716. Published 2015.',
    'Cameron P. Pundit-Based Medicine. Emergency Physicians International.',
];

describe('HelperFunctions', () => {
    it('should parse inline citation strings correctly', () => {
        expect(helpers.parseInlineCitationString([1, 2, 3, 4, 5, 7, 12, ])).toBe('1-5,7,12');
        expect(helpers.parseInlineCitationString([1, 3, 5, 6, 7, 9, 10, ])).toBe('1,3,5-7,9,10');
        expect(helpers.parseInlineCitationString([1, ])).toBe('1');
        expect(helpers.parseInlineCitationString([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ])).toBe('1-10');
        expect(helpers.parseInlineCitationString([4, 25, 235, 678, ])).toBe('4,25,235,678');
        expect(helpers.parseInlineCitationString([2, 6, 7, 8, 9, 10, 11, 12, ])).toBe('2,6-12');
        expect(helpers.parseInlineCitationString([])).toBe('');
    });

    it('should parse citation number arrays correctly', () => {
        expect(helpers.parseCitationNumArray('1-5,7,12')).toEqual([1, 2, 3, 4, 5, 7, 12, ]);
        expect(helpers.parseCitationNumArray('1,3,5-7,9,10')).toEqual([1, 3, 5, 6, 7, 9, 10, ]);
        expect(helpers.parseCitationNumArray('1')).toEqual([1, ]);
        expect(helpers.parseCitationNumArray('1-10')).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ]);
        expect(helpers.parseCitationNumArray('4, 25,235,678')).toEqual([4, 25, 235, 678, ]);
        expect(helpers.parseCitationNumArray('2,6-12')).toEqual([2, 6, 7, 8, 9, 10, 11, 12, ]);
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

    it('should find and replace URLs and DOIs correctly', () => {
        expect(helpers.parseReferenceURLs([testRefs[0], ])).toEqual(['Body R. The ProMISe Study: EGDT RIP? St. Emlyn’s website. <a href="http://stemlynsblog.org/the-promise-study-egdt-rip/" target="_blank">http://stemlynsblog.org/the-promise-study-egdt-rip/</a>; <a href="http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/" target="_blank">http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/</a>. Published 2015.', ]);
        expect(helpers.parseReferenceURLs([testRefs[1], ])).toEqual(['Chan T, Helman A, Davis T, Purdy E. MEdIC Series | The Case the FOAM Faux Pas – Expert Review and Curated Commentary. Academic Life in Emergency Medicine. <a href="http://www.aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary" target="_blank">www.aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary</a>. Published 2015.', ]);
        expect(helpers.parseReferenceURLs([testRefs[2], ])).toEqual(['Colmers IN, Paterson QS, Lin M, Thoma B, Chan TM. The quality checklists for medical education blogs and podcasts. <i>The Winnower</i>. 2015. doi:<a href="https://doi.org/10.15200/winn.144720.08769" target="_blank">10.15200/winn.144720.08769</a>.', ]);
        expect(helpers.parseReferenceURLs([testRefs[3], ])).toEqual(['Mathieu S. Trial of Early, Goal-Directed Resuscitation for Septic Shock. The Bottom Line. <a href="http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716" target="_blank">http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716</a>. Published 2015.', ]);
        expect(helpers.parseReferenceURLs([testRefs[4], ])).toEqual(['Cameron P. Pundit-Based Medicine. Emergency Physicians International.', ]);
    });

});
