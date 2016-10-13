import { asMap, ObservableMap } from 'mobx';

import {
    formatBibliography,
    generateID,
    parseReferenceURL,
    preventScrollPropagation,
    processCSLDate,
    processCSLName,
    processPubmedJSON,
} from '../HelperFunctions';

describe('HelperFunctions', () => {

    describe('preventScrollPropagation()', () => {

        class Component {
            element;
            constructor(o, h, t) {
                this.element = {
                    offsetHeight: o,
                    scrollHeight: h,
                    scrollTop: t,
                };
            }
        }

        const setup = (o, h, t, d) => {
            const stopPropagation = jest.fn();
            const preventDefault = jest.fn();
            return {
                component: new Component(o, h, t),
                e: {
                    stopPropagation,
                    preventDefault,
                    deltaY: d,
                },
                stopPropagation,
                preventDefault,
            };
        };

        it('should stop at top and scrolling up', () => {
            const { component, e, preventDefault, stopPropagation } = setup(12, 15, 0, -10);
            preventScrollPropagation.call(component, e);
            expect(stopPropagation).toBeCalled();
            expect(preventDefault).toBeCalled();
        });

        it('should stop at bottom and scrolling down', () => {
            const { component, e, preventDefault, stopPropagation } = setup(50, 100, 50, 10);
            preventScrollPropagation.call(component, e);
            expect(stopPropagation).toBeCalled();
            expect(preventDefault).toBeCalled();
        });

        it('should not stop when conditions are not met', () => {
            const { component, e, preventDefault, stopPropagation } = setup(15, 10, 560, 10);
            preventScrollPropagation.call(component, e);
            expect(stopPropagation).toBeCalled();
            expect(preventDefault).not.toBeCalled();
        });
    });

    describe('formatBibliography()', () => {

        // tslint:disable
        const sansHangingIndent = [
            `  <div class="csl-entry">\n    <div class="csl-left-margin">1. </div><div class="csl-right-inline">Westreich M. Preventing complications of subclavian vein catheterization. <i>JACEP</i>. 1978;7(10):368-371.</div>\n  </div>\n`,
            `  <div class="csl-entry">\n    <div class="csl-left-margin">2. </div><div class="csl-right-inline">Manjunath R, Namboodiri M, Ramasarma T. Differential changes in phenylalanine hydroxylase, tyrosine aminotransferase &#38; tryptophan pyrrolase during hepatic regeneration. <i>Indian J Biochem Biophys</i>. 1978;15(3):183-187.</div>\n  </div>\n`,
        ];
        const hangingIndent = [
            `  <div class="csl-entry">Manjunath, R, MA Namboodiri, and T Ramasarma. 1978. “Differential Changes in Phenylalanine Hydroxylase, Tyrosine Aminotransferase &#38; Tryptophan Pyrrolase during Hepatic Regeneration.” <i>Indian Journal of Biochemistry &#38;amp; Biophysics</i> 15 (3): 183–87.</div>\n`,
            `  <div class="csl-entry">Westreich, M. 1978. “Preventing Complications of Subclavian Vein Catheterization.” <i>JACEP</i> 7 (10): 368–71.</div>\n`,
        ];

        const errorString = '\n[CSL STYLE ERROR: reference with no printed form.]';

        const setupArgs = (
            sfo: 'margin'|'flush'|boolean = false,
            hi: boolean = false,
            es: number = 0,
            ls: number = 0,
            mo: number = 0,
        ): [Citeproc.Bibliography, ABT.LinkStyle, ObservableMap<CSL.Data>] => {
            return [
                [
                    {
                        bibend: '',
                        bibliography_errors: [],
                        bibstart: '',
                        done: true,
                        entry_ids: [['1btbi6t45'], ['r1hn0qg7']],
                        entryspacing: es,
                        hangingindent: hi,
                        linespacing: ls,
                        maxoffset: mo,
                        'second-field-align': sfo,
                    },
                    hi ? hangingIndent : sansHangingIndent,
                ],
                'never',
                asMap(JSON.parse(`{"1btbi6t45":{"id":"1btbi6t45","type":"article-journal","author":[{"family":"Manjunath","given":"R"},{"family":"Namboodiri","given":"MA"},{"family":"Ramasarma","given":"T"}],"PMID":"34563","journalAbbreviation":"Indian J Biochem Biophys","container-title-short":"Indian J Biochem Biophys","title":"Differential changes in phenylalanine hydroxylase, tyrosine aminotransferase & tryptophan pyrrolase during hepatic regeneration.","volume":"15","issue":"3","page":"183-7","language":"en-US","ISSN":"0301-1208","container-title":"Indian journal of biochemistry &amp; biophysics","issued":{"date-parts":[["1978","06","01"]]}},"r1hn0qg7":{"id":"r1hn0qg7","type":"article-journal","author":[{"family":"Westreich","given":"M"}],"PMID":"45674","journalAbbreviation":"JACEP","container-title-short":"JACEP","title":"Preventing complications of subclavian vein catheterization.","volume":"7","issue":"10","page":"368-71","language":"en-US","ISSN":"0361-1124","container-title":"JACEP","issued":{"date-parts":[["1978","10","01"]]}}}`)),
            ];
        };
        // tslint:enable

        it('should handle a variety of different bibOptions', () => {
            const temp = document.createElement('DIV');
            // plain, no added options. PMID available.
            let [rawBib, links, cslmap] = setupArgs();
            temp.innerHTML = formatBibliography(rawBib, links, cslmap)[0].html;
            expect(temp.querySelector('.csl-entry').classList.toString()).toBe('csl-entry');
            expect(temp.querySelector('.csl-entry').childElementCount).toBe(2);

            // hanging indent, with entryspacing and linespacing. DOI available
            ([rawBib, links, cslmap] = setupArgs(null, true, 3, 3));
            let item = cslmap.get('1btbi6t45');
            item.PMID = undefined;
            item.DOI = '10.000/100.1';
            cslmap.set('1btbi6t45', item);
            temp.innerHTML = formatBibliography(rawBib, links, cslmap)[0].html;
            expect(temp.querySelector('.csl-entry').classList.toString()).toBe('csl-entry hanging-indent');
            expect(temp.querySelector('.csl-entry').childElementCount).toBe(1);
            expect((<HTMLDivElement>temp.querySelector('.csl-entry')).style.cssText).toBe('line-height: 3; margin: 2em auto;'); // tslint:disable-line

            // second-field-align: margin. PMCID available
            ([rawBib, links, cslmap] = setupArgs('margin'));
            item = cslmap.get('1btbi6t45');
            item.PMID = undefined;
            item.PMCID = 'PMC12345';
            cslmap.set('1btbi6t45', item);
            temp.innerHTML = formatBibliography(rawBib, links, cslmap)[0].html;
            expect(temp.querySelector('.csl-entry').classList.toString()).toBe('csl-entry margin');
            expect(temp.querySelector('.csl-entry').childElementCount).toBe(2);

            // second-field-align: flush, hanging-indent. URL available
            ([rawBib, links, cslmap] = setupArgs('flush', true));
            item = cslmap.get('1btbi6t45');
            item.PMID = undefined;
            item.URL = 'https://www.google.com';
            cslmap.set('1btbi6t45', item);
            temp.innerHTML = formatBibliography(rawBib, links, cslmap)[0].html;
            expect(temp.querySelector('.csl-entry').classList.toString()).toBe('csl-entry hanging-indent flush');
            expect(temp.querySelector('.csl-entry').childElementCount).toBe(1);

            // plain, no added options. No identifiers available
            ([rawBib, links, cslmap] = setupArgs());
            item = cslmap.get('1btbi6t45');
            item.PMID = undefined;
            cslmap.set('1btbi6t45', item);
            temp.innerHTML = formatBibliography(rawBib, links, cslmap)[0].html;
            expect(temp.querySelector('.csl-entry').classList.toString()).toBe('csl-entry');
            expect(temp.querySelector('.csl-entry').childElementCount).toBe(2);
        });

        it('should return an error string if one exists', () => {
            const [rawBib, links, cslmap] = setupArgs();
            rawBib[1].push(errorString);
            rawBib[0].entry_ids.push(['errorstring']);
            expect(formatBibliography(rawBib, links, cslmap)[2].html).toBe(errorString);
        });
    });

    describe('generateID()', () => {
        it('should generate unique IDs', () => {
            const test: string[] = [];
            for (let i = 0; i < 50; i++) {
                test.push(generateID());
            }
            expect(Array.from(new Set(test)).length).toBe(50);
        });
    });

    describe('processCSLDate()', () => {
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
            expect(processCSLDate(risDates[0], 'RIS')).toEqual({ 'date-parts': [['1980', '05', '15']], season: 'Spring' }); // tslint:disable-line
            expect(processCSLDate(risDates[1], 'RIS')).toEqual({ 'date-parts': [['2015']] });
            expect(processCSLDate(risDates[2], 'RIS')).toEqual({ 'date-parts': [['1998', '12']] });
            expect(processCSLDate(risDates[3], 'RIS')).toEqual({ 'date-parts': [['1975', '01', '05']] });
            expect(processCSLDate(risDates[4], 'RIS')).toEqual({ 'date-parts': [[]], season: 'fall' });
            expect(processCSLDate(risDates[5], 'RIS')).toEqual({ 'date-parts': [[]] });
            expect(processCSLDate(risDates[6], 'RIS')).toEqual({ 'date-parts': [[]] });
        });

        it('should process PubMed dates correctly', () => {
            expect(processCSLDate(pubmedDates[0], 'pubmed')).toEqual({ 'date-parts': [['1979', '01', '01']] });
            expect(processCSLDate(pubmedDates[1], 'pubmed')).toEqual({ 'date-parts': [['1998', '12', '01']] });
            expect(processCSLDate(pubmedDates[2], 'pubmed')).toEqual({ 'date-parts': [['1975', '01', '05']] });
            expect(processCSLDate(pubmedDates[3], 'pubmed')).toEqual({ 'date-parts': [['2015', '11', '28']] });
            expect(processCSLDate(pubmedDates[4], 'pubmed')).toEqual({ 'date-parts': [['1980', '05', '15']] });
            expect(processCSLDate(pubmedDates[5], 'pubmed')).toEqual({ 'date-parts': [[]] });
        });
    });

    describe('processCSLName()', () => {
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
            expect(processCSLName(risNames[0], 'RIS')).toEqual({ family: 'Paterson', given: 'Quinten S' });
            expect(processCSLName(risNames[1], 'RIS')).toEqual({ family: 'Rezaie', given: 'Salim R' });
            expect(processCSLName(risNames[2], 'RIS')).toEqual({ family: 'Lawrentschuk', given: 'Nathan' });
            expect(processCSLName(risNames[3], 'RIS')).toEqual({ family: 'Straus', given: 'Sharon E' });
            expect(processCSLName(risNames[4], 'RIS')).toEqual({ family: 'Chan', given: 'Teresa M' });
        });

        it('should process PubMed names correctly', () => {
            expect(processCSLName(pubmedNames[0], 'pubmed')).toEqual({ family: 'Giebel', given: 'W' });
            expect(processCSLName(pubmedNames[1], 'pubmed')).toEqual({ family: 'Reijula', given: 'A' });
            expect(processCSLName(pubmedNames[2], 'pubmed')).toEqual({ family: 'Breuninger', given: 'H' });
            expect(processCSLName(pubmedNames[3], 'pubmed')).toEqual({ family: 'Ullmann', given: 'U' });
            expect(processCSLName(pubmedNames[4], 'pubmed')).toEqual({ family: 'Doe', given: 'JM' });
        });
    });

    describe('processPubmedJSON()', () => {
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
            expect(processPubmedJSON(testData)).toEqual([{
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
                processPubmedJSON([{ publishername: '' }])
            ).toEqual(
                [{ author: [], id: '0', type: 'article-journal' }]
            );
        });

        it('should default to en-US when language can\'t be found', () => {
            expect(
                processPubmedJSON([{ lang: ['Gibberish'] }])
            ).toEqual(
                [{ author: [], id: '0', language: 'en-US', type: 'article-journal' }]
            );
        });

        it('should move past undefined fields', () => {
            expect(
                processPubmedJSON(<any>[{ thisFieldDoesntExist: 'test' }])
            ).toEqual(
                [{ author: [], id: '0', type: 'article-journal' }]
            );
        });

    });

    // tslint:disable
    describe('parseReferenceURL()', () => {
        const testRefs: string[] = [
            `Body R. The ProMISe Study: EGDT RIP? St. Emlyn’s website. http://stemlynsblog.org/the-promise-study-egdt-rip/; http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/. Published 2015.`,
            `Chan T, Helman A, Davis T, Purdy E. MEdIC Series | The Case the FOAM Faux Pas – Expert Review and Curated Commentary. Academic Life in Emergency Medicine. www.aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary. Published 2015.`,
            `Colmers IN, Paterson QS, Lin M, Thoma B, Chan TM. The quality checklists for medical education blogs and podcasts. <i>The Winnower</i>. 2015. doi:10.15200/winn.144720.08769.`,
            `Mathieu S. Trial of Early, Goal-Directed Resuscitation for Septic Shock. The Bottom Line. http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716. Published 2015.`,
            `Cameron P. Pundit-Based Medicine. Emergency Physicians International.`,
            `Dunning J. Unskilled and unaware of it. <i>Journal of Personality and Social Psychology</i>. 1999;77(6):1121-1134. http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf.`,
        ];

        const PMID = '12345';
        const DOI = '10.1097/TA.0000000000001031';
        const PMCID = 'PMC12345';
        const URL = 'https://www.google.com';

        it('should replace html entities if they exist', () => {
            const testString = `This is a test. &amp; = ampersand. &gt; = greater than. &lt; = less than. &quot; = double quotes.`;
            expect(parseReferenceURL(
                testString, 'always'
            )).toBe(`This is a test. & = ampersand. > = greater than. < = less than. " = double quotes.`);
        });

        describe('link style: "always"', () => {
            it('should handle PMIDs', () => {
                expect(parseReferenceURL(
                    testRefs[0], 'always', { kind: 'PMID', value: PMID }
                )).toBe('Body R. The ProMISe Study: EGDT RIP? St. Emlyn’s website. <a href="http://stemlynsblog.org/the-promise-study-egdt-rip/" target="_blank">http://stemlynsblog.org/the-promise-study-egdt-rip/</a>; <a href="http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/" target="_blank">http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/</a>. Published 2015.<span class="abt-url"> [<a href="http://www.ncbi.nlm.nih.gov/pubmed/12345" target="_blank">PubMed</a>]</span>')
                expect(parseReferenceURL(
                    testRefs[1], 'always', { kind: 'PMID', value: PMID }
                )).toBe('Chan T, Helman A, Davis T, Purdy E. MEdIC Series | The Case the FOAM Faux Pas – Expert Review and Curated Commentary. Academic Life in Emergency Medicine. <a href="http://aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary" target="_blank">http://aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary</a>. Published 2015.<span class="abt-url"> [<a href="http://www.ncbi.nlm.nih.gov/pubmed/12345" target="_blank">PubMed</a>]</span>');
                expect(parseReferenceURL(
                    testRefs[2], 'always', { kind: 'PMID', value: PMID }
                )).toBe('Colmers IN, Paterson QS, Lin M, Thoma B, Chan TM. The quality checklists for medical education blogs and podcasts. <i>The Winnower</i>. 2015. doi: <a href="https://dx.doi.org/10.15200/winn.144720.08769\" target="_blank">10.15200/winn.144720.08769</a><span class="abt-url"> [<a href="http://www.ncbi.nlm.nih.gov/pubmed/12345" target="_blank">PubMed</a>]</span>');
                expect(parseReferenceURL(
                    testRefs[3], 'always', { kind: 'PMID', value: PMID }
                )).toBe('Mathieu S. Trial of Early, Goal-Directed Resuscitation for Septic Shock. The Bottom Line. <a href="http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716" target="_blank">http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716</a>. Published 2015.<span class="abt-url"> [<a href="http://www.ncbi.nlm.nih.gov/pubmed/12345" target="_blank">PubMed</a>]</span>')
                expect(parseReferenceURL(
                    testRefs[4], 'always', { kind: 'PMID', value: PMID }
                )).toBe('Cameron P. Pundit-Based Medicine. Emergency Physicians International.<span class="abt-url"> [<a href="http://www.ncbi.nlm.nih.gov/pubmed/12345" target="_blank">PubMed</a>]</span>')
                expect(parseReferenceURL(
                    testRefs[5], 'always', { kind: 'PMID', value: PMID }
                )).toBe(`Dunning J. Unskilled and unaware of it. <i>Journal of Personality and Social Psychology</i>. 1999;77(6):1121-1134. <a href="http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf" target="_blank">http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf</a>.<span class="abt-url"> [<a href="http://www.ncbi.nlm.nih.gov/pubmed/12345" target="_blank">PubMed</a>]</span>`)
            });
            it('should handle DOIs', () => {
                expect(parseReferenceURL(
                    testRefs[0], 'always', { kind: 'DOI', value: DOI }
                )).toBe('Body R. The ProMISe Study: EGDT RIP? St. Emlyn’s website. <a href="http://stemlynsblog.org/the-promise-study-egdt-rip/" target="_blank">http://stemlynsblog.org/the-promise-study-egdt-rip/</a>; <a href="http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/" target="_blank">http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/</a>. Published 2015.<span class="abt-url"> [<a href="https://dx.doi.org/10.1097/TA.0000000000001031" target="_blank">Source</a>]</span>')
                expect(parseReferenceURL(
                    testRefs[1], 'always', { kind: 'DOI', value: DOI }
                )).toBe('Chan T, Helman A, Davis T, Purdy E. MEdIC Series | The Case the FOAM Faux Pas – Expert Review and Curated Commentary. Academic Life in Emergency Medicine. <a href="http://aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary" target="_blank">http://aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary</a>. Published 2015.<span class="abt-url"> [<a href="https://dx.doi.org/10.1097/TA.0000000000001031" target="_blank">Source</a>]</span>');
                expect(parseReferenceURL(
                    testRefs[2], 'always', { kind: 'DOI', value: DOI }
                )).toBe('Colmers IN, Paterson QS, Lin M, Thoma B, Chan TM. The quality checklists for medical education blogs and podcasts. <i>The Winnower</i>. 2015. doi: <a href="https://dx.doi.org/10.15200/winn.144720.08769\" target="_blank">10.15200/winn.144720.08769</a><span class="abt-url"> [<a href="https://dx.doi.org/10.1097/TA.0000000000001031" target="_blank">Source</a>]</span>');
                expect(parseReferenceURL(
                    testRefs[3], 'always', { kind: 'DOI', value: DOI }
                )).toBe('Mathieu S. Trial of Early, Goal-Directed Resuscitation for Septic Shock. The Bottom Line. <a href="http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716" target="_blank">http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716</a>. Published 2015.<span class="abt-url"> [<a href="https://dx.doi.org/10.1097/TA.0000000000001031" target="_blank">Source</a>]</span>')
                expect(parseReferenceURL(
                    testRefs[4], 'always', { kind: 'DOI', value: DOI }
                )).toBe('Cameron P. Pundit-Based Medicine. Emergency Physicians International.<span class="abt-url"> [<a href="https://dx.doi.org/10.1097/TA.0000000000001031" target="_blank">Source</a>]</span>')
                expect(parseReferenceURL(
                    testRefs[5], 'always', { kind: 'DOI', value: DOI }
                )).toBe(`Dunning J. Unskilled and unaware of it. <i>Journal of Personality and Social Psychology</i>. 1999;77(6):1121-1134. <a href="http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf" target="_blank">http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf</a>.<span class="abt-url"> [<a href="https://dx.doi.org/10.1097/TA.0000000000001031" target="_blank">Source</a>]</span>`)
            });
            it('should handle PMCIDs', () => {
                expect(parseReferenceURL(
                    testRefs[0], 'always', { kind: 'PMCID', value: PMCID }
                )).toBe('Body R. The ProMISe Study: EGDT RIP? St. Emlyn’s website. <a href="http://stemlynsblog.org/the-promise-study-egdt-rip/" target="_blank">http://stemlynsblog.org/the-promise-study-egdt-rip/</a>; <a href="http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/" target="_blank">http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/</a>. Published 2015.<span class="abt-url"> [<a href="http://www.ncbi.nlm.nih.gov/pmc/articles/PMC12345" target="_blank">PMC</a>]</span>')
                expect(parseReferenceURL(
                    testRefs[1], 'always', { kind: 'PMCID', value: PMCID }
                )).toBe('Chan T, Helman A, Davis T, Purdy E. MEdIC Series | The Case the FOAM Faux Pas – Expert Review and Curated Commentary. Academic Life in Emergency Medicine. <a href="http://aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary" target="_blank">http://aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary</a>. Published 2015.<span class="abt-url"> [<a href="http://www.ncbi.nlm.nih.gov/pmc/articles/PMC12345" target="_blank">PMC</a>]</span>');
                expect(parseReferenceURL(
                    testRefs[2], 'always', { kind: 'PMCID', value: PMCID }
                )).toBe('Colmers IN, Paterson QS, Lin M, Thoma B, Chan TM. The quality checklists for medical education blogs and podcasts. <i>The Winnower</i>. 2015. doi: <a href="https://dx.doi.org/10.15200/winn.144720.08769\" target="_blank">10.15200/winn.144720.08769</a><span class="abt-url"> [<a href="http://www.ncbi.nlm.nih.gov/pmc/articles/PMC12345" target="_blank">PMC</a>]</span>');
                expect(parseReferenceURL(
                    testRefs[3], 'always', { kind: 'PMCID', value: PMCID }
                )).toBe('Mathieu S. Trial of Early, Goal-Directed Resuscitation for Septic Shock. The Bottom Line. <a href="http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716" target="_blank">http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716</a>. Published 2015.<span class="abt-url"> [<a href="http://www.ncbi.nlm.nih.gov/pmc/articles/PMC12345" target="_blank">PMC</a>]</span>')
                expect(parseReferenceURL(
                    testRefs[4], 'always', { kind: 'PMCID', value: PMCID }
                )).toBe('Cameron P. Pundit-Based Medicine. Emergency Physicians International.<span class="abt-url"> [<a href="http://www.ncbi.nlm.nih.gov/pmc/articles/PMC12345" target="_blank">PMC</a>]</span>')
                expect(parseReferenceURL(
                    testRefs[5], 'always', { kind: 'PMCID', value: PMCID }
                )).toBe(`Dunning J. Unskilled and unaware of it. <i>Journal of Personality and Social Psychology</i>. 1999;77(6):1121-1134. <a href="http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf" target="_blank">http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf</a>.<span class="abt-url"> [<a href="http://www.ncbi.nlm.nih.gov/pmc/articles/PMC12345" target="_blank">PMC</a>]</span>`)
            });
            it('should handle URLs', () => {
                expect(parseReferenceURL(
                    testRefs[0], 'always', { kind: 'URL', value: URL }
                )).toBe('Body R. The ProMISe Study: EGDT RIP? St. Emlyn’s website. <a href="http://stemlynsblog.org/the-promise-study-egdt-rip/" target="_blank">http://stemlynsblog.org/the-promise-study-egdt-rip/</a>; <a href="http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/" target="_blank">http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/</a>. Published 2015.<span class="abt-url"> [<a href="https://www.google.com" target="_blank">Source</a>]</span>')
                expect(parseReferenceURL(
                    testRefs[1], 'always', { kind: 'URL', value: URL }
                )).toBe('Chan T, Helman A, Davis T, Purdy E. MEdIC Series | The Case the FOAM Faux Pas – Expert Review and Curated Commentary. Academic Life in Emergency Medicine. <a href="http://aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary" target="_blank">http://aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary</a>. Published 2015.<span class="abt-url"> [<a href="https://www.google.com" target="_blank">Source</a>]</span>');
                expect(parseReferenceURL(
                    testRefs[2], 'always', { kind: 'URL', value: URL }
                )).toBe('Colmers IN, Paterson QS, Lin M, Thoma B, Chan TM. The quality checklists for medical education blogs and podcasts. <i>The Winnower</i>. 2015. doi: <a href="https://dx.doi.org/10.15200/winn.144720.08769\" target="_blank">10.15200/winn.144720.08769</a><span class="abt-url"> [<a href="https://www.google.com" target="_blank">Source</a>]</span>');
                expect(parseReferenceURL(
                    testRefs[3], 'always', { kind: 'URL', value: URL }
                )).toBe('Mathieu S. Trial of Early, Goal-Directed Resuscitation for Septic Shock. The Bottom Line. <a href="http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716" target="_blank">http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716</a>. Published 2015.<span class="abt-url"> [<a href="https://www.google.com" target="_blank">Source</a>]</span>')
                expect(parseReferenceURL(
                    testRefs[4], 'always', { kind: 'URL', value: URL }
                )).toBe('Cameron P. Pundit-Based Medicine. Emergency Physicians International.<span class="abt-url"> [<a href="https://www.google.com" target="_blank">Source</a>]</span>')
                expect(parseReferenceURL(
                    testRefs[5], 'always', { kind: 'URL', value: URL }
                )).toBe(`Dunning J. Unskilled and unaware of it. <i>Journal of Personality and Social Psychology</i>. 1999;77(6):1121-1134. <a href="http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf" target="_blank">http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf</a>.<span class="abt-url"> [<a href="https://www.google.com" target="_blank">Source</a>]</span>`)
            });
            it('should handle undefined identifiers', () => {
                expect(parseReferenceURL(
                    testRefs[0], 'always'
                )).toBe('Body R. The ProMISe Study: EGDT RIP? St. Emlyn’s website. <a href="http://stemlynsblog.org/the-promise-study-egdt-rip/" target="_blank">http://stemlynsblog.org/the-promise-study-egdt-rip/</a>; <a href="http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/" target="_blank">http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/</a>. Published 2015.')
                expect(parseReferenceURL(
                    testRefs[1], 'always'
                )).toBe('Chan T, Helman A, Davis T, Purdy E. MEdIC Series | The Case the FOAM Faux Pas – Expert Review and Curated Commentary. Academic Life in Emergency Medicine. <a href="http://aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary" target="_blank">http://aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary</a>. Published 2015.');
                expect(parseReferenceURL(
                    testRefs[2], 'always'
                )).toBe('Colmers IN, Paterson QS, Lin M, Thoma B, Chan TM. The quality checklists for medical education blogs and podcasts. <i>The Winnower</i>. 2015. doi: <a href="https://dx.doi.org/10.15200/winn.144720.08769\" target="_blank">10.15200/winn.144720.08769</a>');
                expect(parseReferenceURL(
                    testRefs[3], 'always'
                )).toBe('Mathieu S. Trial of Early, Goal-Directed Resuscitation for Septic Shock. The Bottom Line. <a href="http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716" target="_blank">http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716</a>. Published 2015.')
                expect(parseReferenceURL(
                    testRefs[4], 'always'
                )).toBe('Cameron P. Pundit-Based Medicine. Emergency Physicians International.')
                expect(parseReferenceURL(
                    testRefs[5], 'always'
                )).toBe(`Dunning J. Unskilled and unaware of it. <i>Journal of Personality and Social Psychology</i>. 1999;77(6):1121-1134. <a href="http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf" target="_blank">http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf</a>.`)
            });

        });

        describe('link style: "always-full-surround"', () => {
            it('should handle PMIDs', () => {
                expect(parseReferenceURL(
                    testRefs[0], 'always-full-surround', { kind: 'PMID', value: PMID }
                )).toBe('<a href="http://www.ncbi.nlm.nih.gov/pubmed/12345" target="_blank">Body R. The ProMISe Study: EGDT RIP? St. Emlyn’s website. http://stemlynsblog.org/the-promise-study-egdt-rip/; http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/. Published 2015.</a>')
                expect(parseReferenceURL(
                    testRefs[1], 'always-full-surround', { kind: 'PMID', value: PMID }
                )).toBe('<a href="http://www.ncbi.nlm.nih.gov/pubmed/12345" target="_blank">Chan T, Helman A, Davis T, Purdy E. MEdIC Series | The Case the FOAM Faux Pas – Expert Review and Curated Commentary. Academic Life in Emergency Medicine. www.aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary. Published 2015.</a>');
                expect(parseReferenceURL(
                    testRefs[2], 'always-full-surround', { kind: 'PMID', value: PMID }
                )).toBe('<a href="http://www.ncbi.nlm.nih.gov/pubmed/12345" target="_blank">Colmers IN, Paterson QS, Lin M, Thoma B, Chan TM. The quality checklists for medical education blogs and podcasts. <i>The Winnower</i>. 2015. doi:10.15200/winn.144720.08769.</a>');
                expect(parseReferenceURL(
                    testRefs[3], 'always-full-surround', { kind: 'PMID', value: PMID }
                )).toBe('<a href="http://www.ncbi.nlm.nih.gov/pubmed/12345" target="_blank">Mathieu S. Trial of Early, Goal-Directed Resuscitation for Septic Shock. The Bottom Line. http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716. Published 2015.</a>')
                expect(parseReferenceURL(
                    testRefs[4], 'always-full-surround', { kind: 'PMID', value: PMID }
                )).toBe('<a href="http://www.ncbi.nlm.nih.gov/pubmed/12345" target="_blank">Cameron P. Pundit-Based Medicine. Emergency Physicians International.</a>')
                expect(parseReferenceURL(
                    testRefs[5], 'always-full-surround', { kind: 'PMID', value: PMID }
                )).toBe(`<a href="http://www.ncbi.nlm.nih.gov/pubmed/12345" target="_blank">Dunning J. Unskilled and unaware of it. <i>Journal of Personality and Social Psychology</i>. 1999;77(6):1121-1134. http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf.</a>`)
            });
            it('should handle DOIs', () => {
                expect(parseReferenceURL(
                    testRefs[0], 'always-full-surround', { kind: 'DOI', value: DOI }
                )).toBe('<a href="https://dx.doi.org/10.1097/TA.0000000000001031" target="_blank">Body R. The ProMISe Study: EGDT RIP? St. Emlyn’s website. http://stemlynsblog.org/the-promise-study-egdt-rip/; http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/. Published 2015.</a>')
                expect(parseReferenceURL(
                    testRefs[1], 'always-full-surround', { kind: 'DOI', value: DOI }
                )).toBe('<a href="https://dx.doi.org/10.1097/TA.0000000000001031" target="_blank">Chan T, Helman A, Davis T, Purdy E. MEdIC Series | The Case the FOAM Faux Pas – Expert Review and Curated Commentary. Academic Life in Emergency Medicine. www.aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary. Published 2015.</a>');
                expect(parseReferenceURL(
                    testRefs[2], 'always-full-surround', { kind: 'DOI', value: DOI }
                )).toBe('<a href="https://dx.doi.org/10.1097/TA.0000000000001031" target="_blank">Colmers IN, Paterson QS, Lin M, Thoma B, Chan TM. The quality checklists for medical education blogs and podcasts. <i>The Winnower</i>. 2015. doi:10.15200/winn.144720.08769.</a>');
                expect(parseReferenceURL(
                    testRefs[3], 'always-full-surround', { kind: 'DOI', value: DOI }
                )).toBe('<a href="https://dx.doi.org/10.1097/TA.0000000000001031" target="_blank">Mathieu S. Trial of Early, Goal-Directed Resuscitation for Septic Shock. The Bottom Line. http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716. Published 2015.</a>')
                expect(parseReferenceURL(
                    testRefs[4], 'always-full-surround', { kind: 'DOI', value: DOI }
                )).toBe('<a href="https://dx.doi.org/10.1097/TA.0000000000001031" target="_blank">Cameron P. Pundit-Based Medicine. Emergency Physicians International.</a>')
                expect(parseReferenceURL(
                    testRefs[5], 'always-full-surround', { kind: 'DOI', value: DOI }
                )).toBe(`<a href="https://dx.doi.org/10.1097/TA.0000000000001031" target="_blank">Dunning J. Unskilled and unaware of it. <i>Journal of Personality and Social Psychology</i>. 1999;77(6):1121-1134. http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf.</a>`)
            });
            it('should handle PMCIDs', () => {
                expect(parseReferenceURL(
                    testRefs[0], 'always-full-surround', { kind: 'PMCID', value: PMCID }
                )).toBe('<a href="http://www.ncbi.nlm.nih.gov/pmc/articles/PMC12345" target="_blank">Body R. The ProMISe Study: EGDT RIP? St. Emlyn’s website. http://stemlynsblog.org/the-promise-study-egdt-rip/; http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/. Published 2015.</a>')
                expect(parseReferenceURL(
                    testRefs[1], 'always-full-surround', { kind: 'PMCID', value: PMCID }
                )).toBe('<a href="http://www.ncbi.nlm.nih.gov/pmc/articles/PMC12345" target="_blank">Chan T, Helman A, Davis T, Purdy E. MEdIC Series | The Case the FOAM Faux Pas – Expert Review and Curated Commentary. Academic Life in Emergency Medicine. www.aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary. Published 2015.</a>');
                expect(parseReferenceURL(
                    testRefs[2], 'always-full-surround', { kind: 'PMCID', value: PMCID }
                )).toBe('<a href="http://www.ncbi.nlm.nih.gov/pmc/articles/PMC12345" target="_blank">Colmers IN, Paterson QS, Lin M, Thoma B, Chan TM. The quality checklists for medical education blogs and podcasts. <i>The Winnower</i>. 2015. doi:10.15200/winn.144720.08769.</a>');
                expect(parseReferenceURL(
                    testRefs[3], 'always-full-surround', { kind: 'PMCID', value: PMCID }
                )).toBe('<a href="http://www.ncbi.nlm.nih.gov/pmc/articles/PMC12345" target="_blank">Mathieu S. Trial of Early, Goal-Directed Resuscitation for Septic Shock. The Bottom Line. http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716. Published 2015.</a>')
                expect(parseReferenceURL(
                    testRefs[4], 'always-full-surround', { kind: 'PMCID', value: PMCID }
                )).toBe('<a href="http://www.ncbi.nlm.nih.gov/pmc/articles/PMC12345" target="_blank">Cameron P. Pundit-Based Medicine. Emergency Physicians International.</a>')
                expect(parseReferenceURL(
                    testRefs[5], 'always-full-surround', { kind: 'PMCID', value: PMCID }
                )).toBe(`<a href="http://www.ncbi.nlm.nih.gov/pmc/articles/PMC12345" target="_blank">Dunning J. Unskilled and unaware of it. <i>Journal of Personality and Social Psychology</i>. 1999;77(6):1121-1134. http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf.</a>`)
            });
            it('should handle URLs', () => {
                expect(parseReferenceURL(
                    testRefs[0], 'always-full-surround', { kind: 'URL', value: URL }
                )).toBe('<a href="https://www.google.com" target="_blank">Body R. The ProMISe Study: EGDT RIP? St. Emlyn’s website. http://stemlynsblog.org/the-promise-study-egdt-rip/; http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/. Published 2015.</a>')
                expect(parseReferenceURL(
                    testRefs[1], 'always-full-surround', { kind: 'URL', value: URL }
                )).toBe('<a href="https://www.google.com" target="_blank">Chan T, Helman A, Davis T, Purdy E. MEdIC Series | The Case the FOAM Faux Pas – Expert Review and Curated Commentary. Academic Life in Emergency Medicine. www.aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary. Published 2015.</a>');
                expect(parseReferenceURL(
                    testRefs[2], 'always-full-surround', { kind: 'URL', value: URL }
                )).toBe('<a href="https://www.google.com" target="_blank">Colmers IN, Paterson QS, Lin M, Thoma B, Chan TM. The quality checklists for medical education blogs and podcasts. <i>The Winnower</i>. 2015. doi:10.15200/winn.144720.08769.</a>');
                expect(parseReferenceURL(
                    testRefs[3], 'always-full-surround', { kind: 'URL', value: URL }
                )).toBe('<a href="https://www.google.com" target="_blank">Mathieu S. Trial of Early, Goal-Directed Resuscitation for Septic Shock. The Bottom Line. http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716. Published 2015.</a>')
                expect(parseReferenceURL(
                    testRefs[4], 'always-full-surround', { kind: 'URL', value: URL }
                )).toBe('<a href="https://www.google.com" target="_blank">Cameron P. Pundit-Based Medicine. Emergency Physicians International.</a>')
                expect(parseReferenceURL(
                    testRefs[5], 'always-full-surround', { kind: 'URL', value: URL }
                )).toBe(`<a href="https://www.google.com" target="_blank">Dunning J. Unskilled and unaware of it. <i>Journal of Personality and Social Psychology</i>. 1999;77(6):1121-1134. http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf.</a>`)
            });
            it('should handle undefined identifiers', () => {
                expect(parseReferenceURL(
                    testRefs[0], 'always-full-surround'
                )).toBe('Body R. The ProMISe Study: EGDT RIP? St. Emlyn’s website. <a href="http://stemlynsblog.org/the-promise-study-egdt-rip/" target="_blank">http://stemlynsblog.org/the-promise-study-egdt-rip/</a>; <a href="http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/" target="_blank">http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/</a>. Published 2015.')
                expect(parseReferenceURL(
                    testRefs[1], 'always-full-surround'
                )).toBe('Chan T, Helman A, Davis T, Purdy E. MEdIC Series | The Case the FOAM Faux Pas – Expert Review and Curated Commentary. Academic Life in Emergency Medicine. <a href="http://aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary" target="_blank">http://aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary</a>. Published 2015.');
                expect(parseReferenceURL(
                    testRefs[2], 'always-full-surround'
                )).toBe('Colmers IN, Paterson QS, Lin M, Thoma B, Chan TM. The quality checklists for medical education blogs and podcasts. <i>The Winnower</i>. 2015. doi: <a href="https://dx.doi.org/10.15200/winn.144720.08769\" target="_blank">10.15200/winn.144720.08769</a>');
                expect(parseReferenceURL(
                    testRefs[3], 'always-full-surround'
                )).toBe('Mathieu S. Trial of Early, Goal-Directed Resuscitation for Septic Shock. The Bottom Line. <a href="http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716" target="_blank">http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716</a>. Published 2015.')
                expect(parseReferenceURL(
                    testRefs[4], 'always-full-surround'
                )).toBe('Cameron P. Pundit-Based Medicine. Emergency Physicians International.')
                expect(parseReferenceURL(
                    testRefs[5], 'always-full-surround'
                )).toBe(`Dunning J. Unskilled and unaware of it. <i>Journal of Personality and Social Psychology</i>. 1999;77(6):1121-1134. <a href="http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf" target="_blank">http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf</a>.`)
            });
        });

        describe('link style: "urls"', () => {
            it('should handle PMIDs', () => {
                expect(parseReferenceURL(
                    testRefs[0], 'urls', { kind: 'PMID', value: PMID }
                )).toBe('Body R. The ProMISe Study: EGDT RIP? St. Emlyn’s website. <a href="http://stemlynsblog.org/the-promise-study-egdt-rip/" target="_blank">http://stemlynsblog.org/the-promise-study-egdt-rip/</a>; <a href="http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/" target="_blank">http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/</a>. Published 2015.')
                expect(parseReferenceURL(
                    testRefs[1], 'urls', { kind: 'PMID', value: PMID }
                )).toBe('Chan T, Helman A, Davis T, Purdy E. MEdIC Series | The Case the FOAM Faux Pas – Expert Review and Curated Commentary. Academic Life in Emergency Medicine. <a href="http://aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary" target="_blank">http://aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary</a>. Published 2015.');
                expect(parseReferenceURL(
                    testRefs[2], 'urls', { kind: 'PMID', value: PMID }
                )).toBe('Colmers IN, Paterson QS, Lin M, Thoma B, Chan TM. The quality checklists for medical education blogs and podcasts. <i>The Winnower</i>. 2015. doi: <a href="https://dx.doi.org/10.15200/winn.144720.08769\" target="_blank">10.15200/winn.144720.08769</a>');
                expect(parseReferenceURL(
                    testRefs[3], 'urls', { kind: 'PMID', value: PMID }
                )).toBe('Mathieu S. Trial of Early, Goal-Directed Resuscitation for Septic Shock. The Bottom Line. <a href="http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716" target="_blank">http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716</a>. Published 2015.')
                expect(parseReferenceURL(
                    testRefs[4], 'urls', { kind: 'PMID', value: PMID }
                )).toBe('Cameron P. Pundit-Based Medicine. Emergency Physicians International.')
                expect(parseReferenceURL(
                    testRefs[5], 'urls', { kind: 'PMID', value: PMID }
                )).toBe(`Dunning J. Unskilled and unaware of it. <i>Journal of Personality and Social Psychology</i>. 1999;77(6):1121-1134. <a href="http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf" target="_blank">http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf</a>.`)
            });
            it('should handle DOIs', () => {
                expect(parseReferenceURL(
                    testRefs[0], 'urls', { kind: 'DOI', value: DOI }
                )).toBe('Body R. The ProMISe Study: EGDT RIP? St. Emlyn’s website. <a href="http://stemlynsblog.org/the-promise-study-egdt-rip/" target="_blank">http://stemlynsblog.org/the-promise-study-egdt-rip/</a>; <a href="http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/" target="_blank">http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/</a>. Published 2015.')
                expect(parseReferenceURL(
                    testRefs[1], 'urls', { kind: 'DOI', value: DOI }
                )).toBe('Chan T, Helman A, Davis T, Purdy E. MEdIC Series | The Case the FOAM Faux Pas – Expert Review and Curated Commentary. Academic Life in Emergency Medicine. <a href="http://aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary" target="_blank">http://aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary</a>. Published 2015.');
                expect(parseReferenceURL(
                    testRefs[2], 'urls', { kind: 'DOI', value: DOI }
                )).toBe('Colmers IN, Paterson QS, Lin M, Thoma B, Chan TM. The quality checklists for medical education blogs and podcasts. <i>The Winnower</i>. 2015. doi: <a href="https://dx.doi.org/10.15200/winn.144720.08769\" target="_blank">10.15200/winn.144720.08769</a>');
                expect(parseReferenceURL(
                    testRefs[3], 'urls', { kind: 'DOI', value: DOI }
                )).toBe('Mathieu S. Trial of Early, Goal-Directed Resuscitation for Septic Shock. The Bottom Line. <a href="http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716" target="_blank">http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716</a>. Published 2015.')
                expect(parseReferenceURL(
                    testRefs[4], 'urls', { kind: 'DOI', value: DOI }
                )).toBe('Cameron P. Pundit-Based Medicine. Emergency Physicians International.')
                expect(parseReferenceURL(
                    testRefs[5], 'urls', { kind: 'DOI', value: DOI }
                )).toBe(`Dunning J. Unskilled and unaware of it. <i>Journal of Personality and Social Psychology</i>. 1999;77(6):1121-1134. <a href="http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf" target="_blank">http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf</a>.`)
            });
            it('should handle PMCIDs', () => {
                expect(parseReferenceURL(
                    testRefs[0], 'urls', { kind: 'PMCID', value: PMCID }
                )).toBe('Body R. The ProMISe Study: EGDT RIP? St. Emlyn’s website. <a href="http://stemlynsblog.org/the-promise-study-egdt-rip/" target="_blank">http://stemlynsblog.org/the-promise-study-egdt-rip/</a>; <a href="http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/" target="_blank">http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/</a>. Published 2015.')
                expect(parseReferenceURL(
                    testRefs[1], 'urls', { kind: 'PMCID', value: PMCID }
                )).toBe('Chan T, Helman A, Davis T, Purdy E. MEdIC Series | The Case the FOAM Faux Pas – Expert Review and Curated Commentary. Academic Life in Emergency Medicine. <a href="http://aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary" target="_blank">http://aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary</a>. Published 2015.');
                expect(parseReferenceURL(
                    testRefs[2], 'urls', { kind: 'PMCID', value: PMCID }
                )).toBe('Colmers IN, Paterson QS, Lin M, Thoma B, Chan TM. The quality checklists for medical education blogs and podcasts. <i>The Winnower</i>. 2015. doi: <a href="https://dx.doi.org/10.15200/winn.144720.08769\" target="_blank">10.15200/winn.144720.08769</a>');
                expect(parseReferenceURL(
                    testRefs[3], 'urls', { kind: 'PMCID', value: PMCID }
                )).toBe('Mathieu S. Trial of Early, Goal-Directed Resuscitation for Septic Shock. The Bottom Line. <a href="http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716" target="_blank">http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716</a>. Published 2015.')
                expect(parseReferenceURL(
                    testRefs[4], 'urls', { kind: 'PMCID', value: PMCID }
                )).toBe('Cameron P. Pundit-Based Medicine. Emergency Physicians International.')
                expect(parseReferenceURL(
                    testRefs[5], 'urls', { kind: 'PMCID', value: PMCID }
                )).toBe(`Dunning J. Unskilled and unaware of it. <i>Journal of Personality and Social Psychology</i>. 1999;77(6):1121-1134. <a href="http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf" target="_blank">http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf</a>.`)
            });
            it('should handle URLs', () => {
                expect(parseReferenceURL(
                    testRefs[0], 'urls', { kind: 'URL', value: URL }
                )).toBe('Body R. The ProMISe Study: EGDT RIP? St. Emlyn’s website. <a href="http://stemlynsblog.org/the-promise-study-egdt-rip/" target="_blank">http://stemlynsblog.org/the-promise-study-egdt-rip/</a>; <a href="http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/" target="_blank">http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/</a>. Published 2015.')
                expect(parseReferenceURL(
                    testRefs[1], 'urls', { kind: 'URL', value: URL }
                )).toBe('Chan T, Helman A, Davis T, Purdy E. MEdIC Series | The Case the FOAM Faux Pas – Expert Review and Curated Commentary. Academic Life in Emergency Medicine. <a href="http://aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary" target="_blank">http://aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary</a>. Published 2015.');
                expect(parseReferenceURL(
                    testRefs[2], 'urls', { kind: 'URL', value: URL }
                )).toBe('Colmers IN, Paterson QS, Lin M, Thoma B, Chan TM. The quality checklists for medical education blogs and podcasts. <i>The Winnower</i>. 2015. doi: <a href="https://dx.doi.org/10.15200/winn.144720.08769\" target="_blank">10.15200/winn.144720.08769</a>');
                expect(parseReferenceURL(
                    testRefs[3], 'urls', { kind: 'URL', value: URL }
                )).toBe('Mathieu S. Trial of Early, Goal-Directed Resuscitation for Septic Shock. The Bottom Line. <a href="http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716" target="_blank">http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716</a>. Published 2015.')
                expect(parseReferenceURL(
                    testRefs[4], 'urls', { kind: 'URL', value: URL }
                )).toBe('Cameron P. Pundit-Based Medicine. Emergency Physicians International.')
                expect(parseReferenceURL(
                    testRefs[5], 'urls', { kind: 'URL', value: URL }
                )).toBe(`Dunning J. Unskilled and unaware of it. <i>Journal of Personality and Social Psychology</i>. 1999;77(6):1121-1134. <a href="http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf" target="_blank">http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf</a>.`)
            });
            it('should handle undefined identifiers', () => {
                expect(parseReferenceURL(
                    testRefs[0], 'urls'
                )).toBe('Body R. The ProMISe Study: EGDT RIP? St. Emlyn’s website. <a href="http://stemlynsblog.org/the-promise-study-egdt-rip/" target="_blank">http://stemlynsblog.org/the-promise-study-egdt-rip/</a>; <a href="http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/" target="_blank">http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/</a>. Published 2015.')
                expect(parseReferenceURL(
                    testRefs[1], 'urls'
                )).toBe('Chan T, Helman A, Davis T, Purdy E. MEdIC Series | The Case the FOAM Faux Pas – Expert Review and Curated Commentary. Academic Life in Emergency Medicine. <a href="http://aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary" target="_blank">http://aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary</a>. Published 2015.');
                expect(parseReferenceURL(
                    testRefs[2], 'urls'
                )).toBe('Colmers IN, Paterson QS, Lin M, Thoma B, Chan TM. The quality checklists for medical education blogs and podcasts. <i>The Winnower</i>. 2015. doi: <a href="https://dx.doi.org/10.15200/winn.144720.08769\" target="_blank">10.15200/winn.144720.08769</a>');
                expect(parseReferenceURL(
                    testRefs[3], 'urls'
                )).toBe('Mathieu S. Trial of Early, Goal-Directed Resuscitation for Septic Shock. The Bottom Line. <a href="http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716" target="_blank">http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716</a>. Published 2015.')
                expect(parseReferenceURL(
                    testRefs[4], 'urls'
                )).toBe('Cameron P. Pundit-Based Medicine. Emergency Physicians International.')
                expect(parseReferenceURL(
                    testRefs[5], 'urls'
                )).toBe(`Dunning J. Unskilled and unaware of it. <i>Journal of Personality and Social Psychology</i>. 1999;77(6):1121-1134. <a href="http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf" target="_blank">http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf</a>.`)
            });
        });

        describe('link style: "never"', () => {
            it('should handle PMIDs', () => {
                expect(parseReferenceURL(
                    testRefs[0], 'never', { kind: 'PMID', value: PMID }
                )).toBe(testRefs[0]);
                expect(parseReferenceURL(
                    testRefs[1], 'never', { kind: 'PMID', value: PMID }
                )).toBe(testRefs[1]);
                expect(parseReferenceURL(
                    testRefs[2], 'never', { kind: 'PMID', value: PMID }
                )).toBe(testRefs[2]);
                expect(parseReferenceURL(
                    testRefs[3], 'never', { kind: 'PMID', value: PMID }
                )).toBe(testRefs[3]);
                expect(parseReferenceURL(
                    testRefs[4], 'never', { kind: 'PMID', value: PMID }
                )).toBe(testRefs[4]);
                expect(parseReferenceURL(
                    testRefs[5], 'never', { kind: 'PMID', value: PMID }
                )).toBe(testRefs[5]);
            });
            it('should handle DOIs', () => {
                expect(parseReferenceURL(
                    testRefs[0], 'never', { kind: 'DOI', value: DOI }
                )).toBe(testRefs[0]);
                expect(parseReferenceURL(
                    testRefs[1], 'never', { kind: 'DOI', value: DOI }
                )).toBe(testRefs[1]);
                expect(parseReferenceURL(
                    testRefs[2], 'never', { kind: 'DOI', value: DOI }
                )).toBe(testRefs[2]);
                expect(parseReferenceURL(
                    testRefs[3], 'never', { kind: 'DOI', value: DOI }
                )).toBe(testRefs[3]);
                expect(parseReferenceURL(
                    testRefs[4], 'never', { kind: 'DOI', value: DOI }
                )).toBe(testRefs[4]);
                expect(parseReferenceURL(
                    testRefs[5], 'never', { kind: 'DOI', value: DOI }
                )).toBe(testRefs[5]);
            });
            it('should handle PMCIDs', () => {
                expect(parseReferenceURL(
                    testRefs[0], 'never', { kind: 'PMCID', value: PMCID }
                )).toBe(testRefs[0]);
                expect(parseReferenceURL(
                    testRefs[1], 'never', { kind: 'PMCID', value: PMCID }
                )).toBe(testRefs[1]);
                expect(parseReferenceURL(
                    testRefs[2], 'never', { kind: 'PMCID', value: PMCID }
                )).toBe(testRefs[2]);
                expect(parseReferenceURL(
                    testRefs[3], 'never', { kind: 'PMCID', value: PMCID }
                )).toBe(testRefs[3]);
                expect(parseReferenceURL(
                    testRefs[4], 'never', { kind: 'PMCID', value: PMCID }
                )).toBe(testRefs[4]);
                expect(parseReferenceURL(
                    testRefs[5], 'never', { kind: 'PMCID', value: PMCID }
                )).toBe(testRefs[5]);
            });
            it('should handle URLs', () => {
                expect(parseReferenceURL(
                    testRefs[0], 'never', { kind: 'URL', value: URL }
                )).toBe(testRefs[0]);
                expect(parseReferenceURL(
                    testRefs[1], 'never', { kind: 'URL', value: URL }
                )).toBe(testRefs[1]);
                expect(parseReferenceURL(
                    testRefs[2], 'never', { kind: 'URL', value: URL }
                )).toBe(testRefs[2]);
                expect(parseReferenceURL(
                    testRefs[3], 'never', { kind: 'URL', value: URL }
                )).toBe(testRefs[3]);
                expect(parseReferenceURL(
                    testRefs[4], 'never', { kind: 'URL', value: URL }
                )).toBe(testRefs[4]);
                expect(parseReferenceURL(
                    testRefs[5], 'never', { kind: 'URL', value: URL }
                )).toBe(testRefs[5]);
            });
            it('should handle undefined identifiers', () => {
                expect(parseReferenceURL(
                    testRefs[0], 'never'
                )).toBe(testRefs[0]);
                expect(parseReferenceURL(
                    testRefs[1], 'never'
                )).toBe(testRefs[1]);
                expect(parseReferenceURL(
                    testRefs[2], 'never'
                )).toBe(testRefs[2]);
                expect(parseReferenceURL(
                    testRefs[3], 'never'
                )).toBe(testRefs[3]);
                expect(parseReferenceURL(
                    testRefs[4], 'never'
                )).toBe(testRefs[4]);
                expect(parseReferenceURL(
                    testRefs[5], 'never'
                )).toBe(testRefs[5]);
            });
        });
    });
});
