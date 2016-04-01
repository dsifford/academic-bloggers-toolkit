

export function PubmedQuery(query: string, callback: Function): void {

  let requestURL: string = `http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURI(query)}&retmode=json`
  let request = new XMLHttpRequest();
  request.open('GET', requestURL, true);
  request.onload = () => {

    // Handle bad request
    if (request.readyState !== 4 || request.status !== 200) {
      console.log('Error');
      return;
    }

    let res = JSON.parse(request.responseText);

    // Handle response errors
    if (res.error) {
      console.log('error')
    }

    getData(res.esearchresult.idlist.join(), callback);

  };
  request.send(null);
}

function getData(PMIDlist: string, callback: Function): void {

  let requestURL = `http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${PMIDlist}&version=2.0&retmode=json`;
  let request = new XMLHttpRequest();
  request.open('GET', requestURL, true);
  request.onload = () => {

    // Handle bad request
    if (request.readyState !== 4 || request.status !== 200) {
      console.log('Error');
      return;
    }

    let res = JSON.parse(request.responseText);

    // Handle response errors
    if (res.error) {
      console.log('error')
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
