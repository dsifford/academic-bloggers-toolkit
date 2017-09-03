import { observable, ObservableMap } from 'mobx';
import { formatBibliography } from '../formatBibliography';

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
        sfo: 'margin' | 'flush' | boolean = false,
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
            observable.map(
                JSON.parse(
                    `{"1btbi6t45":{"id":"1btbi6t45","type":"article-journal","author":[{"family":"Manjunath","given":"R"},{"family":"Namboodiri","given":"MA"},{"family":"Ramasarma","given":"T"}],"PMID":"34563","journalAbbreviation":"Indian J Biochem Biophys","container-title-short":"Indian J Biochem Biophys","title":"Differential changes in phenylalanine hydroxylase, tyrosine aminotransferase & tryptophan pyrrolase during hepatic regeneration.","volume":"15","issue":"3","page":"183-7","language":"en-US","ISSN":"0301-1208","container-title":"Indian journal of biochemistry &amp; biophysics","issued":{"date-parts":[["1978","06","01"]]}},"r1hn0qg7":{"id":"r1hn0qg7","type":"article-journal","author":[{"family":"Westreich","given":"M"}],"PMID":"45674","journalAbbreviation":"JACEP","container-title-short":"JACEP","title":"Preventing complications of subclavian vein catheterization.","volume":"7","issue":"10","page":"368-71","language":"en-US","ISSN":"0361-1124","container-title":"JACEP","issued":{"date-parts":[["1978","10","01"]]}}}`,
                ),
            ),
        ];
    };
    // tslint:enable
    it('should handle a variety of different bibOptions', () => {
        const temp = document.createElement('div');
        // plain, no added options. PMID available.
        let [rawBib, links, cslmap] = setupArgs();
        temp.innerHTML = formatBibliography(rawBib, links, cslmap)[0].html;
        expect(temp.querySelector('.csl-entry')!.classList.toString()).toBe('csl-entry');
        expect(temp.querySelector('.csl-entry')!.childElementCount).toBe(2);

        // hanging indent, with entryspacing and linespacing. DOI available
        [rawBib, links, cslmap] = setupArgs(undefined, true, 3, 3);
        let item = cslmap.get('1btbi6t45');
        item!.PMID = undefined;
        item!.DOI = '10.000/100.1';
        cslmap.set('1btbi6t45', item);
        temp.innerHTML = formatBibliography(rawBib, links, cslmap)[0].html;
        expect(temp.querySelector('.csl-entry')!.classList.toString()).toBe(
            'csl-entry hanging-indent',
        );
        expect(temp.querySelector('.csl-entry')!.childElementCount).toBe(1);
        expect((<HTMLDivElement>temp.querySelector('.csl-entry')).style.cssText).toBe(
            'line-height: 3; margin: 2em auto;',
        ); // tslint:disable-line

        // second-field-align: margin. PMCID available
        [rawBib, links, cslmap] = setupArgs('margin');
        item = cslmap.get('1btbi6t45');
        item!.PMID = undefined;
        item!.PMCID = 'PMC12345';
        cslmap.set('1btbi6t45', item);
        temp.innerHTML = formatBibliography(rawBib, links, cslmap)[0].html;
        expect(temp.querySelector('.csl-entry')!.classList.toString()).toBe('csl-entry margin');
        expect(temp.querySelector('.csl-entry')!.childElementCount).toBe(2);

        // second-field-align: flush, hanging-indent. URL available
        [rawBib, links, cslmap] = setupArgs('flush', true);
        item = cslmap.get('1btbi6t45');
        item!.PMID = undefined;
        item!.URL = 'https://www.google.com';
        cslmap.set('1btbi6t45', item);
        temp.innerHTML = formatBibliography(rawBib, links, cslmap)[0].html;
        expect(temp.querySelector('.csl-entry')!.classList.toString()).toBe(
            'csl-entry hanging-indent flush',
        );
        expect(temp.querySelector('.csl-entry')!.childElementCount).toBe(1);

        // plain, no added options. No identifiers available
        [rawBib, links, cslmap] = setupArgs();
        item = cslmap.get('1btbi6t45');
        item!.PMID = undefined;
        cslmap.set('1btbi6t45', item);
        temp.innerHTML = formatBibliography(rawBib, links, cslmap)[0].html;
        expect(temp.querySelector('.csl-entry')!.classList.toString()).toBe('csl-entry');
        expect(temp.querySelector('.csl-entry')!.childElementCount).toBe(2);
    });
    it('should return an error string if one exists', () => {
        const [rawBib, links, cslmap] = setupArgs();
        rawBib[1].push(errorString);
        rawBib[0].entry_ids.push(['errorstring']);
        expect(formatBibliography(rawBib, links, cslmap)[2].html).toBe(errorString);
    });
});
