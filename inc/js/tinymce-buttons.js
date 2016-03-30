String.prototype.toTitleCase = function () {
    var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;
    return this.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function (match, index, title) {
        if (index > 0 && index + match.length !== title.length &&
            match.search(smallWords) > -1 && title.charAt(index - 2) !== ":" &&
            (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') &&
            title.charAt(index - 1).search(/[^\s-]/) < 0) {
            return match.toLowerCase();
        }
        if (match.substr(1).search(/[A-Z]|\../) > -1) {
            return match;
        }
        return match.charAt(0).toUpperCase() + match.substr(1);
    });
};
var Parsers;
(function (Parsers) {
    var MainParser = (function () {
        function MainParser(data, editor) {
            this.citationFormat = data['citation-format'];
            this.PMIDquery = data['pmid-input'] !== '' && data['pmid-input'] !== undefined
                ? data['pmid-input'].replace(/\s/g, '')
                : '';
            MainParser.manualCitationType = data['manual-type-selection'];
            MainParser.includeLink = data['include-link'];
            this.editor = editor;
            var smartBib = this.editor.dom.doc
                .getElementById('abt-smart-bib');
            this.smartBib = smartBib || false;
        }
        MainParser.prototype.fromPMID = function () {
            var requestURL = "http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=" + this.PMIDquery + "&version=2.0&retmode=json";
            var request = new XMLHttpRequest();
            request.open('GET', requestURL, true);
            request.addEventListener('load', this._parsePMID.bind(this));
            request.send(null);
        };
        MainParser.prototype.fromManualInput = function (data) {
            var cleanedData;
            var type = MainParser.manualCitationType;
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
                    var AMA_1 = new Parsers.AMA;
                    payload = AMA_1.parse([cleanedData]);
                    break;
                case 'apa':
                    var APA_1 = new Parsers.APA;
                    payload = APA_1.parse([cleanedData]);
                    break;
                default:
                    this.editor.windowManager.alert('An error occurred while trying to parse the citation');
                    this.editor.setProgressState(0);
                    return;
            }
            this._deliverContent(payload);
        };
        MainParser.prototype._parsePMID = function (e) {
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
                    var AMA_2 = new Parsers.AMA;
                    payload = AMA_2.parse(res.result);
                    break;
                case 'apa':
                    var APA_2 = new Parsers.APA;
                    payload = APA_2.parse(res.result);
                    break;
                default:
                    this.editor.windowManager.alert('An error occurred while trying to parse the citation');
                    this.editor.setProgressState(0);
                    return;
            }
            this._deliverContent(payload);
        };
        MainParser.prototype._deliverContent = function (payload) {
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
        return MainParser;
    }());
    Parsers.MainParser = MainParser;
})(Parsers || (Parsers = {}));
var Parsers;
(function (Parsers) {
    var AMA = (function () {
        function AMA() {
            this._isManual = true;
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
                    var link = Parsers.MainParser.includeLink === true
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
            switch (Parsers.MainParser.manualCitationType) {
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
    Parsers.AMA = AMA;
})(Parsers || (Parsers = {}));
var Parsers;
(function (Parsers) {
    var APA = (function () {
        function APA() {
            this._isManual = true;
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
                    var link = Parsers.MainParser.includeLink === true
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
            switch (Parsers.MainParser.manualCitationType) {
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
    Parsers.APA = APA;
})(Parsers || (Parsers = {}));
tinymce.PluginManager.add('abt_ref_id_parser_mce_button', function (editor, url) {
    var ABT_Button = {
        type: 'menubutton',
        image: url + '/../images/book.png',
        title: 'Academic Blogger\'s Toolkit',
        icon: true,
        menu: [],
    };
    var openInlineCitationWindow = function () {
        editor.windowManager.open({
            title: 'Inline Citation',
            url: ABT_locationInfo.tinymceViewsURL + 'inline-citation.html',
            width: 400,
            height: 85,
            onClose: function (e) {
                if (!e.target.params.data) {
                    return;
                }
                editor.insertContent('[cite num=&quot;' + e.target.params.data + '&quot;]');
            }
        });
    };
    var openFormattedReferenceWindow = function () {
        editor.windowManager.open({
            title: 'Insert Formatted Reference',
            url: ABT_locationInfo.tinymceViewsURL + 'formatted-reference.html',
            width: 600,
            height: 100,
            onclose: function (e) {
                if (Object.keys(e.target.params).length === 0) {
                    return;
                }
                editor.setProgressState(1);
                var payload = e.target.params.data;
                var refparser = new Parsers.MainParser(payload, editor);
                if (payload.hasOwnProperty('manual-type-selection')) {
                    refparser.fromManualInput(payload);
                    editor.setProgressState(0);
                    return;
                }
                refparser.fromPMID();
            },
        });
    };
    var generateSmartBib = function () {
        console.log(this);
        var dom = editor.dom.doc;
        var existingSmartBib = dom.getElementById('abt-smart-bib');
        if (!existingSmartBib) {
            var smartBib_1 = dom.createElement('OL');
            var horizontalRule = dom.createElement('HR');
            smartBib_1.id = 'abt-smart-bib';
            horizontalRule.className = 'abt_editor-only';
            var comment = dom.createComment("Smart Bibliography Generated By Academic Blogger's Toolkit");
            dom.body.appendChild(comment);
            dom.body.appendChild(horizontalRule);
            dom.body.appendChild(smartBib_1);
            this.state.set('disabled', true);
        }
        return;
    };
    var separator = { text: '-' };
    var bibToolsMenu = {
        text: 'Other Tools',
        menu: [],
    };
    var inlineCitation = {
        text: 'Inline Citation',
        onclick: openInlineCitationWindow,
    };
    editor.addShortcut('meta+alt+c', 'Insert Inline Citation', openInlineCitationWindow);
    var formattedReference = {
        text: 'Formatted Reference',
        onclick: openFormattedReferenceWindow,
    };
    editor.addShortcut('meta+alt+r', 'Insert Formatted Reference', openFormattedReferenceWindow);
    var smartBib = {
        text: 'Generate Smart Bibliography',
        id: 'smartbib',
        onclick: generateSmartBib,
        disabled: false,
    };
    var trackedLink = {
        text: 'Tracked Link',
        onclick: function () {
            var user_selection = tinyMCE.activeEditor.selection.getContent({ format: 'text' });
            editor.windowManager.open({
                title: 'Insert Tracked Link',
                width: 600,
                height: 160,
                buttons: [{
                        text: 'Insert',
                        onclick: 'submit'
                    }],
                body: [
                    {
                        type: 'textbox',
                        name: 'tracked_url',
                        label: 'URL',
                        value: ''
                    },
                    {
                        type: 'textbox',
                        name: 'tracked_title',
                        label: 'Link Text',
                        value: user_selection
                    },
                    {
                        type: 'textbox',
                        name: 'tracked_tag',
                        label: 'Custom Tag ID',
                        tooltip: 'Don\'t forget to create matching tag in Google Tag Manager!',
                        value: ''
                    },
                    {
                        type: 'checkbox',
                        name: 'tracked_new_window',
                        label: 'Open link in a new window/tab'
                    },
                ],
                onsubmit: function (e) {
                    var trackedUrl = e.data.tracked_url;
                    var trackedTitle = e.data.tracked_title;
                    var trackedTag = e.data.tracked_tag;
                    var trackedLink = ("<a href=\"" + trackedUrl + "\" id=\"" + trackedTag + "\" ") +
                        ((e.data.tracked_new_window ? 'target="_blank"' : '') + ">" + trackedTitle + "</a>");
                    editor.execCommand('mceInsertContent', false, trackedLink);
                }
            });
        }
    };
    var requestTools = {
        text: 'Request More Tools',
        onclick: function () {
            editor.windowManager.open({
                title: 'Request More Tools',
                body: [{
                        type: 'container',
                        html: "<div style=\"text-align: center;\">" +
                            "Have a feature or tool in mind that isn't available?<br>" +
                            "<a " +
                            "href=\"https://github.com/dsifford/academic-bloggers-toolkit/issues\" " +
                            "style=\"color: #00a0d2;\" " +
                            "target=\"_blank\">Open an issue</a> on the GitHub repository and let me know!" +
                            "</div>",
                    }],
                buttons: [],
            });
        }
    };
    setTimeout(function () {
        var dom = editor.dom.doc;
        var existingSmartBib = dom.getElementById('abt-smart-bib');
        if (existingSmartBib) {
            smartBib.disabled = true;
            smartBib.text = 'Smart Bibliography Generated!';
        }
    }, 500);
    bibToolsMenu.menu.push(trackedLink, separator, requestTools);
    ABT_Button.menu.push(smartBib, inlineCitation, formattedReference, bibToolsMenu);
    editor.addButton('abt_ref_id_parser_mce_button', ABT_Button);
});
