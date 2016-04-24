import * as processor from './CSLFieldProcessors';

export function PubmedQuery(query: string, callback: Function, bypassJSONFormatter: boolean = false): void {

    let requestURL: string = `http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURI(query) }&retmode=json`
    let request = new XMLHttpRequest();
    request.open('GET', requestURL, true);
    request.onload = () => {

        // Handle bad request
        if (request.readyState !== 4 || request.status !== 200) {
            let error = new Error('Error: PubmedQuery => Pubmed returned a non-200 status code.');
            callback(error);
            return;
        }

        let res = JSON.parse(request.responseText);

        // Handle response errors
        if (res.error) {
            let error = new Error('Error: PubmedQuery => Request not valid.');
            callback(error);
            return;
        }

        PubmedGet(res.esearchresult.idlist.join(), callback, bypassJSONFormatter);

    };
    request.send(null);
}

export function PubmedGet(PMIDlist: string, callback: Function, bypassJSONFormatter: boolean = false): void {

    let requestURL = `http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${PMIDlist}&version=2.0&retmode=json`;
    let request = new XMLHttpRequest();
    request.open('GET', requestURL, true);
    request.onreadystatechange = () => {

        if (request.readyState !== 4) { return; }

        if (request.status !== 200) {
            callback(new Error('Error: PubmedGet => PubMed returned a non-200 status code.'));
            return;
        }

        let res = JSON.parse(request.responseText);

        if (res.error) {
            callback(new Error(`Error: PubmedGet => ${res.error}`))
            return;
        }

        let iterable = [];

        for (let i in (res.result as Object)) {
            if (i === 'uids') { continue; }
            if (res.result[i].error) {
                callback(new Error(`Error: PubmedGet => (PMID ${i}): ${res.result[i].error}`));
                return;
            }
            iterable.push(res.result[i]);
        }

        if (bypassJSONFormatter) {
            callback(iterable);
            return;
        }

        processJSON(iterable, callback);

    };
    request.send(null);
}


/**
 * Takes the raw response from pubmed and processes it into CSL.
 *
 * @note The following response fields were skipped:
 *   - articleids       // skipped in favor of `uid`
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
 *   - pubdate          // skipped in favor of `sortpubdate`
 *   - pubstatus
 *   - pubtype        TODO: fix this - figure out what types pubmed has
 *   - recordstatus
 *   - references
 *   - srccontriblist
 *   - srcdate
 *   - vernaculartitle
 *   - viewcount
 *
 * @param {PubMed.SingleReference[]} res      The pubmed api response.
 * @param {Function}                 callback Callback function.
 */
function processJSON(res: PubMed.SingleReference[], callback: Function): void {
    let payload: CSL.Data[] = [];

    res.forEach((ref: PubMed.SingleReference, i: number) => {

        let output: CSL.Data = {};
        output.id = i;
        output.type = 'article-journal'; /** TODO: Figure out all the supported types */
        output.author = [];

        Object.keys(ref).forEach(key => {

            if (typeof ref[key] === 'string' && ref[key] === '') { return; }

            switch (key) {
                case 'authors':
                    ref[key].forEach(author => {
                        output.author.push(processor.processName(author.name, 'pubmed'))
                    });
                    break;
                case 'availablefromurl':
                    output.URL = ref[key];
                    break;
                case 'bookname': /** TODO: Not sure what the difference is here? */
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
                    output.language = ref[key][0];
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
                case 'pubtype':
                    /** TODO: Figure out all the type names that pubmed offers */
                    break;
                case 'reportnumber':
                    output.number = ref[key]; /** NOTE: This may be incorrect. */
                    break;
                case 'sortpubdate':
                    output.issued = processor.processDate(ref[key], 'pubmed')
                    break;
                case 'source':
                    output.journalAbbreviation = ref[key];
                    output['container-title-short'] = ref[key];
                    break;
                case 'title':
                    output.title = ref[key];
                    break;
                case 'uid':
                    output.PMID = ref[key];
                    break;
                case 'volume':
                    output.volume = ref[key];
            }
        });

        payload.push(output);
    });

    callback(payload);
}
