import { generateID } from 'utils/helpers';
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
    return res.map(ref => {
        return Object.keys(ref).reduce(
            // tslint:disable-next-line cyclomatic-complexity
            (prev, key) => {
                if (!ref[key]) {
                    return prev;
                }
                switch (key) {
                    case 'authors':
                        return {
                            ...prev,
                            author: ref[key]!.map(author => parseCSLName(author.name, 'pubmed')),
                        };
                    case 'availablefromurl':
                        return {
                            ...prev,
                            URL: ref[key],
                        };
                    case 'bookname':
                    case 'booktitle':
                        return {
                            ...prev,
                            title: ref[key],
                        };
                    case 'chapter':
                        return {
                            ...prev,
                            'chapter-number': ref[key],
                        };
                    case 'fulljournalname':
                        return {
                            ...prev,
                            'container-title': ref[key],
                        };
                    case 'issn':
                        return {
                            ...prev,
                            ISSN: ref[key],
                        };
                    case 'lang':
                        return {
                            ...prev,
                            language: localeMapper[ref[key]![0]] || 'en-US',
                        };
                    case 'pages':
                        return {
                            ...prev,
                            page: ref[key],
                        };
                    case 'publisherlocation':
                        return {
                            ...prev,
                            'publisher-place': ref[key],
                        };
                    case 'publishername':
                        return {
                            ...prev,
                            publisher: ref[key],
                        };
                    case 'reportnumber':
                        return {
                            ...prev,
                            number: ref[key],
                        };
                    case 'sortpubdate':
                    case 'sortdate':
                        return {
                            ...prev,
                            issued: parseCSLDate(ref[key], 'pubmed'),
                        };
                    case 'source':
                        return {
                            ...prev,
                            journalAbbreviation: ref[key],
                            'container-title-short': ref[key],
                        };
                    case 'uid':
                        return {
                            ...prev,
                            [kind]: ref[key],
                        };
                    case 'volume':
                    case 'medium':
                    case 'title':
                    case 'issue':
                    case 'edition':
                        return {
                            ...prev,
                            [key]: ref[key],
                        };
                    default:
                        return prev;
                }
            },
            <CSL.Data>{
                id: generateID(),
                type: 'article-journal',
                author: [],
            },
        );
    });
}
