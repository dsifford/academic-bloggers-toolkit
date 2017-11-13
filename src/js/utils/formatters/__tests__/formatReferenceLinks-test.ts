import { formatReferenceLinks } from '../formatReferenceLinks';

// tslint:disable
describe('formatReferenceLinks()', () => {
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
        expect(formatReferenceLinks(testString, 'always')).toBe(
            `This is a test. & = ampersand. > = greater than. < = less than. " = double quotes.`,
        );
    });
    describe('link style: "always"', () => {
        it('should handle PMIDs', () => {
            expect(
                formatReferenceLinks(testRefs[0], 'always', {
                    kind: 'PMID',
                    value: PMID,
                }),
            ).toBe(
                'Body R. The ProMISe Study: EGDT RIP? St. Emlyn’s website. <a href="http://stemlynsblog.org/the-promise-study-egdt-rip/" target="_blank">http://stemlynsblog.org/the-promise-study-egdt-rip/</a>; <a href="http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/" target="_blank">http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/</a>. Published 2015.<span class="abt-url"> [<a href="https://www.ncbi.nlm.nih.gov/pubmed/12345" target="_blank">PubMed</a>]</span>',
            );
            expect(
                formatReferenceLinks(testRefs[1], 'always', {
                    kind: 'PMID',
                    value: PMID,
                }),
            ).toBe(
                'Chan T, Helman A, Davis T, Purdy E. MEdIC Series | The Case the FOAM Faux Pas – Expert Review and Curated Commentary. Academic Life in Emergency Medicine. <a href="http://aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary" target="_blank">http://aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary</a>. Published 2015.<span class="abt-url"> [<a href="https://www.ncbi.nlm.nih.gov/pubmed/12345" target="_blank">PubMed</a>]</span>',
            );
            expect(
                formatReferenceLinks(testRefs[2], 'always', {
                    kind: 'PMID',
                    value: PMID,
                }),
            ).toBe(
                'Colmers IN, Paterson QS, Lin M, Thoma B, Chan TM. The quality checklists for medical education blogs and podcasts. <i>The Winnower</i>. 2015. doi: <a href="https://dx.doi.org/10.15200/winn.144720.08769" target="_blank">10.15200/winn.144720.08769</a><span class="abt-url"> [<a href="https://www.ncbi.nlm.nih.gov/pubmed/12345" target="_blank">PubMed</a>]</span>',
            );
            expect(
                formatReferenceLinks(testRefs[3], 'always', {
                    kind: 'PMID',
                    value: PMID,
                }),
            ).toBe(
                'Mathieu S. Trial of Early, Goal-Directed Resuscitation for Septic Shock. The Bottom Line. <a href="http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716" target="_blank">http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716</a>. Published 2015.<span class="abt-url"> [<a href="https://www.ncbi.nlm.nih.gov/pubmed/12345" target="_blank">PubMed</a>]</span>',
            );
            expect(
                formatReferenceLinks(testRefs[4], 'always', {
                    kind: 'PMID',
                    value: PMID,
                }),
            ).toBe(
                'Cameron P. Pundit-Based Medicine. Emergency Physicians International.<span class="abt-url"> [<a href="https://www.ncbi.nlm.nih.gov/pubmed/12345" target="_blank">PubMed</a>]</span>',
            );
            expect(
                formatReferenceLinks(testRefs[5], 'always', {
                    kind: 'PMID',
                    value: PMID,
                }),
            ).toBe(
                `Dunning J. Unskilled and unaware of it. <i>Journal of Personality and Social Psychology</i>. 1999;77(6):1121-1134. <a href="http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf" target="_blank">http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf</a>.<span class="abt-url"> [<a href="https://www.ncbi.nlm.nih.gov/pubmed/12345" target="_blank">PubMed</a>]</span>`,
            );
        });
        it('should handle DOIs', () => {
            expect(
                formatReferenceLinks(testRefs[0], 'always', {
                    kind: 'DOI',
                    value: DOI,
                }),
            ).toBe(
                'Body R. The ProMISe Study: EGDT RIP? St. Emlyn’s website. <a href="http://stemlynsblog.org/the-promise-study-egdt-rip/" target="_blank">http://stemlynsblog.org/the-promise-study-egdt-rip/</a>; <a href="http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/" target="_blank">http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/</a>. Published 2015.<span class="abt-url"> [<a href="https://dx.doi.org/10.1097/TA.0000000000001031" target="_blank">Source</a>]</span>',
            );
            expect(
                formatReferenceLinks(testRefs[1], 'always', {
                    kind: 'DOI',
                    value: DOI,
                }),
            ).toBe(
                'Chan T, Helman A, Davis T, Purdy E. MEdIC Series | The Case the FOAM Faux Pas – Expert Review and Curated Commentary. Academic Life in Emergency Medicine. <a href="http://aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary" target="_blank">http://aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary</a>. Published 2015.<span class="abt-url"> [<a href="https://dx.doi.org/10.1097/TA.0000000000001031" target="_blank">Source</a>]</span>',
            );
            expect(
                formatReferenceLinks(testRefs[2], 'always', {
                    kind: 'DOI',
                    value: DOI,
                }),
            ).toBe(
                'Colmers IN, Paterson QS, Lin M, Thoma B, Chan TM. The quality checklists for medical education blogs and podcasts. <i>The Winnower</i>. 2015. doi: <a href="https://dx.doi.org/10.15200/winn.144720.08769" target="_blank">10.15200/winn.144720.08769</a><span class="abt-url"> [<a href="https://dx.doi.org/10.1097/TA.0000000000001031" target="_blank">Source</a>]</span>',
            );
            expect(
                formatReferenceLinks(testRefs[3], 'always', {
                    kind: 'DOI',
                    value: DOI,
                }),
            ).toBe(
                'Mathieu S. Trial of Early, Goal-Directed Resuscitation for Septic Shock. The Bottom Line. <a href="http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716" target="_blank">http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716</a>. Published 2015.<span class="abt-url"> [<a href="https://dx.doi.org/10.1097/TA.0000000000001031" target="_blank">Source</a>]</span>',
            );
            expect(
                formatReferenceLinks(testRefs[4], 'always', {
                    kind: 'DOI',
                    value: DOI,
                }),
            ).toBe(
                'Cameron P. Pundit-Based Medicine. Emergency Physicians International.<span class="abt-url"> [<a href="https://dx.doi.org/10.1097/TA.0000000000001031" target="_blank">Source</a>]</span>',
            );
            expect(
                formatReferenceLinks(testRefs[5], 'always', {
                    kind: 'DOI',
                    value: DOI,
                }),
            ).toBe(
                `Dunning J. Unskilled and unaware of it. <i>Journal of Personality and Social Psychology</i>. 1999;77(6):1121-1134. <a href="http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf" target="_blank">http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf</a>.<span class="abt-url"> [<a href="https://dx.doi.org/10.1097/TA.0000000000001031" target="_blank">Source</a>]</span>`,
            );
        });
        it('should handle PMCIDs', () => {
            expect(
                formatReferenceLinks(testRefs[0], 'always', {
                    kind: 'PMCID',
                    value: PMCID,
                }),
            ).toBe(
                'Body R. The ProMISe Study: EGDT RIP? St. Emlyn’s website. <a href="http://stemlynsblog.org/the-promise-study-egdt-rip/" target="_blank">http://stemlynsblog.org/the-promise-study-egdt-rip/</a>; <a href="http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/" target="_blank">http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/</a>. Published 2015.<span class="abt-url"> [<a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12345" target="_blank">PMC</a>]</span>',
            );
            expect(
                formatReferenceLinks(testRefs[1], 'always', {
                    kind: 'PMCID',
                    value: PMCID,
                }),
            ).toBe(
                'Chan T, Helman A, Davis T, Purdy E. MEdIC Series | The Case the FOAM Faux Pas – Expert Review and Curated Commentary. Academic Life in Emergency Medicine. <a href="http://aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary" target="_blank">http://aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary</a>. Published 2015.<span class="abt-url"> [<a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12345" target="_blank">PMC</a>]</span>',
            );
            expect(
                formatReferenceLinks(testRefs[2], 'always', {
                    kind: 'PMCID',
                    value: PMCID,
                }),
            ).toBe(
                'Colmers IN, Paterson QS, Lin M, Thoma B, Chan TM. The quality checklists for medical education blogs and podcasts. <i>The Winnower</i>. 2015. doi: <a href="https://dx.doi.org/10.15200/winn.144720.08769" target="_blank">10.15200/winn.144720.08769</a><span class="abt-url"> [<a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12345" target="_blank">PMC</a>]</span>',
            );
            expect(
                formatReferenceLinks(testRefs[3], 'always', {
                    kind: 'PMCID',
                    value: PMCID,
                }),
            ).toBe(
                'Mathieu S. Trial of Early, Goal-Directed Resuscitation for Septic Shock. The Bottom Line. <a href="http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716" target="_blank">http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716</a>. Published 2015.<span class="abt-url"> [<a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12345" target="_blank">PMC</a>]</span>',
            );
            expect(
                formatReferenceLinks(testRefs[4], 'always', {
                    kind: 'PMCID',
                    value: PMCID,
                }),
            ).toBe(
                'Cameron P. Pundit-Based Medicine. Emergency Physicians International.<span class="abt-url"> [<a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12345" target="_blank">PMC</a>]</span>',
            );
            expect(
                formatReferenceLinks(testRefs[5], 'always', {
                    kind: 'PMCID',
                    value: PMCID,
                }),
            ).toBe(
                `Dunning J. Unskilled and unaware of it. <i>Journal of Personality and Social Psychology</i>. 1999;77(6):1121-1134. <a href="http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf" target="_blank">http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf</a>.<span class="abt-url"> [<a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12345" target="_blank">PMC</a>]</span>`,
            );
        });
        it('should handle URLs', () => {
            expect(
                formatReferenceLinks(testRefs[0], 'always', {
                    kind: 'URL',
                    value: URL,
                }),
            ).toBe(
                'Body R. The ProMISe Study: EGDT RIP? St. Emlyn’s website. <a href="http://stemlynsblog.org/the-promise-study-egdt-rip/" target="_blank">http://stemlynsblog.org/the-promise-study-egdt-rip/</a>; <a href="http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/" target="_blank">http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/</a>. Published 2015.<span class="abt-url"> [<a href="https://www.google.com" target="_blank">Source</a>]</span>',
            );
            expect(
                formatReferenceLinks(testRefs[1], 'always', {
                    kind: 'URL',
                    value: URL,
                }),
            ).toBe(
                'Chan T, Helman A, Davis T, Purdy E. MEdIC Series | The Case the FOAM Faux Pas – Expert Review and Curated Commentary. Academic Life in Emergency Medicine. <a href="http://aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary" target="_blank">http://aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary</a>. Published 2015.<span class="abt-url"> [<a href="https://www.google.com" target="_blank">Source</a>]</span>',
            );
            expect(
                formatReferenceLinks(testRefs[2], 'always', {
                    kind: 'URL',
                    value: URL,
                }),
            ).toBe(
                'Colmers IN, Paterson QS, Lin M, Thoma B, Chan TM. The quality checklists for medical education blogs and podcasts. <i>The Winnower</i>. 2015. doi: <a href="https://dx.doi.org/10.15200/winn.144720.08769" target="_blank">10.15200/winn.144720.08769</a><span class="abt-url"> [<a href="https://www.google.com" target="_blank">Source</a>]</span>',
            );
            expect(
                formatReferenceLinks(testRefs[3], 'always', {
                    kind: 'URL',
                    value: URL,
                }),
            ).toBe(
                'Mathieu S. Trial of Early, Goal-Directed Resuscitation for Septic Shock. The Bottom Line. <a href="http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716" target="_blank">http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716</a>. Published 2015.<span class="abt-url"> [<a href="https://www.google.com" target="_blank">Source</a>]</span>',
            );
            expect(
                formatReferenceLinks(testRefs[4], 'always', {
                    kind: 'URL',
                    value: URL,
                }),
            ).toBe(
                'Cameron P. Pundit-Based Medicine. Emergency Physicians International.<span class="abt-url"> [<a href="https://www.google.com" target="_blank">Source</a>]</span>',
            );
            expect(
                formatReferenceLinks(testRefs[5], 'always', {
                    kind: 'URL',
                    value: URL,
                }),
            ).toBe(
                `Dunning J. Unskilled and unaware of it. <i>Journal of Personality and Social Psychology</i>. 1999;77(6):1121-1134. <a href="http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf" target="_blank">http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf</a>.<span class="abt-url"> [<a href="https://www.google.com" target="_blank">Source</a>]</span>`,
            );
        });
        it('should handle undefined identifiers', () => {
            expect(formatReferenceLinks(testRefs[0], 'always')).toBe(
                'Body R. The ProMISe Study: EGDT RIP? St. Emlyn’s website. <a href="http://stemlynsblog.org/the-promise-study-egdt-rip/" target="_blank">http://stemlynsblog.org/the-promise-study-egdt-rip/</a>; <a href="http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/" target="_blank">http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/</a>. Published 2015.',
            );
            expect(formatReferenceLinks(testRefs[1], 'always')).toBe(
                'Chan T, Helman A, Davis T, Purdy E. MEdIC Series | The Case the FOAM Faux Pas – Expert Review and Curated Commentary. Academic Life in Emergency Medicine. <a href="http://aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary" target="_blank">http://aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary</a>. Published 2015.',
            );
            expect(formatReferenceLinks(testRefs[2], 'always')).toBe(
                'Colmers IN, Paterson QS, Lin M, Thoma B, Chan TM. The quality checklists for medical education blogs and podcasts. <i>The Winnower</i>. 2015. doi: <a href="https://dx.doi.org/10.15200/winn.144720.08769" target="_blank">10.15200/winn.144720.08769</a>',
            );
            expect(formatReferenceLinks(testRefs[3], 'always')).toBe(
                'Mathieu S. Trial of Early, Goal-Directed Resuscitation for Septic Shock. The Bottom Line. <a href="http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716" target="_blank">http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716</a>. Published 2015.',
            );
            expect(formatReferenceLinks(testRefs[4], 'always')).toBe(
                'Cameron P. Pundit-Based Medicine. Emergency Physicians International.',
            );
            expect(formatReferenceLinks(testRefs[5], 'always')).toBe(
                `Dunning J. Unskilled and unaware of it. <i>Journal of Personality and Social Psychology</i>. 1999;77(6):1121-1134. <a href="http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf" target="_blank">http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf</a>.`,
            );
        });
    });
    describe('link style: "always-full-surround"', () => {
        it('should handle PMIDs', () => {
            expect(
                formatReferenceLinks(testRefs[0], 'always-full-surround', {
                    kind: 'PMID',
                    value: PMID,
                }),
            ).toBe(
                '<a href="https://www.ncbi.nlm.nih.gov/pubmed/12345" target="_blank">Body R. The ProMISe Study: EGDT RIP? St. Emlyn’s website. http://stemlynsblog.org/the-promise-study-egdt-rip/; http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/. Published 2015.</a>',
            );
            expect(
                formatReferenceLinks(testRefs[1], 'always-full-surround', {
                    kind: 'PMID',
                    value: PMID,
                }),
            ).toBe(
                '<a href="https://www.ncbi.nlm.nih.gov/pubmed/12345" target="_blank">Chan T, Helman A, Davis T, Purdy E. MEdIC Series | The Case the FOAM Faux Pas – Expert Review and Curated Commentary. Academic Life in Emergency Medicine. www.aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary. Published 2015.</a>',
            );
            expect(
                formatReferenceLinks(testRefs[2], 'always-full-surround', {
                    kind: 'PMID',
                    value: PMID,
                }),
            ).toBe(
                '<a href="https://www.ncbi.nlm.nih.gov/pubmed/12345" target="_blank">Colmers IN, Paterson QS, Lin M, Thoma B, Chan TM. The quality checklists for medical education blogs and podcasts. <i>The Winnower</i>. 2015. doi:10.15200/winn.144720.08769.</a>',
            );
            expect(
                formatReferenceLinks(testRefs[3], 'always-full-surround', {
                    kind: 'PMID',
                    value: PMID,
                }),
            ).toBe(
                '<a href="https://www.ncbi.nlm.nih.gov/pubmed/12345" target="_blank">Mathieu S. Trial of Early, Goal-Directed Resuscitation for Septic Shock. The Bottom Line. http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716. Published 2015.</a>',
            );
            expect(
                formatReferenceLinks(testRefs[4], 'always-full-surround', {
                    kind: 'PMID',
                    value: PMID,
                }),
            ).toBe(
                '<a href="https://www.ncbi.nlm.nih.gov/pubmed/12345" target="_blank">Cameron P. Pundit-Based Medicine. Emergency Physicians International.</a>',
            );
            expect(
                formatReferenceLinks(testRefs[5], 'always-full-surround', {
                    kind: 'PMID',
                    value: PMID,
                }),
            ).toBe(
                `<a href="https://www.ncbi.nlm.nih.gov/pubmed/12345" target="_blank">Dunning J. Unskilled and unaware of it. <i>Journal of Personality and Social Psychology</i>. 1999;77(6):1121-1134. http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf.</a>`,
            );
        });
        it('should handle DOIs', () => {
            expect(
                formatReferenceLinks(testRefs[0], 'always-full-surround', {
                    kind: 'DOI',
                    value: DOI,
                }),
            ).toBe(
                '<a href="https://dx.doi.org/10.1097/TA.0000000000001031" target="_blank">Body R. The ProMISe Study: EGDT RIP? St. Emlyn’s website. http://stemlynsblog.org/the-promise-study-egdt-rip/; http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/. Published 2015.</a>',
            );
            expect(
                formatReferenceLinks(testRefs[1], 'always-full-surround', {
                    kind: 'DOI',
                    value: DOI,
                }),
            ).toBe(
                '<a href="https://dx.doi.org/10.1097/TA.0000000000001031" target="_blank">Chan T, Helman A, Davis T, Purdy E. MEdIC Series | The Case the FOAM Faux Pas – Expert Review and Curated Commentary. Academic Life in Emergency Medicine. www.aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary. Published 2015.</a>',
            );
            expect(
                formatReferenceLinks(testRefs[2], 'always-full-surround', {
                    kind: 'DOI',
                    value: DOI,
                }),
            ).toBe(
                '<a href="https://dx.doi.org/10.1097/TA.0000000000001031" target="_blank">Colmers IN, Paterson QS, Lin M, Thoma B, Chan TM. The quality checklists for medical education blogs and podcasts. <i>The Winnower</i>. 2015. doi:10.15200/winn.144720.08769.</a>',
            );
            expect(
                formatReferenceLinks(testRefs[3], 'always-full-surround', {
                    kind: 'DOI',
                    value: DOI,
                }),
            ).toBe(
                '<a href="https://dx.doi.org/10.1097/TA.0000000000001031" target="_blank">Mathieu S. Trial of Early, Goal-Directed Resuscitation for Septic Shock. The Bottom Line. http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716. Published 2015.</a>',
            );
            expect(
                formatReferenceLinks(testRefs[4], 'always-full-surround', {
                    kind: 'DOI',
                    value: DOI,
                }),
            ).toBe(
                '<a href="https://dx.doi.org/10.1097/TA.0000000000001031" target="_blank">Cameron P. Pundit-Based Medicine. Emergency Physicians International.</a>',
            );
            expect(
                formatReferenceLinks(testRefs[5], 'always-full-surround', {
                    kind: 'DOI',
                    value: DOI,
                }),
            ).toBe(
                `<a href="https://dx.doi.org/10.1097/TA.0000000000001031" target="_blank">Dunning J. Unskilled and unaware of it. <i>Journal of Personality and Social Psychology</i>. 1999;77(6):1121-1134. http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf.</a>`,
            );
        });
        it('should handle PMCIDs', () => {
            expect(
                formatReferenceLinks(testRefs[0], 'always-full-surround', {
                    kind: 'PMCID',
                    value: PMCID,
                }),
            ).toBe(
                '<a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12345" target="_blank">Body R. The ProMISe Study: EGDT RIP? St. Emlyn’s website. http://stemlynsblog.org/the-promise-study-egdt-rip/; http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/. Published 2015.</a>',
            );
            expect(
                formatReferenceLinks(testRefs[1], 'always-full-surround', {
                    kind: 'PMCID',
                    value: PMCID,
                }),
            ).toBe(
                '<a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12345" target="_blank">Chan T, Helman A, Davis T, Purdy E. MEdIC Series | The Case the FOAM Faux Pas – Expert Review and Curated Commentary. Academic Life in Emergency Medicine. www.aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary. Published 2015.</a>',
            );
            expect(
                formatReferenceLinks(testRefs[2], 'always-full-surround', {
                    kind: 'PMCID',
                    value: PMCID,
                }),
            ).toBe(
                '<a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12345" target="_blank">Colmers IN, Paterson QS, Lin M, Thoma B, Chan TM. The quality checklists for medical education blogs and podcasts. <i>The Winnower</i>. 2015. doi:10.15200/winn.144720.08769.</a>',
            );
            expect(
                formatReferenceLinks(testRefs[3], 'always-full-surround', {
                    kind: 'PMCID',
                    value: PMCID,
                }),
            ).toBe(
                '<a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12345" target="_blank">Mathieu S. Trial of Early, Goal-Directed Resuscitation for Septic Shock. The Bottom Line. http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716. Published 2015.</a>',
            );
            expect(
                formatReferenceLinks(testRefs[4], 'always-full-surround', {
                    kind: 'PMCID',
                    value: PMCID,
                }),
            ).toBe(
                '<a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12345" target="_blank">Cameron P. Pundit-Based Medicine. Emergency Physicians International.</a>',
            );
            expect(
                formatReferenceLinks(testRefs[5], 'always-full-surround', {
                    kind: 'PMCID',
                    value: PMCID,
                }),
            ).toBe(
                `<a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12345" target="_blank">Dunning J. Unskilled and unaware of it. <i>Journal of Personality and Social Psychology</i>. 1999;77(6):1121-1134. http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf.</a>`,
            );
        });
        it('should handle URLs', () => {
            expect(
                formatReferenceLinks(testRefs[0], 'always-full-surround', {
                    kind: 'URL',
                    value: URL,
                }),
            ).toBe(
                '<a href="https://www.google.com" target="_blank">Body R. The ProMISe Study: EGDT RIP? St. Emlyn’s website. http://stemlynsblog.org/the-promise-study-egdt-rip/; http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/. Published 2015.</a>',
            );
            expect(
                formatReferenceLinks(testRefs[1], 'always-full-surround', {
                    kind: 'URL',
                    value: URL,
                }),
            ).toBe(
                '<a href="https://www.google.com" target="_blank">Chan T, Helman A, Davis T, Purdy E. MEdIC Series | The Case the FOAM Faux Pas – Expert Review and Curated Commentary. Academic Life in Emergency Medicine. www.aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary. Published 2015.</a>',
            );
            expect(
                formatReferenceLinks(testRefs[2], 'always-full-surround', {
                    kind: 'URL',
                    value: URL,
                }),
            ).toBe(
                '<a href="https://www.google.com" target="_blank">Colmers IN, Paterson QS, Lin M, Thoma B, Chan TM. The quality checklists for medical education blogs and podcasts. <i>The Winnower</i>. 2015. doi:10.15200/winn.144720.08769.</a>',
            );
            expect(
                formatReferenceLinks(testRefs[3], 'always-full-surround', {
                    kind: 'URL',
                    value: URL,
                }),
            ).toBe(
                '<a href="https://www.google.com" target="_blank">Mathieu S. Trial of Early, Goal-Directed Resuscitation for Septic Shock. The Bottom Line. http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716. Published 2015.</a>',
            );
            expect(
                formatReferenceLinks(testRefs[4], 'always-full-surround', {
                    kind: 'URL',
                    value: URL,
                }),
            ).toBe(
                '<a href="https://www.google.com" target="_blank">Cameron P. Pundit-Based Medicine. Emergency Physicians International.</a>',
            );
            expect(
                formatReferenceLinks(testRefs[5], 'always-full-surround', {
                    kind: 'URL',
                    value: URL,
                }),
            ).toBe(
                `<a href="https://www.google.com" target="_blank">Dunning J. Unskilled and unaware of it. <i>Journal of Personality and Social Psychology</i>. 1999;77(6):1121-1134. http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf.</a>`,
            );
        });
        it('should handle undefined identifiers', () => {
            expect(formatReferenceLinks(testRefs[0], 'always-full-surround')).toBe(
                'Body R. The ProMISe Study: EGDT RIP? St. Emlyn’s website. <a href="http://stemlynsblog.org/the-promise-study-egdt-rip/" target="_blank">http://stemlynsblog.org/the-promise-study-egdt-rip/</a>; <a href="http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/" target="_blank">http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/</a>. Published 2015.',
            );
            expect(formatReferenceLinks(testRefs[1], 'always-full-surround')).toBe(
                'Chan T, Helman A, Davis T, Purdy E. MEdIC Series | The Case the FOAM Faux Pas – Expert Review and Curated Commentary. Academic Life in Emergency Medicine. <a href="http://aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary" target="_blank">http://aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary</a>. Published 2015.',
            );
            expect(formatReferenceLinks(testRefs[2], 'always-full-surround')).toBe(
                'Colmers IN, Paterson QS, Lin M, Thoma B, Chan TM. The quality checklists for medical education blogs and podcasts. <i>The Winnower</i>. 2015. doi: <a href="https://dx.doi.org/10.15200/winn.144720.08769" target="_blank">10.15200/winn.144720.08769</a>',
            );
            expect(formatReferenceLinks(testRefs[3], 'always-full-surround')).toBe(
                'Mathieu S. Trial of Early, Goal-Directed Resuscitation for Septic Shock. The Bottom Line. <a href="http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716" target="_blank">http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716</a>. Published 2015.',
            );
            expect(formatReferenceLinks(testRefs[4], 'always-full-surround')).toBe(
                'Cameron P. Pundit-Based Medicine. Emergency Physicians International.',
            );
            expect(formatReferenceLinks(testRefs[5], 'always-full-surround')).toBe(
                `Dunning J. Unskilled and unaware of it. <i>Journal of Personality and Social Psychology</i>. 1999;77(6):1121-1134. <a href="http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf" target="_blank">http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf</a>.`,
            );
        });
    });
    describe('link style: "urls"', () => {
        it('should handle PMIDs', () => {
            expect(
                formatReferenceLinks(testRefs[0], 'urls', {
                    kind: 'PMID',
                    value: PMID,
                }),
            ).toBe(
                'Body R. The ProMISe Study: EGDT RIP? St. Emlyn’s website. <a href="http://stemlynsblog.org/the-promise-study-egdt-rip/" target="_blank">http://stemlynsblog.org/the-promise-study-egdt-rip/</a>; <a href="http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/" target="_blank">http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/</a>. Published 2015.',
            );
            expect(
                formatReferenceLinks(testRefs[1], 'urls', {
                    kind: 'PMID',
                    value: PMID,
                }),
            ).toBe(
                'Chan T, Helman A, Davis T, Purdy E. MEdIC Series | The Case the FOAM Faux Pas – Expert Review and Curated Commentary. Academic Life in Emergency Medicine. <a href="http://aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary" target="_blank">http://aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary</a>. Published 2015.',
            );
            expect(
                formatReferenceLinks(testRefs[2], 'urls', {
                    kind: 'PMID',
                    value: PMID,
                }),
            ).toBe(
                'Colmers IN, Paterson QS, Lin M, Thoma B, Chan TM. The quality checklists for medical education blogs and podcasts. <i>The Winnower</i>. 2015. doi: <a href="https://dx.doi.org/10.15200/winn.144720.08769" target="_blank">10.15200/winn.144720.08769</a>',
            );
            expect(
                formatReferenceLinks(testRefs[3], 'urls', {
                    kind: 'PMID',
                    value: PMID,
                }),
            ).toBe(
                'Mathieu S. Trial of Early, Goal-Directed Resuscitation for Septic Shock. The Bottom Line. <a href="http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716" target="_blank">http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716</a>. Published 2015.',
            );
            expect(
                formatReferenceLinks(testRefs[4], 'urls', {
                    kind: 'PMID',
                    value: PMID,
                }),
            ).toBe('Cameron P. Pundit-Based Medicine. Emergency Physicians International.');
            expect(
                formatReferenceLinks(testRefs[5], 'urls', {
                    kind: 'PMID',
                    value: PMID,
                }),
            ).toBe(
                `Dunning J. Unskilled and unaware of it. <i>Journal of Personality and Social Psychology</i>. 1999;77(6):1121-1134. <a href="http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf" target="_blank">http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf</a>.`,
            );
        });
        it('should handle DOIs', () => {
            expect(
                formatReferenceLinks(testRefs[0], 'urls', {
                    kind: 'DOI',
                    value: DOI,
                }),
            ).toBe(
                'Body R. The ProMISe Study: EGDT RIP? St. Emlyn’s website. <a href="http://stemlynsblog.org/the-promise-study-egdt-rip/" target="_blank">http://stemlynsblog.org/the-promise-study-egdt-rip/</a>; <a href="http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/" target="_blank">http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/</a>. Published 2015.',
            );
            expect(
                formatReferenceLinks(testRefs[1], 'urls', {
                    kind: 'DOI',
                    value: DOI,
                }),
            ).toBe(
                'Chan T, Helman A, Davis T, Purdy E. MEdIC Series | The Case the FOAM Faux Pas – Expert Review and Curated Commentary. Academic Life in Emergency Medicine. <a href="http://aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary" target="_blank">http://aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary</a>. Published 2015.',
            );
            expect(
                formatReferenceLinks(testRefs[2], 'urls', {
                    kind: 'DOI',
                    value: DOI,
                }),
            ).toBe(
                'Colmers IN, Paterson QS, Lin M, Thoma B, Chan TM. The quality checklists for medical education blogs and podcasts. <i>The Winnower</i>. 2015. doi: <a href="https://dx.doi.org/10.15200/winn.144720.08769" target="_blank">10.15200/winn.144720.08769</a>',
            );
            expect(
                formatReferenceLinks(testRefs[3], 'urls', {
                    kind: 'DOI',
                    value: DOI,
                }),
            ).toBe(
                'Mathieu S. Trial of Early, Goal-Directed Resuscitation for Septic Shock. The Bottom Line. <a href="http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716" target="_blank">http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716</a>. Published 2015.',
            );
            expect(
                formatReferenceLinks(testRefs[4], 'urls', {
                    kind: 'DOI',
                    value: DOI,
                }),
            ).toBe('Cameron P. Pundit-Based Medicine. Emergency Physicians International.');
            expect(
                formatReferenceLinks(testRefs[5], 'urls', {
                    kind: 'DOI',
                    value: DOI,
                }),
            ).toBe(
                `Dunning J. Unskilled and unaware of it. <i>Journal of Personality and Social Psychology</i>. 1999;77(6):1121-1134. <a href="http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf" target="_blank">http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf</a>.`,
            );
        });
        it('should handle PMCIDs', () => {
            expect(
                formatReferenceLinks(testRefs[0], 'urls', {
                    kind: 'PMCID',
                    value: PMCID,
                }),
            ).toBe(
                'Body R. The ProMISe Study: EGDT RIP? St. Emlyn’s website. <a href="http://stemlynsblog.org/the-promise-study-egdt-rip/" target="_blank">http://stemlynsblog.org/the-promise-study-egdt-rip/</a>; <a href="http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/" target="_blank">http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/</a>. Published 2015.',
            );
            expect(
                formatReferenceLinks(testRefs[1], 'urls', {
                    kind: 'PMCID',
                    value: PMCID,
                }),
            ).toBe(
                'Chan T, Helman A, Davis T, Purdy E. MEdIC Series | The Case the FOAM Faux Pas – Expert Review and Curated Commentary. Academic Life in Emergency Medicine. <a href="http://aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary" target="_blank">http://aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary</a>. Published 2015.',
            );
            expect(
                formatReferenceLinks(testRefs[2], 'urls', {
                    kind: 'PMCID',
                    value: PMCID,
                }),
            ).toBe(
                'Colmers IN, Paterson QS, Lin M, Thoma B, Chan TM. The quality checklists for medical education blogs and podcasts. <i>The Winnower</i>. 2015. doi: <a href="https://dx.doi.org/10.15200/winn.144720.08769" target="_blank">10.15200/winn.144720.08769</a>',
            );
            expect(
                formatReferenceLinks(testRefs[3], 'urls', {
                    kind: 'PMCID',
                    value: PMCID,
                }),
            ).toBe(
                'Mathieu S. Trial of Early, Goal-Directed Resuscitation for Septic Shock. The Bottom Line. <a href="http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716" target="_blank">http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716</a>. Published 2015.',
            );
            expect(
                formatReferenceLinks(testRefs[4], 'urls', {
                    kind: 'PMCID',
                    value: PMCID,
                }),
            ).toBe('Cameron P. Pundit-Based Medicine. Emergency Physicians International.');
            expect(
                formatReferenceLinks(testRefs[5], 'urls', {
                    kind: 'PMCID',
                    value: PMCID,
                }),
            ).toBe(
                `Dunning J. Unskilled and unaware of it. <i>Journal of Personality and Social Psychology</i>. 1999;77(6):1121-1134. <a href="http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf" target="_blank">http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf</a>.`,
            );
        });
        it('should handle URLs', () => {
            expect(
                formatReferenceLinks(testRefs[0], 'urls', {
                    kind: 'URL',
                    value: URL,
                }),
            ).toBe(
                'Body R. The ProMISe Study: EGDT RIP? St. Emlyn’s website. <a href="http://stemlynsblog.org/the-promise-study-egdt-rip/" target="_blank">http://stemlynsblog.org/the-promise-study-egdt-rip/</a>; <a href="http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/" target="_blank">http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/</a>. Published 2015.',
            );
            expect(
                formatReferenceLinks(testRefs[1], 'urls', {
                    kind: 'URL',
                    value: URL,
                }),
            ).toBe(
                'Chan T, Helman A, Davis T, Purdy E. MEdIC Series | The Case the FOAM Faux Pas – Expert Review and Curated Commentary. Academic Life in Emergency Medicine. <a href="http://aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary" target="_blank">http://aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary</a>. Published 2015.',
            );
            expect(
                formatReferenceLinks(testRefs[2], 'urls', {
                    kind: 'URL',
                    value: URL,
                }),
            ).toBe(
                'Colmers IN, Paterson QS, Lin M, Thoma B, Chan TM. The quality checklists for medical education blogs and podcasts. <i>The Winnower</i>. 2015. doi: <a href="https://dx.doi.org/10.15200/winn.144720.08769" target="_blank">10.15200/winn.144720.08769</a>',
            );
            expect(
                formatReferenceLinks(testRefs[3], 'urls', {
                    kind: 'URL',
                    value: URL,
                }),
            ).toBe(
                'Mathieu S. Trial of Early, Goal-Directed Resuscitation for Septic Shock. The Bottom Line. <a href="http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716" target="_blank">http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716</a>. Published 2015.',
            );
            expect(
                formatReferenceLinks(testRefs[4], 'urls', {
                    kind: 'URL',
                    value: URL,
                }),
            ).toBe('Cameron P. Pundit-Based Medicine. Emergency Physicians International.');
            expect(
                formatReferenceLinks(testRefs[5], 'urls', {
                    kind: 'URL',
                    value: URL,
                }),
            ).toBe(
                `Dunning J. Unskilled and unaware of it. <i>Journal of Personality and Social Psychology</i>. 1999;77(6):1121-1134. <a href="http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf" target="_blank">http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf</a>.`,
            );
        });
        it('should handle undefined identifiers', () => {
            expect(formatReferenceLinks(testRefs[0], 'urls')).toBe(
                'Body R. The ProMISe Study: EGDT RIP? St. Emlyn’s website. <a href="http://stemlynsblog.org/the-promise-study-egdt-rip/" target="_blank">http://stemlynsblog.org/the-promise-study-egdt-rip/</a>; <a href="http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/" target="_blank">http://blogs.nejm.org/now/index.php/the-final-nail-in-early-goal-directed-therapys-coffin/2015/03/24/</a>. Published 2015.',
            );
            expect(formatReferenceLinks(testRefs[1], 'urls')).toBe(
                'Chan T, Helman A, Davis T, Purdy E. MEdIC Series | The Case the FOAM Faux Pas – Expert Review and Curated Commentary. Academic Life in Emergency Medicine. <a href="http://aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary" target="_blank">http://aliem.com/MEdIC-Series-The-Case-the-FOAM-Faux-Pas-Expert-Review-and-Curated-Commentary</a>. Published 2015.',
            );
            expect(formatReferenceLinks(testRefs[2], 'urls')).toBe(
                'Colmers IN, Paterson QS, Lin M, Thoma B, Chan TM. The quality checklists for medical education blogs and podcasts. <i>The Winnower</i>. 2015. doi: <a href="https://dx.doi.org/10.15200/winn.144720.08769" target="_blank">10.15200/winn.144720.08769</a>',
            );
            expect(formatReferenceLinks(testRefs[3], 'urls')).toBe(
                'Mathieu S. Trial of Early, Goal-Directed Resuscitation for Septic Shock. The Bottom Line. <a href="http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716" target="_blank">http://www.wessexics.com/The_Bottom_Line/Review/index.php?id=3665078336903245716</a>. Published 2015.',
            );
            expect(formatReferenceLinks(testRefs[4], 'urls')).toBe(
                'Cameron P. Pundit-Based Medicine. Emergency Physicians International.',
            );
            expect(formatReferenceLinks(testRefs[5], 'urls')).toBe(
                `Dunning J. Unskilled and unaware of it. <i>Journal of Personality and Social Psychology</i>. 1999;77(6):1121-1134. <a href="http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf" target="_blank">http://psych.colorado.edu/~vanboven/teaching/p7536_heurbias/p7536_readings/kruger_dunning.pdf</a>.`,
            );
        });
    });
    describe('link style: "never"', () => {
        it('should handle PMIDs', () => {
            expect(
                formatReferenceLinks(testRefs[0], 'never', {
                    kind: 'PMID',
                    value: PMID,
                }),
            ).toBe(testRefs[0]);
            expect(
                formatReferenceLinks(testRefs[1], 'never', {
                    kind: 'PMID',
                    value: PMID,
                }),
            ).toBe(testRefs[1]);
            expect(
                formatReferenceLinks(testRefs[2], 'never', {
                    kind: 'PMID',
                    value: PMID,
                }),
            ).toBe(testRefs[2]);
            expect(
                formatReferenceLinks(testRefs[3], 'never', {
                    kind: 'PMID',
                    value: PMID,
                }),
            ).toBe(testRefs[3]);
            expect(
                formatReferenceLinks(testRefs[4], 'never', {
                    kind: 'PMID',
                    value: PMID,
                }),
            ).toBe(testRefs[4]);
            expect(
                formatReferenceLinks(testRefs[5], 'never', {
                    kind: 'PMID',
                    value: PMID,
                }),
            ).toBe(testRefs[5]);
        });
        it('should handle DOIs', () => {
            expect(
                formatReferenceLinks(testRefs[0], 'never', {
                    kind: 'DOI',
                    value: DOI,
                }),
            ).toBe(testRefs[0]);
            expect(
                formatReferenceLinks(testRefs[1], 'never', {
                    kind: 'DOI',
                    value: DOI,
                }),
            ).toBe(testRefs[1]);
            expect(
                formatReferenceLinks(testRefs[2], 'never', {
                    kind: 'DOI',
                    value: DOI,
                }),
            ).toBe(testRefs[2]);
            expect(
                formatReferenceLinks(testRefs[3], 'never', {
                    kind: 'DOI',
                    value: DOI,
                }),
            ).toBe(testRefs[3]);
            expect(
                formatReferenceLinks(testRefs[4], 'never', {
                    kind: 'DOI',
                    value: DOI,
                }),
            ).toBe(testRefs[4]);
            expect(
                formatReferenceLinks(testRefs[5], 'never', {
                    kind: 'DOI',
                    value: DOI,
                }),
            ).toBe(testRefs[5]);
        });
        it('should handle PMCIDs', () => {
            expect(
                formatReferenceLinks(testRefs[0], 'never', {
                    kind: 'PMCID',
                    value: PMCID,
                }),
            ).toBe(testRefs[0]);
            expect(
                formatReferenceLinks(testRefs[1], 'never', {
                    kind: 'PMCID',
                    value: PMCID,
                }),
            ).toBe(testRefs[1]);
            expect(
                formatReferenceLinks(testRefs[2], 'never', {
                    kind: 'PMCID',
                    value: PMCID,
                }),
            ).toBe(testRefs[2]);
            expect(
                formatReferenceLinks(testRefs[3], 'never', {
                    kind: 'PMCID',
                    value: PMCID,
                }),
            ).toBe(testRefs[3]);
            expect(
                formatReferenceLinks(testRefs[4], 'never', {
                    kind: 'PMCID',
                    value: PMCID,
                }),
            ).toBe(testRefs[4]);
            expect(
                formatReferenceLinks(testRefs[5], 'never', {
                    kind: 'PMCID',
                    value: PMCID,
                }),
            ).toBe(testRefs[5]);
        });
        it('should handle URLs', () => {
            expect(
                formatReferenceLinks(testRefs[0], 'never', {
                    kind: 'URL',
                    value: URL,
                }),
            ).toBe(testRefs[0]);
            expect(
                formatReferenceLinks(testRefs[1], 'never', {
                    kind: 'URL',
                    value: URL,
                }),
            ).toBe(testRefs[1]);
            expect(
                formatReferenceLinks(testRefs[2], 'never', {
                    kind: 'URL',
                    value: URL,
                }),
            ).toBe(testRefs[2]);
            expect(
                formatReferenceLinks(testRefs[3], 'never', {
                    kind: 'URL',
                    value: URL,
                }),
            ).toBe(testRefs[3]);
            expect(
                formatReferenceLinks(testRefs[4], 'never', {
                    kind: 'URL',
                    value: URL,
                }),
            ).toBe(testRefs[4]);
            expect(
                formatReferenceLinks(testRefs[5], 'never', {
                    kind: 'URL',
                    value: URL,
                }),
            ).toBe(testRefs[5]);
        });
        it('should handle undefined identifiers', () => {
            expect(formatReferenceLinks(testRefs[0], 'never')).toBe(testRefs[0]);
            expect(formatReferenceLinks(testRefs[1], 'never')).toBe(testRefs[1]);
            expect(formatReferenceLinks(testRefs[2], 'never')).toBe(testRefs[2]);
            expect(formatReferenceLinks(testRefs[3], 'never')).toBe(testRefs[3]);
            expect(formatReferenceLinks(testRefs[4], 'never')).toBe(testRefs[4]);
            expect(formatReferenceLinks(testRefs[5], 'never')).toBe(testRefs[5]);
        });
    });
});
