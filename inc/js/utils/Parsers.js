"use strict";
var AMA = (function () {
    function AMA(includeLink, manualCitationType) {
        this._isManual = true;
        this.includeLink = includeLink;
        this.manualCitationType = manualCitationType;
    }
    AMA.prototype.parse = function (data) {
        var pmidArray = data.uids || false;
        if (pmidArray) {
            this._isManual = false;
            return this._fromPMID(data, pmidArray);
        }
        return [this._fromManual(data)];
    };
    AMA.prototype._fromPMID = function (data, pmidArray) {
        var _this = this;
        var output;
        try {
            output = pmidArray.map(function (PMID) {
                var ref = data[PMID];
                var year = ref.pubdate.substr(0, 4);
                var link = _this.includeLink === true
                    ? " PMID: <a href=\"http://www.ncbi.nlm.nih.gov/pubmed/" + PMID + "\" target=\"_blank\">" + PMID + "</a>"
                    : '';
                var authors = _this._parseAuthors(ref.authors);
                if (authors.name === 'Error') {
                    throw authors;
                }
                return (authors + " " + ref.title + " <em>" + ref.source + ".</em> " + year + "; ") +
                    ("" + (ref.volume === undefined || ref.volume === '' ? '' : ref.volume)) +
                    ((ref.issue === undefined || ref.issue === '' ? '' : '(' + ref.issue + ')') + ":") +
                    (ref.pages + "." + link);
            });
        }
        catch (e) {
            return e;
        }
        return output;
    };
    AMA.prototype._fromManual = function (data) {
        var payload;
        switch (this.manualCitationType) {
            case 'journal':
                payload = this._parseJournal(data);
                break;
            case 'website':
                payload = this._parseWebsite(data);
                break;
            case 'book':
                payload = this._parseBook(data);
                break;
        }
        return payload;
    };
    AMA.prototype._parseAuthors = function (authorArr) {
        var authors = '';
        switch (authorArr.length) {
            case 0:
                if (this._isManual === true) {
                    break;
                }
                return new Error("No authors were found for given reference");
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
                authors = authorArr.map(function (author) { return author.name; }).join(', ') + '.';
                break;
            default:
                for (var i = 0; i < 3; i++) {
                    authors += authorArr[i].name + ', ';
                }
                ;
                authors += 'et al.';
        }
        return authors;
    };
    AMA.prototype._parseJournal = function (data) {
        var authors = this._parseAuthors(data[0].authors);
        var year = (new Date(data[0].pubdate).getFullYear() + 1).toString();
        var source = data[0].source.toTitleCase();
        var issue = "(" + data[0].issue + ")" || '';
        var volume = data[0].volume || '';
        return (authors + " " + data[0].title + ". <em>" + source + ".</em> " + year + "; ") +
            ("" + volume + issue + ":" + data[0].pages + ".");
    };
    AMA.prototype._parseWebsite = function (data) {
        var authors = data[0].authors.length > 0
            ? this._parseAuthors(data[0].authors) + ' '
            : '';
        var pubdate = "Published " + new Date(data[0].pubdate).toLocaleDateString('en-us', { month: 'long', year: 'numeric' }) + ". ";
        var updated = data[0].updated !== ''
            ? "Updated " + new Date(data[0].updated).toLocaleDateString('en-us', { month: 'long', day: 'numeric', year: 'numeric' }) + ". "
            : '';
        var accessed = data[0].accessdate !== ''
            ? "Accessed " + new Date(data[0].accessdate).toLocaleDateString('en-us', { month: 'long', day: 'numeric', year: 'numeric' }) + ". "
            : "Accessed " + new Date(Date.now()).toLocaleDateString('en-us', { month: 'long', day: 'numeric', year: 'numeric' });
        return ("" + authors + data[0].title + ". <em>" + data[0].source + "</em>. Available at: ") +
            ("<a href=\"" + data[0].url + "\" target=\"_blank\">" + data[0].url + "</a>. " + pubdate + updated + accessed);
    };
    AMA.prototype._parseBook = function (data) {
        console.log(data);
        var authors = this._parseAuthors(data[0].authors);
        var title = data[0].title;
        var pubLocation = data[0].location !== ''
            ? data[0].location + ":"
            : "";
        var publisher = data[0].source;
        var year = data[0].pubdate;
        var chapter = data[0].chapter !== ''
            ? " " + data[0].chapter + ". In:"
            : "";
        var pages = data[0].pages !== ''
            ? ": " + data[0].pages + "."
            : ".";
        return "" + authors + chapter + " <em>" + title + "</em>. " + pubLocation + publisher + "; " + year + pages;
    };
    return AMA;
}());
exports.AMA = AMA;
var APA = (function () {
    function APA(includeLink, manualCitationType) {
        this._isManual = true;
        this.includeLink = includeLink;
        this.manualCitationType = manualCitationType;
    }
    APA.prototype.parse = function (data) {
        var pmidArray = data.uids || false;
        if (pmidArray) {
            this._isManual = false;
            return this._fromPMID(data, pmidArray);
        }
        return [this._fromManual(data)];
    };
    APA.prototype._fromPMID = function (data, pmidArray) {
        var _this = this;
        var output;
        try {
            output = pmidArray.map(function (PMID) {
                var ref = data[PMID];
                var year = ref.pubdate.substr(0, 4);
                var link = _this.includeLink === true
                    ? " PMID: <a href=\"http://www.ncbi.nlm.nih.gov/pubmed/" + PMID + "\" target=\"_blank\">" + PMID + "</a>"
                    : '';
                var authors = _this._parseAuthors(ref.authors, ref.lastauthor);
                if (authors.name === 'Error') {
                    throw authors;
                }
                return (authors + " (" + year + "). " + ref.title + " <em>") +
                    ((ref.fulljournalname === undefined || ref.fulljournalname === '' ? ref.source : ref.fulljournalname.toTitleCase()) + ".</em>, ") +
                    ("" + (ref.volume === undefined || ref.volume === '' ? '' : ref.volume)) +
                    ((ref.issue === undefined || ref.issue === '' ? '' : '(' + ref.issue + ')') + ", ") +
                    (ref.pages + "." + link);
            });
        }
        catch (e) {
            return e;
        }
        return output;
    };
    APA.prototype._fromManual = function (data) {
        var payload;
        switch (this.manualCitationType) {
            case 'journal':
                payload = this._parseJournal(data);
                break;
            case 'website':
                payload = this._parseWebsite(data);
                break;
            case 'book':
                payload = this._parseBook(data);
                break;
        }
        return payload;
    };
    APA.prototype._parseAuthors = function (authorArr, lastAuthor) {
        var authors = '';
        switch (authorArr.length) {
            case 0:
                if (this._isManual === true) {
                    break;
                }
                return new Error("No authors were found for given reference");
            case 1:
                authors = authorArr.map(function (author) {
                    return (author.name.split(' ')[0] + ", ") +
                        (author.name.split(' ')[1].split('').join('. ') + ".");
                }).join();
                break;
            case 2:
                authors = authorArr.map(function (author) {
                    return (author.name.split(' ')[0] + ", ") +
                        (author.name.split(' ')[1].split('').join('. ') + ".");
                }).join(', & ');
                break;
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                authors = authorArr.map(function (author, i, arr) {
                    if (i === arr.length - 1) {
                        return (("& " + author.name.split(' ')[0] + ", ") +
                            (author.name.split(' ')[1].split('').join('. ') + "."));
                    }
                    return ((author.name.split(' ')[0] + ", ") +
                        (author.name.split(' ')[1].split('').join('. ') + "., "));
                }).join('');
                break;
            default:
                for (var i = 0; i < 6; i++) {
                    authors +=
                        (authorArr[i].name.split(' ')[0] + ", ") +
                            (authorArr[i].name.split(' ')[1].split('').join('. ') + "., ");
                }
                authors += ". . . " +
                    (lastAuthor.split(' ')[0] + ", ") +
                    (lastAuthor.split(' ')[1].split('').join('. ') + ".");
                break;
        }
        return authors;
    };
    APA.prototype._parseJournal = function (data) {
        var authors = this._parseAuthors(data[0].authors, data[0].lastauthor);
        var year = (new Date(data[0].pubdate).getFullYear() + 1).toString();
        var source = data[0].source.toTitleCase();
        var issue = "(" + data[0].issue + ")" || '';
        var volume = data[0].volume || '';
        return (authors + " (" + year + "). " + data[0].title + ". <em>") +
            (source + ".</em>, " + volume + issue + ", " + data[0].pages + ".");
    };
    APA.prototype._parseWebsite = function (data) {
        var authors = this._parseAuthors(data[0].authors, data[0].lastauthor);
        var rawDate = new Date(data[0].pubdate);
        var source = data[0].source.toTitleCase();
        var date = (rawDate.getFullYear() + ", ") +
            ("" + rawDate.toLocaleDateString('en-us', { month: 'long', day: 'numeric' }));
        return (authors + " (" + date + "). " + data[0].title + ". <em>" + source + "</em>. ") +
            ("Retrieved from <a href=\"" + data[0].url + "\" target=\"_blank\">" + data[0].url + "</a>");
    };
    APA.prototype._parseBook = function (data) {
        var authors = this._parseAuthors(data[0].authors, data[0].lastauthor);
        var year = (new Date(data[0].pubdate).getFullYear() + 1).toString();
        var pubLocation = data[0].location !== ''
            ? data[0].location + ":"
            : '';
        var publisher = data[0].source;
        var chapter = data[0].chapter !== ''
            ? " " + data[0].chapter + ". In"
            : '';
        var pages = data[0].pages !== ''
            ? " (" + data[0].pages + ")"
            : '';
        return (authors + " (" + year + ")." + chapter + " <em>" + data[0].title + "</em>" + pages + ". ") +
            ("" + pubLocation + publisher + ".");
    };
    return APA;
}());
exports.APA = APA;
