jest.unmock('../HelperFunctions');

import * as helpers from '../HelperFunctions';

// tslint:disable
const testRefs: string[] = [
    'Body R. The ProMISe Study: EGDT RIP? St. Emlyn’s website. http://stemlynsblog.org/the-promise-study-egdt-rip/; http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/. Published 2015.',
    'Chan T, Helman A, Davis T, Purdy E. MEdIC Series | The Case the FOAM Faux Pas – Expert Review and Curated Commentary. Academic Life in Emergency Medicine. www.aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary. Published 2015.',
    'Colmers IN, Paterson QS, Lin M, Thoma B, Chan TM. The quality checklists for medical education blogs and podcasts. <i>The Winnower</i>. 2015. doi:10.15200/winn.144720.08769.',
    'Mathieu S. Trial of Early, Goal-Directed Resuscitation for Septic Shock. The Bottom Line. http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716. Published 2015.',
    'Cameron P. Pundit-Based Medicine. Emergency Physicians International.',
];

describe('URL Parser', () => {
    it('should find and replace URLs and DOIs correctly', () => {
        expect(helpers.parseReferenceURLs(testRefs[0])).toEqual('Body R. The ProMISe Study: EGDT RIP? St. Emlyn’s website. <a href="http://stemlynsblog.org/the-promise-study-egdt-rip/" target="_blank">http://stemlynsblog.org/the-promise-study-egdt-rip/</a>; <a href="http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/" target="_blank">http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/</a>. Published 2015.');
        expect(helpers.parseReferenceURLs(testRefs[1])).toEqual('Chan T, Helman A, Davis T, Purdy E. MEdIC Series | The Case the FOAM Faux Pas – Expert Review and Curated Commentary. Academic Life in Emergency Medicine. <a href="http://www.aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary" target="_blank">www.aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary</a>. Published 2015.');
        expect(helpers.parseReferenceURLs(testRefs[2])).toEqual('Colmers IN, Paterson QS, Lin M, Thoma B, Chan TM. The quality checklists for medical education blogs and podcasts. <i>The Winnower</i>. 2015. doi:<a href="https://doi.org/10.15200/winn.144720.08769" target="_blank">10.15200/winn.144720.08769</a>.');
        expect(helpers.parseReferenceURLs(testRefs[3])).toEqual('Mathieu S. Trial of Early, Goal-Directed Resuscitation for Septic Shock. The Bottom Line. <a href="http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716" target="_blank">http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716</a>. Published 2015.');
        expect(helpers.parseReferenceURLs(testRefs[4])).toEqual('Cameron P. Pundit-Based Medicine. Emergency Physicians International.');
    });
});

describe('generateID', () => {
    it('should generate unique IDs', () => {
        const test: string[] = [];
        for (let i = 0; i < 50; i++) {
            test.push(helpers.generateID());
        }
        expect(Array.from(new Set(test)).length).toBe(50);
    });
});
