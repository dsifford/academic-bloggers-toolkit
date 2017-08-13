
function fetchLocales() {
    return new Promise(function(resolve, reject) {
        var req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if (req.readyState === 4) {
                if (req.status !== 200) reject(new Error(req.responseText));
                resolve(JSON.parse(req.responseText));
            }
        };
        req.open("GET", "https://api.github.com/search/code?q=repo%3Acitation-style-language%2Flocales%20extension%3Axml&per_page=100");
        req.send(null);
    })
    .then(function(data) {
        var promises = [];
        data.items.forEach(function(item) {
            promises.push(this.fetchSingleLocale(item.name));
        });
        Promise.all(promises).then(function() {
            self.postMessage(['done']);
            self.close();
        });
    })
    .catch(function(e) { return e; });
}

function fetchSingleLocale(file) {
    return new Promise(function(resolve, reject) {
        var req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if (req.readyState === 4) {
                if (req.status !== 200) reject(new Error(req.responseText));
                var key = file.match(/locales-(.+).xml/)[1];
                self.postMessage([key, req.responseText]);
                resolve(true);
            }
        };
        req.open("GET", 'https://raw.githubusercontent.com/citation-style-language/locales/master/' + file);
        req.send(null);
    });
}

fetchLocales();
