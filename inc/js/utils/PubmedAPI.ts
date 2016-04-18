

export function PubmedQuery(query: string, callback: Function): void {

  let requestURL: string = `http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURI(query)}&retmode=json`
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

    PubmedGet(res.esearchresult.idlist.join(), callback);

  };
  request.send(null);
}

export function PubmedGet(PMIDlist: string, callback: Function): void {

  let requestURL = `http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${PMIDlist}&version=2.0&retmode=json`;
  let request = new XMLHttpRequest();
  request.open('GET', requestURL, true);
  request.onload = () => {

    // Handle bad request
    if (request.readyState !== 4 || request.status !== 200) {
      let error = new Error('Error: PubmedGet => PubMed returned a non-200 status code.');
      callback(error);
      return;
    }

    let res = JSON.parse(request.responseText);

    // Handle response errors
    if (res.error) {
      let error = new Error('Error: PubmedGet => PMID not valid.');
      callback(error);
      return;
    }


    let iterable = [];

    for (let i in (res.result as Object)) {
      if (i === 'uids') { continue; }
      iterable.push(res.result[i]);
    }

    callback(iterable);

  };
  request.send(null);

}
