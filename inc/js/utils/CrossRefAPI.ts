
export function getFromDOI(query: string, callback: Function) {

    let requestURL: string = `https://api.crossref.org/v1/works/http://dx.doi.org/${query}/transform/application/vnd.citationstyles.csl+json`;
    let request = new XMLHttpRequest();
    request.open('GET', requestURL, true);

    request.onreadystatechange = () => {

        if (request.readyState !== 4) {
            return;
        }

        if (request.status !== 200) {
            callback(new Error(`Error: CrossRef => Unable to find data for DOI ${query}`));
            return;
        }

        let res = JSON.parse(request.responseText);
        res['id'] = 0;
        callback([res]);

    }

    request.send(null);
}
