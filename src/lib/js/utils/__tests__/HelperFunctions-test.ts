jest.unmock('../HelperFunctions');

import * as helpers from '../HelperFunctions';

describe('parseReferenceURL', () => {

    // tslint:disable
    const testRefs: string[] = [
        'Body R. The ProMISe Study: EGDT RIP? St. Emlyn’s website. http://stemlynsblog.org/the-promise-study-egdt-rip/; http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/. Published 2015.',
        'Chan T, Helman A, Davis T, Purdy E. MEdIC Series | The Case the FOAM Faux Pas – Expert Review and Curated Commentary. Academic Life in Emergency Medicine. www.aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary. Published 2015.',
        'Colmers IN, Paterson QS, Lin M, Thoma B, Chan TM. The quality checklists for medical education blogs and podcasts. <i>The Winnower</i>. 2015. doi:10.15200/winn.144720.08769.',
        'Mathieu S. Trial of Early, Goal-Directed Resuscitation for Septic Shock. The Bottom Line. http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716. Published 2015.',
        'Cameron P. Pundit-Based Medicine. Emergency Physicians International.',
        `<div class="csl-left-margin">3. </div><div class="csl-right-inline">Dunning J. Unskilled and unaware of it. <i>Journal of Personality and Social Psychology</i>. 1999;77(6):1121-1134. http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf.</div>`,
    ];

    it('should find and replace URLs and DOIs correctly', () => {
        expect(helpers.parseReferenceURL(testRefs[0])).toEqual('Body R. The ProMISe Study: EGDT RIP? St. Emlyn’s website. <a href="http://stemlynsblog.org/the-promise-study-egdt-rip/" target="_blank">http://stemlynsblog.org/the-promise-study-egdt-rip/</a>; <a href="http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/" target="_blank">http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/</a>. Published 2015.');
        expect(helpers.parseReferenceURL(testRefs[1])).toEqual('Chan T, Helman A, Davis T, Purdy E. MEdIC Series | The Case the FOAM Faux Pas – Expert Review and Curated Commentary. Academic Life in Emergency Medicine. <a href="http://www.aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary" target="_blank">www.aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary</a>. Published 2015.');
        expect(helpers.parseReferenceURL(testRefs[2])).toEqual('Colmers IN, Paterson QS, Lin M, Thoma B, Chan TM. The quality checklists for medical education blogs and podcasts. <i>The Winnower</i>. 2015. doi:<a href="https://doi.org/10.15200/winn.144720.08769" target="_blank">10.15200/winn.144720.08769</a>.');
        expect(helpers.parseReferenceURL(testRefs[3])).toEqual('Mathieu S. Trial of Early, Goal-Directed Resuscitation for Septic Shock. The Bottom Line. <a href="http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716" target="_blank">http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716</a>. Published 2015.');
        expect(helpers.parseReferenceURL(testRefs[4])).toEqual('Cameron P. Pundit-Based Medicine. Emergency Physicians International.');
        expect(helpers.parseReferenceURL(testRefs[5])).toEqual('<div class="csl-left-margin">3. </div><div class="csl-right-inline">Dunning J. Unskilled and unaware of it. <i>Journal of Personality and Social Psychology</i>. 1999;77(6):1121-1134. <a href="http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf" target="_blank">http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf</a>.</div>');
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

describe('processCSLName', () => {

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
        expect(helpers.processCSLName(risNames[0], 'RIS')).toEqual({ family: 'Paterson', given: 'Quinten S' });
        expect(helpers.processCSLName(risNames[1], 'RIS')).toEqual({ family: 'Rezaie', given: 'Salim R' });
        expect(helpers.processCSLName(risNames[2], 'RIS')).toEqual({ family: 'Lawrentschuk', given: 'Nathan' });
        expect(helpers.processCSLName(risNames[3], 'RIS')).toEqual({ family: 'Straus', given: 'Sharon E' });
        expect(helpers.processCSLName(risNames[4], 'RIS')).toEqual({ family: 'Chan', given: 'Teresa M' });
    });

    it('should process PubMed names correctly', () => {
        expect(helpers.processCSLName(pubmedNames[0], 'pubmed')).toEqual({ family: 'Giebel', given: 'W' });
        expect(helpers.processCSLName(pubmedNames[1], 'pubmed')).toEqual({ family: 'Reijula', given: 'A' });
        expect(helpers.processCSLName(pubmedNames[2], 'pubmed')).toEqual({ family: 'Breuninger', given: 'H' });
        expect(helpers.processCSLName(pubmedNames[3], 'pubmed')).toEqual({ family: 'Ullmann', given: 'U' });
        expect(helpers.processCSLName(pubmedNames[4], 'pubmed')).toEqual({ family: 'Doe', given: 'JM' });
    });
});

describe('CSLFieldProcessors', () => {

    const risDates = [
        '1980/05/15/Spring',
        '2015///',
        '1998/12//',
        '1975/01/05/',
        '///fall',
        '',
        '///',
    ];

    const pubmedDates = [
        '1979/01/01 00:00',
        '1998/12/01 00:00',
        '1975/01/05 00:00',
        '2015/11/28 00:00',
        '1980/05/15 00:00',
        '',
    ];

    it('should process RIS dates correctly', () => {
        expect(helpers.processCSLDate(risDates[0], 'RIS')).toEqual({ 'date-parts': [['1980', '05', '15']], season: 'Spring' }); // tslint:disable-line
        expect(helpers.processCSLDate(risDates[1], 'RIS')).toEqual({ 'date-parts': [['2015']] });
        expect(helpers.processCSLDate(risDates[2], 'RIS')).toEqual({ 'date-parts': [['1998', '12']] });
        expect(helpers.processCSLDate(risDates[3], 'RIS')).toEqual({ 'date-parts': [['1975', '01', '05']] });
        expect(helpers.processCSLDate(risDates[4], 'RIS')).toEqual({ 'date-parts': [[]], season: 'fall' });
        expect(helpers.processCSLDate(risDates[5], 'RIS')).toEqual({ 'date-parts': [[]] });
        expect(helpers.processCSLDate(risDates[6], 'RIS')).toEqual({ 'date-parts': [[]] });
    });

    it('should process PubMed dates correctly', () => {
        expect(helpers.processCSLDate(pubmedDates[0], 'pubmed')).toEqual({ 'date-parts': [['1979', '01', '01']] });
        expect(helpers.processCSLDate(pubmedDates[1], 'pubmed')).toEqual({ 'date-parts': [['1998', '12', '01']] });
        expect(helpers.processCSLDate(pubmedDates[2], 'pubmed')).toEqual({ 'date-parts': [['1975', '01', '05']] });
        expect(helpers.processCSLDate(pubmedDates[3], 'pubmed')).toEqual({ 'date-parts': [['2015', '11', '28']] });
        expect(helpers.processCSLDate(pubmedDates[4], 'pubmed')).toEqual({ 'date-parts': [['1980', '05', '15']] });
        expect(helpers.processCSLDate(pubmedDates[5], 'pubmed')).toEqual({ 'date-parts': [[]] });
    });
});

describe('processPubmedJSON', () => {

    const testData: PubMed.SingleReference[] = [{
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
    }];

    it('should process PubMed JSON to CSL', () => {
        expect(helpers.processPubmedJSON(testData)).toEqual([{
            ISSN: '3',
            PMID: '12345',
            URL: 'http://www.test.com',
            author: [{ family: 'Doe', given: 'JD' }],
            'chapter-number': '1',
            'container-title-short': 'J Test',
            'container-title': 'Journal of Testing',
            edition: '2',
            id: '0',
            issue: '4',
            issued: {'date-parts': [[ '2016', '08', '19' ]]},
            journalAbbreviation: 'J Test',
            language: 'en-US',
            medium: 'print',
            number: '5',
            page: '100-3',
            'publisher-place': 'USA',
            publisher: 'Test',
            title: 'Test Title',
            type: 'article-journal',
            volume: '6',
        }]);
    });

    it('should move past empty fields', () => {
        expect(
            helpers.processPubmedJSON([{ publishername: '' }])
        ).toEqual(
            [{ author: [], id: '0', type: 'article-journal' }]
        );
    });

    it('should default to en-US when language can\'t be found', () => {
        expect(
            helpers.processPubmedJSON([{ lang: ['Gibberish'] }])
        ).toEqual(
            [{ author: [], id: '0', language: 'en-US', type: 'article-journal' }]
        );
    });

    it('should move past undefined fields', () => {
        expect(
            helpers.processPubmedJSON([{ thisFieldDoesntExist: 'test' }] as any)
        ).toEqual(
            [{ author: [], id: '0', type: 'article-journal' }]
        );
    });

});
