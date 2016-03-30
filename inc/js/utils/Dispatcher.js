"use strict";
var Parsers_1 = require('./Parsers');
var Dispatcher = (function () {
    function Dispatcher(data, editor) {
        this.citationFormat = data['citation-format'];
        this.PMIDquery = data['pmid-input'] !== '' && data['pmid-input'] !== undefined
            ? data['pmid-input'].replace(/\s/g, '')
            : '';
        this.manualCitationType = data['manual-type-selection'];
        this.includeLink = data['include-link'];
        this.editor = editor;
        var smartBib = this.editor.dom.doc
            .getElementById('abt-smart-bib');
        this.smartBib = smartBib || false;
    }
    Dispatcher.prototype.fromPMID = function () {
        var requestURL = "http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=" + this.PMIDquery + "&version=2.0&retmode=json";
        var request = new XMLHttpRequest();
        request.open('GET', requestURL, true);
        request.addEventListener('load', this._parsePMID.bind(this));
        request.send(null);
    };
    Dispatcher.prototype.fromManualInput = function (data) {
        var cleanedData;
        var type = this.manualCitationType;
        var authors = data.authors.map(function (author) {
            var name = author.name.split(' ')[1] + " " + author.name.split(' ')[0][0];
            return { name: name };
        });
        var title = data[(type + "-title")].toTitleCase();
        var source = data[(type + "-source")];
        var pubdate = data[(type + "-date")] || '';
        var volume = data[(type + "-volume")] || '';
        var issue = data[(type + "-issue")] || '';
        var pages = data[(type + "-pages")] || '';
        var lastauthor = data.authors.length > 0
            ? data.authors[data.authors.length - 1].name
            : '';
        var url = data[(type + "-url")] || '';
        var accessdate = data[(type + "-accessed")] || '';
        var updated = data[(type + "-updated")] || '';
        var location = data[(type + "-location")] || '';
        var chapter = data[(type + "-chapter")] || '';
        var edition = data[(type + "-edition")] || '';
        cleanedData = {
            authors: authors,
            title: title,
            source: source,
            pubdate: pubdate,
            volume: volume,
            issue: issue,
            pages: pages,
            lastauthor: lastauthor,
            url: url,
            accessdate: accessdate,
            updated: updated,
            location: location,
            chapter: chapter,
            edition: edition,
        };
        var payload;
        switch (this.citationFormat) {
            case 'ama':
                var ama = new Parsers_1.AMA(this.includeLink, this.manualCitationType);
                payload = ama.parse([cleanedData]);
                break;
            case 'apa':
                var apa = new Parsers_1.APA(this.includeLink, this.manualCitationType);
                ;
                payload = apa.parse([cleanedData]);
                break;
            default:
                this.editor.windowManager.alert('An error occurred while trying to parse the citation');
                this.editor.setProgressState(0);
                return;
        }
        this._deliverContent(payload);
    };
    Dispatcher.prototype._parsePMID = function (e) {
        var req = e.target;
        if (req.readyState !== 4 || req.status !== 200) {
            this.editor.windowManager.alert('Your request could not be processed. Please try again.');
            this.editor.setProgressState(0);
            return;
        }
        var res = JSON.parse(req.responseText);
        if (res.error) {
            var badPMID = res.error.match(/uid (\S+)/)[1];
            var badIndex = this.PMIDquery.split(',').indexOf(badPMID);
            this.editor.windowManager.alert("PMID \"" + badPMID + "\" at index #" + (badIndex + 1) + " failed to process. Double check your list!");
        }
        var payload;
        switch (this.citationFormat) {
            case 'ama':
                var ama = new Parsers_1.AMA(this.includeLink, this.citationFormat);
                payload = ama.parse(res.result);
                break;
            case 'apa':
                var apa = new Parsers_1.APA(this.includeLink, this.citationFormat);
                payload = apa.parse(res.result);
                break;
            default:
                this.editor.windowManager.alert('An error occurred while trying to parse the citation');
                this.editor.setProgressState(0);
                return;
        }
        this._deliverContent(payload);
    };
    Dispatcher.prototype._deliverContent = function (payload) {
        if (payload.name === 'Error') {
            this.editor.windowManager.alert(payload.message);
            this.editor.setProgressState(0);
            return;
        }
        if (this.smartBib) {
            for (var key in payload) {
                var listItem = this.editor.dom.doc.createElement('LI');
                listItem.innerHTML = payload[key];
                this.smartBib.appendChild(listItem);
            }
            this.editor.setProgressState(0);
            return;
        }
        if (payload.length === 1) {
            this.editor.insertContent(payload.join());
            this.editor.setProgressState(0);
            return;
        }
        var orderedList = '<ol>' + payload.map(function (ref) { return ("<li>" + ref + "</li>"); }).join('') + '</ol>';
        this.editor.insertContent(orderedList);
        this.editor.setProgressState(0);
    };
    return Dispatcher;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Dispatcher;
