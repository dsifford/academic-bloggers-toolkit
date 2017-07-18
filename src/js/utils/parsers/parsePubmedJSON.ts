import { localeMapper } from '../constants';
import { parseCSLDate, parseCSLName } from './';

/**
 * Takes the raw response from pubmed and processes it into CSL.
 *
 * @note The following response fields were skipped:
 *   - articleids // skipped in favor of `uid`
 *   - attributes
 *   - doccontriblist
 *   - docdate
 *   - doctype
 *   - elocationid
 *   - epubdate
 *   - essn
 *   - history
 *   - locationlabel
 *   - nlmuniqueid
 *   - pmcrefcount
 *   - pubdate // skipped in favor of `sortpubdate`
 *   - pubstatus
 *   - pubtype
 *   - recordstatus
 *   - references
 *   - srccontriblist
 *   - srcdate
 *   - vernaculartitle
 *   - viewcount
 *
 * @param kind - PubMed reference kind
 * @param res  - Pubmed api response
 */
export function parsePubmedJSON(kind: 'PMID' | 'PMCID', res: PubMed.Response[]): CSL.Data[] {
    const payload: CSL.Data[] = [];

    res.forEach((ref: PubMed.Response, i: number) => {
        const output: CSL.Data = {
            id: `${i}`,
            type: 'article-journal',
            author: [],
        };

        Object.keys(ref).forEach((key: keyof PubMed.Response) => {
            if (typeof ref[key] === 'string' && ref[key] === '') return;

            switch (key) {
                case 'authors':
                    ref[key]!.forEach(author => {
                        output.author!.push(parseCSLName(author.name, 'pubmed'));
                    });
                    break;
                case 'availablefromurl':
                    output.URL = ref[key];
                    break;
                case 'bookname':
                case 'booktitle':
                    output.title = ref[key];
                    break;
                case 'chapter':
                    output['chapter-number'] = ref[key];
                    break;
                case 'edition':
                    output.edition = ref[key];
                    break;
                case 'fulljournalname':
                    output['container-title'] = ref[key];
                    break;
                case 'issn':
                    output.ISSN = ref[key];
                    break;
                case 'issue':
                    output.issue = ref[key];
                    break;
                case 'lang':
                    output.language = localeMapper[ref[key][0]]
                        ? localeMapper[ref[key][0]]
                        : 'en-US';
                    break;
                case 'medium':
                    output.medium = ref[key];
                    break;
                case 'pages':
                    output.page = ref[key];
                    break;
                case 'publisherlocation':
                    output['publisher-place'] = ref[key];
                    break;
                case 'publishername':
                    output.publisher = ref[key];
                    break;
                case 'reportnumber':
                    output.number = ref[key];
                    break;
                case 'sortpubdate':
                case 'sortdate':
                    output.issued = parseCSLDate(ref[key], 'pubmed');
                    break;
                case 'source':
                    output.journalAbbreviation = ref[key];
                    output['container-title-short'] = ref[key];
                    break;
                case 'title':
                    output.title = ref[key];
                    break;
                case 'uid':
                    output[kind] = ref[key];
                    break;
                case 'volume':
                    output.volume = ref[key];
                    break;
                default:
                    break;
            }
        });

        payload.push(output);
    });

    return payload;
}
