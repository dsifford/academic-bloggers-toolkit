
export function getFromDOI(query: string, callback: Function) {

    let requestURL: string = `http://api.crossref.org/works/${query}/transform/application/vnd.citationstyles.csl+json`;
    let request = new XMLHttpRequest();
    request.open('GET', requestURL, true);

    request.onreadystatechange = () => {

        if (request.readyState !== 4) {
            return;
        }

        if (request.status !== 200) {
            callback(new Error('Error: CrossRef => Request could not be processed'));
            return;
        }

        /** FIXME: this will have to be changed if I ever plan on parsing more than one DOI at a time */
        let res = JSON.parse(request.responseText);
        res['id'] = 0;
        callback([res]);

    }

    request.send(null);
}
