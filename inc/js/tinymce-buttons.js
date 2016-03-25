tinymce.PluginManager.add('abt_ref_id_parser_mce_button', function (editor, url) {
    var ABT_Button = {
        type: 'menubutton',
        image: url + '/../images/book.png',
        title: 'Academic Blogger\'s Toolkit',
        icon: true,
        menu: [],
    };
    var separator = { text: '-' };
    var bibToolsMenu = {
        text: 'Bibliography Tools',
        menu: [],
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
    var inlineCitation = {
        text: 'Inline Citation',
        onclick: function () {
            editor.windowManager.open({
                title: 'Inline Citation',
                url: AU_locationInfo.tinymceViewsURL + 'inline-citation.html',
                width: 400,
                height: 85,
                onClose: function (e) {
                    editor.insertContent('[cite num=&quot;' + e.target.params.data + '&quot;]');
                }
            });
        }
    };
    var formattedReference = {
        text: 'Formatted Reference',
        onclick: function () {
            editor.windowManager.open({
                title: 'Insert Formatted Reference',
                url: AU_locationInfo.tinymceViewsURL + 'formatted-reference.html',
                width: 600,
                height: 'auto',
                onclose: function (e) {
                    console.log(e);
                },
            });
        }
    };
    bibToolsMenu.menu.push(inlineCitation, separator, formattedReference);
    ABT_Button.menu.push(bibToolsMenu, trackedLink, separator, requestTools);
    editor.addButton('abt_ref_id_parser_mce_button', ABT_Button);
    editor.addShortcut('meta+alt+r', 'Insert Formatted Reference', function () {
        editor.windowManager.open({
            title: 'Insert Formatted Reference',
            width: 600,
            height: 125,
            body: [{
                    type: 'textbox',
                    name: 'ref_id_number',
                    label: 'PMID',
                    value: ''
                }, {
                    type: 'listbox',
                    label: 'Citation Format',
                    name: 'ref_id_citation_type',
                    'values': [{
                            text: 'American Medical Association (AMA)',
                            value: 'AMA'
                        }, {
                            text: 'American Psychological Association (APA)',
                            value: 'APA'
                        }]
                }, {
                    type: 'checkbox',
                    name: 'ref_id_include_link',
                    label: 'Include link to PubMed?'
                }
            ],
            onsubmit: function (e) {
                editor.setProgressState(1);
                var PMID = e.data.ref_id_number;
                var citationFormat = e.data.ref_id_citation_type;
                var includePubmedLink = e.data.ref_id_include_link;
                var request = new XMLHttpRequest();
                request.open('GET', 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=' + PMID + '&version=2.0&retmode=json', true);
                request.onload = function () {
                    if (request.readyState === 4) {
                        if (request.status === 200) {
                            var output = parseRequestData(JSON.parse(request.responseText), PMID, citationFormat, includePubmedLink);
                            editor.insertContent(output);
                            editor.setProgressState(0);
                        }
                        else {
                            alert('ERROR: PMID not recognized.');
                            editor.setProgressState(0);
                            return;
                        }
                    }
                };
                request.send(null);
            }
        });
    });
    editor.addShortcut('meta+alt+c', 'Insert Inline Citation', function () {
        editor.windowManager.open({
            title: 'Insert Citation',
            width: 600,
            height: 58,
            body: [{
                    type: 'textbox',
                    name: 'citation_number',
                    label: 'Citation Number',
                    value: ''
                }],
            onsubmit: function (e) {
                editor.insertContent('[cite num=&quot;' + e.data.citation_number + '&quot;]');
            }
        });
    });
});
function parseRequestData(data, PMID, citationFormat, includePubmedLink) {
    var authorsRaw = data.result[PMID].authors;
    var title = data.result[PMID].title;
    var journalName = data.result[PMID].source;
    var pubYear = data.result[PMID].pubdate.substr(0, 4);
    var volume = data.result[PMID].volume;
    var issue = data.result[PMID].issue;
    var pages = data.result[PMID].pages;
    var authors = '';
    var output, i;
    if (citationFormat === 'AMA') {
        if (authorsRaw.length === 0) {
            alert('ERROR: No authors were found for this PMID.\n\nPlease double-check PMID or insert reference manually.');
        }
        else if (authorsRaw.length === 1) {
            authors = data.result[PMID].authors[0].name;
        }
        else if (authorsRaw.length > 1 && authorsRaw.length < 7) {
            for (i = 0; i < authorsRaw.length - 1; i++) {
                authors += authorsRaw[i].name + ', ';
            }
            authors += authorsRaw[authorsRaw.length - 1].name + '. ';
        }
        else {
            for (i = 0; i < 3; i++) {
                authors += authorsRaw[i].name + ', ';
            }
            authors += 'et al. ';
        }
        if (volume === '') {
            output = authors + ' ' + title + ' <em>' + journalName + '.</em> ' + pubYear + '; ' + volume + ': ' + pages + '.';
        }
        else if (issue === '' || issue === undefined) {
            output = authors + ' ' + title + ' <em>' + journalName + '.</em> ' + pubYear + '; ' + volume + ': ' + pages + '.';
        }
        else {
            output = authors + ' ' + title + ' <em>' + journalName + '.</em> ' + pubYear + '; ' + volume + '(' + issue + '): ' + pages + '.';
        }
    }
    else if (citationFormat === 'APA') {
        if (authorsRaw.length === 0) {
            alert('ERROR: No authors were found for this PMID.\n\nPlease double-check PMID or insert reference manually.');
        }
        else if (authorsRaw.length === 1) {
            if ((/( \w\w)/g).test(data.result[PMID].authors[0].name)) {
                authors += data.result[PMID].authors[0].name.substring(0, data.result[PMID].authors[0].name.length - 3) + ', ' +
                    data.result[PMID].authors[0].name.substring(data.result[PMID].authors[0].name.length - 2, data.result[PMID].authors[0].name.length - 1) + '. ' +
                    data.result[PMID].authors[0].name.substring(data.result[PMID].authors[0].name.length - 1) + '. ';
            }
            else {
                authors += data.result[PMID].authors[0].name.substring(0, data.result[PMID].authors[0].name.length - 2) + ', ' +
                    data.result[PMID].authors[0].name.substring(data.result[PMID].authors[0].name.length - 1) + '. ';
            }
        }
        else if (authorsRaw.length === 2) {
            if ((/( \w\w)/g).test(data.result[PMID].authors[0].name)) {
                authors += data.result[PMID].authors[0].name.substring(0, data.result[PMID].authors[0].name.length - 3) + ', ' +
                    data.result[PMID].authors[0].name.substring(data.result[PMID].authors[0].name.length - 2, data.result[PMID].authors[0].name.length - 1) + '. ' +
                    data.result[PMID].authors[0].name.substring(data.result[PMID].authors[0].name.length - 1) + '., & ';
            }
            else {
                authors += data.result[PMID].authors[0].name.substring(0, data.result[PMID].authors[0].name.length - 2) + ', ' +
                    data.result[PMID].authors[0].name.substring(data.result[PMID].authors[0].name.length - 1) + '., & ';
            }
            if ((/( \w\w)/g).test(data.result[PMID].authors[1].name)) {
                authors += data.result[PMID].authors[1].name.substring(0, data.result[PMID].authors[1].name.length - 3) + ', ' +
                    data.result[PMID].authors[1].name.substring(data.result[PMID].authors[1].name.length - 2, data.result[PMID].authors[1].name.length - 1) + '. ' +
                    data.result[PMID].authors[1].name.substring(data.result[PMID].authors[1].name.length - 1) + '. ';
            }
            else {
                authors += data.result[PMID].authors[1].name.substring(0, data.result[PMID].authors[1].name.length - 2) + ', ' +
                    data.result[PMID].authors[1].name.substring(data.result[PMID].authors[1].name.length - 1) + '. ';
            }
        }
        else if (authorsRaw.length > 2 && authorsRaw.length < 8) {
            for (i = 0; i < authorsRaw.length - 1; i++) {
                if ((/( \w\w)/g).test(data.result[PMID].authors[i].name)) {
                    authors += data.result[PMID].authors[i].name.substring(0, data.result[PMID].authors[i].name.length - 3) + ', ' +
                        data.result[PMID].authors[i].name.substring(data.result[PMID].authors[i].name.length - 2, data.result[PMID].authors[i].name.length - 1) + '. ' +
                        data.result[PMID].authors[i].name.substring(data.result[PMID].authors[i].name.length - 1) + '., ';
                }
                else {
                    authors += data.result[PMID].authors[i].name.substring(0, data.result[PMID].authors[i].name.length - 2) + ', ' +
                        data.result[PMID].authors[i].name.substring(data.result[PMID].authors[i].name.length - 1) + '., ';
                }
            }
            if ((/( \w\w)/g).test(data.result[PMID].lastauthor)) {
                authors += '& ' + data.result[PMID].lastauthor.substring(0, data.result[PMID].lastauthor.length - 3) + ', ' +
                    data.result[PMID].lastauthor.substring(data.result[PMID].lastauthor.length - 2, data.result[PMID].lastauthor.length - 1) + '. ' +
                    data.result[PMID].lastauthor.substring(data.result[PMID].lastauthor.length - 1) + '. ';
            }
            else {
                authors += '& ' + data.result[PMID].lastauthor.substring(0, data.result[PMID].lastauthor.length - 2) + ', ' +
                    data.result[PMID].lastauthor.substring(data.result[PMID].lastauthor.length - 1) + '. ';
            }
        }
        else {
            for (i = 0; i < 6; i++) {
                if ((/( \w\w)/g).test(data.result[PMID].authors[i].name)) {
                    authors += data.result[PMID].authors[i].name.substring(0, data.result[PMID].authors[i].name.length - 3) + ', ' +
                        data.result[PMID].authors[i].name.substring(data.result[PMID].authors[i].name.length - 2, data.result[PMID].authors[i].name.length - 1) + '. ' +
                        data.result[PMID].authors[i].name.substring(data.result[PMID].authors[i].name.length - 1) + '., ';
                }
                else {
                    authors += data.result[PMID].authors[i].name.substring(0, data.result[PMID].authors[i].name.length - 2) + ', ' +
                        data.result[PMID].authors[i].name.substring(data.result[PMID].authors[i].name.length - 1) + '., ';
                }
            }
            if ((/( \w\w)/g).test(data.result[PMID].lastauthor)) {
                authors += '. . . ' + data.result[PMID].lastauthor.substring(0, data.result[PMID].lastauthor.length - 3) + ', ' +
                    data.result[PMID].lastauthor.substring(data.result[PMID].lastauthor.length - 2, data.result[PMID].lastauthor.length - 1) + '. ' +
                    data.result[PMID].lastauthor.substring(data.result[PMID].lastauthor.length - 1) + '. ';
            }
            else {
                authors += '. . . ' + data.result[PMID].lastauthor.substring(0, data.result[PMID].lastauthor.length - 2) + ', ' +
                    data.result[PMID].lastauthor.substring(data.result[PMID].lastauthor.length - 1) + '. ';
            }
        }
        output = authors + '(' + pubYear + '). ' + title + ' <em>' + journalName + '</em>, ' + (volume !== '' ? volume : '') + (issue !== '' ? '(' + issue + '), ' : '') + pages + '.';
    }
    if (includePubmedLink) {
        output += ' PMID: <a href="http://www.ncbi.nlm.nih.gov/pubmed/' + PMID + '" target="_blank">' + PMID + '</a>';
    }
    return output;
}
