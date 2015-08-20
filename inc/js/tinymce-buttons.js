
(function() {

    tinymce.PluginManager.add('abt_ref_id_parser_mce_button', function(editor, url) {
        editor.addButton('abt_ref_id_parser_mce_button',
			{
				type: 'menubutton',
				image: url+ '/../images/book.png',
				title: "Academic Blogger's Toolkit",
				icon: true,
				menu:   [
							{
								text: 'Bibliography Tools',
								menu:   [
											// Inline Citation Menu Item
											{
												text: 'Inline Citation',
												onclick: function() {
														editor.windowManager.open({
															title: 'Insert Citation',
                                                            width: 600,
                                                            height: 88,
															body: [
																	{
																		type: 'textbox',
																		name: 'citation_number',
																		label: 'Citation Number',
																		value: ''
																	},
																	{
																		type: 'checkbox',
																		name: 'citation_checkbox',
																		checked: false,
																		label: 'Return Citation?',
																	},
                                                                    {
                                                                        type: 'container',
                                                                        html: '<span style="font-weight: 800;">Protip:</span> Use the keyboard shortcut to access this menu<br>PC: (Ctrl+Alt+C) | Mac: (Cmd+Alt+C)'
                                                                    }
																  ],

														    onsubmit: function(e) {

                                                                var trailingText;

                                                                if (e.data.citation_checkbox) {
														            	trailingText = (' return=TRUE]');
														            } else {
														            	trailingText = (']');
														            }

														        editor.insertContent(
														            '[cite num=&quot;' + e.data.citation_number + '&quot;' + trailingText
														            );
														    }
														});
												}
											},
											// Separator
											{text: '-'},
											// Single Reference Menu Item
											{
												text: 'Formatted Reference',
												onclick: function() {
													editor.windowManager.open(
														{
															title: 'Insert Formatted Reference',
															width: 600,
                                                            height: 125,
                                                            body: [
																	{
																		type: 'textbox',
																		name: 'ref_id_number',
																		label: 'PMID',
																		value: ''
																	},
                                                                    {
                                                                        type: 'listbox',
                                                                        label: 'Citation Format',
                                                                        name: 'ref_id_citation_type',
                                                                        'values': [
                                                                            {text: 'American Medical Association (AMA)', value: 'AMA'},
                                                                            {text: 'American Psychological Association (APA)', value: 'APA'}
                                                                        ]

                                                                    },
																	{
																		type: 'checkbox',
																		name: 'ref_id_include_link',
																		label: 'Include link to PubMed?'
																	},
                                                                    {
                                                                        type: 'container',
                                                                        html: '<span style="font-weight: 800;">Protip:</span> Use the keyboard shortcut to access this menu<br>PC: (Ctrl+Alt+R) | Mac: (Cmd+Alt+R)'
                                                                    }
												                  ],
															onsubmit: function(e) {

                                                                if ( jQuery.browser.msie && jQuery.browser.version < 10 ) {

                                                                    var linkLogic;

                                                                    if ( e.data.ref_id_include_link ) {
    																	linkLogic = ' link=' + e.data.ref_id_include_link + ']';
    																} else {
    																	linkLogic = ']';
    																}

    																editor.insertContent(
    																	'[ref id=&quot;' + e.data.ref_id_number + '&quot;' + linkLogic
    																);

                                                                } else {

                                                                    editor.setProgressState(1);

                                                                    jQuery.get('http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=' + e.data.ref_id_number + '&version=2.0&retmode=json', function( data ){

                                                                        /**
                                                                         * ERROR HANDLER
                                                                         */

                                                                        if(data.error) {
                                                                            alert('ERROR: PMID not recognized.');
                                                                            editor.setProgressState(0);
                                                                            return;
                                                                        }

                                                                        var PMID = e.data.ref_id_number;
                                                                        var citationFormat = e.data.ref_id_citation_type;
                                                                        var includePubmedLink = e.data.ref_id_include_link;

                                                                        var authorsRaw = data.result[PMID].authors;
                                                                    	var title = data.result[PMID].title;
                                                                    	var journalName = data.result[PMID].source;
                                                                    	var pubYear = data.result[PMID].pubdate.substr(0, 4);
                                                                    	var volume = data.result[PMID].volume;
                                                                    	var issue = data.result[PMID].issue;
                                                                    	var pages = data.result[PMID].pages;

                                                                        var authors = '';
                                                                        var output, i;

                                                                        if ( citationFormat == 'AMA' ) {

                                                                            /**
                                                                             * AUTHOR PARSING
                                                                             */

                                                                            // 0 AUTHORS
                                                                            if ( authorsRaw.length === 0 ) {
                                                                                alert('ERROR: No authors were found for this PMID.\n\nPlease double-check PMID or insert reference manually.');
                                                                            }
                                                                            // 1 AUTHOR
                                                                            else if ( authorsRaw.length === 1 ) {
                                                                                authors = data.result[PMID].authors[0].name;
                                                                            }
                                                                            // 2 - 6 AUTHORS
                                                                            else if ( authorsRaw.length > 1 && authorsRaw.length < 7 ) {

                                                                                for (i = 0; i < authorsRaw.length - 1; i++) {
                                                                                    authors += authorsRaw[i].name + ', ';
                                                                                }
                                                                                authors += authorsRaw[authorsRaw.length - 1].name + '. ';
                                                                            }
                                                                            // >7 AUTHORS
                                                                            else {
                                                                                for (i = 0; i < 3; i++) {
                                                                                    authors += authorsRaw[i].name + ', ';
                                                                                }
                                                                                authors += 'et al. ';
                                                                            }

                                                                            // NO VOLUME NUMBER
                                                                            if ( volume === '' ) {
                                                                                output = authors + ' ' + title + ' <em>' + journalName + '.</em> ' + pubYear + '; ' + volume + ': ' + pages + '.';
                                                                            }
                                                                            // NO ISSUE NUMBER
                                                                            else if ( issue === '' || issue === undefined ) {
                                                                                output = authors + ' ' + title + ' <em>' + journalName + '.</em> ' + pubYear + '; ' + volume + ': ' + pages + '.';
                                                                            } else {
                                                                                output = authors + ' ' + title + ' <em>' + journalName + '.</em> ' + pubYear + '; ' + volume + '(' + issue + '): ' + pages + '.';
                                                                            }


                                                                        } else if ( citationFormat == 'APA' ) {

                                                                            /**
                                                                             * AUTHOR PARSING
                                                                             */

                                                                            // 0 AUTHORS
                                                                            if ( authorsRaw.length === 0 ) {
                                                                                alert('ERROR: No authors were found for this PMID.\n\nPlease double-check PMID or insert reference manually.');
                                                                            }
                                                                            // 1 AUTHOR
                                                                            else if ( authorsRaw.length === 1 ) {

                                                                                // Check to see if both initials are listed
                                                                                if ( (/( \w\w)/g).test(data.result[PMID].authors[0].name) ) {
                                                                                    authors +=  data.result[PMID].authors[0].name.substring( 0, data.result[PMID].authors[0].name.length - 3 ) + ', ' +
                                                                                                data.result[PMID].authors[0].name.substring( data.result[PMID].authors[0].name.length - 2, data.result[PMID].authors[0].name.length - 1 ) + '. ' +
                                                                                                data.result[PMID].authors[0].name.substring( data.result[PMID].authors[0].name.length - 1 ) + '. ';
                                                                                } else {
                                                                                    authors +=  data.result[PMID].authors[0].name.substring( 0, data.result[PMID].authors[0].name.length - 2 ) + ', ' +
                                                                                                data.result[PMID].authors[0].name.substring( data.result[PMID].authors[0].name.length - 1 ) + '. ';
                                                                                }

                                                                            }
                                                                            // 2 Authors
                                                                            else if ( authorsRaw.length === 2 ) {

                                                                                if ( (/( \w\w)/g).test(data.result[PMID].authors[0].name) ) {

                                                                                    authors +=  data.result[PMID].authors[0].name.substring( 0, data.result[PMID].authors[0].name.length - 3 ) + ', ' +
                                                                                                data.result[PMID].authors[0].name.substring( data.result[PMID].authors[0].name.length - 2, data.result[PMID].authors[0].name.length - 1 ) + '. ' +
                                                                                                data.result[PMID].authors[0].name.substring( data.result[PMID].authors[0].name.length - 1 ) + '., & ';

                                                                                } else {

                                                                                    authors +=  data.result[PMID].authors[0].name.substring( 0, data.result[PMID].authors[0].name.length - 2 ) + ', ' +
                                                                                                data.result[PMID].authors[0].name.substring( data.result[PMID].authors[0].name.length - 1 ) + '., & ';

                                                                                }

                                                                                if ( (/( \w\w)/g).test(data.result[PMID].authors[1].name) ) {

                                                                                    authors +=  data.result[PMID].authors[1].name.substring( 0, data.result[PMID].authors[1].name.length - 3 ) + ', ' +
                                                                                                data.result[PMID].authors[1].name.substring( data.result[PMID].authors[1].name.length - 2, data.result[PMID].authors[1].name.length - 1 ) + '. ' +
                                                                                                data.result[PMID].authors[1].name.substring( data.result[PMID].authors[1].name.length - 1 ) + '. ';

                                                                                } else {

                                                                                    authors +=  data.result[PMID].authors[1].name.substring( 0, data.result[PMID].authors[1].name.length - 2 ) + ', ' +
                                                                                                data.result[PMID].authors[1].name.substring( data.result[PMID].authors[1].name.length - 1 ) + '. ';

                                                                                }

                                                                            }
                                                                            // 3-7 AUTHORS
                                                                            else if ( authorsRaw.length > 2 && authorsRaw.length < 8 ) {

                                                                                for (i = 0; i < authorsRaw.length - 1; i++) {

                                                                                    if ( (/( \w\w)/g).test(data.result[PMID].authors[i].name) ) {

                                                                                        authors +=  data.result[PMID].authors[i].name.substring( 0, data.result[PMID].authors[i].name.length - 3 ) + ', ' +
                                                                                                    data.result[PMID].authors[i].name.substring( data.result[PMID].authors[i].name.length - 2, data.result[PMID].authors[i].name.length - 1 ) + '. ' +
                                                                                                    data.result[PMID].authors[i].name.substring( data.result[PMID].authors[i].name.length - 1 ) + '., ';

                                                                                    } else {

                                                                                        authors +=  data.result[PMID].authors[i].name.substring( 0, data.result[PMID].authors[i].name.length - 2 ) + ', ' +
                                                                                                    data.result[PMID].authors[i].name.substring( data.result[PMID].authors[i].name.length - 1 ) + '., ';

                                                                                    }

                                                                                }

                                                                                if ( (/( \w\w)/g).test(data.result[PMID].lastauthor) ) {

                                                                                    authors +=  '& ' + data.result[PMID].lastauthor.substring( 0, data.result[PMID].lastauthor.length - 3 ) + ', ' +
                                                                                                data.result[PMID].lastauthor.substring( data.result[PMID].lastauthor.length - 2, data.result[PMID].lastauthor.length - 1 ) + '. ' +
                                                                                                data.result[PMID].lastauthor.substring( data.result[PMID].lastauthor.length - 1 ) + '. ';

                                                                                } else {

                                                                                    authors +=  '& ' + data.result[PMID].lastauthor.substring( 0, data.result[PMID].lastauthor.length - 2 ) + ', ' +
                                                                                                data.result[PMID].lastauthor.substring( data.result[PMID].lastauthor.length - 1 ) + '. ';

                                                                                }

                                                                            }
                                                                            // >7 AUTHORS
                                                                            else {

                                                                                for (i = 0; i < 6; i++) {

                                                                                    if ( (/( \w\w)/g).test(data.result[PMID].authors[i].name) ) {

                                                                                        authors +=  data.result[PMID].authors[i].name.substring( 0, data.result[PMID].authors[i].name.length - 3 ) + ', ' +
                                                                                                    data.result[PMID].authors[i].name.substring( data.result[PMID].authors[i].name.length - 2, data.result[PMID].authors[i].name.length - 1 ) + '. ' +
                                                                                                    data.result[PMID].authors[i].name.substring( data.result[PMID].authors[i].name.length - 1 ) + '., ';

                                                                                    } else {

                                                                                        authors +=  data.result[PMID].authors[i].name.substring( 0, data.result[PMID].authors[i].name.length - 2 ) + ', ' +
                                                                                                    data.result[PMID].authors[i].name.substring( data.result[PMID].authors[i].name.length - 1 ) + '., ';

                                                                                    }

                                                                                }

                                                                                if ( (/( \w\w)/g).test(data.result[PMID].lastauthor) ) {

                                                                                    authors +=  '. . . ' + data.result[PMID].lastauthor.substring( 0, data.result[PMID].lastauthor.length - 3 ) + ', ' +
                                                                                                data.result[PMID].lastauthor.substring( data.result[PMID].lastauthor.length - 2, data.result[PMID].lastauthor.length - 1 ) + '. ' +
                                                                                                data.result[PMID].lastauthor.substring( data.result[PMID].lastauthor.length - 1 ) + '. ';

                                                                                } else {

                                                                                    authors +=  '. . . ' + data.result[PMID].lastauthor.substring( 0, data.result[PMID].lastauthor.length - 2 ) + ', ' +
                                                                                                data.result[PMID].lastauthor.substring( data.result[PMID].lastauthor.length - 1 ) + '. ';

                                                                                }


                                                                            }

                                                                            output = authors + '(' + pubYear + '). ' + title + ' <em>' + journalName + '</em>, ' + (volume !== '' ? volume : '') + (issue !== '' ? '(' + issue + '), ' : '') + pages + '.';

                                                                        }

                                                                        // INCLUDE LINK TO PUBMED IF CHECKBOX IS CHECKED
                                                                        if ( includePubmedLink ) {
                                                                            output += ' PMID: <a href="http://www.ncbi.nlm.nih.gov/pubmed/' + PMID + '" target="_blank">' + PMID + '</a>';
                                                                        }

                                                                        editor.insertContent(output);
                                                                        editor.setProgressState(0);

                                                                    });
                                                                }
															}
														});
												}
											}
										]
							},
							{
                                text: 'Tracked Link',
                                onclick: function() {
                                    var user_selection = tinyMCE.activeEditor.selection.getContent( {format : 'text'} );
                                    editor.windowManager.open(
                                        {
                                            title: 'Insert Tracked Link',
                                            width: 600,
                                            height: 160,
                                            buttons: [
                                                {
                                                    text: 'Insert',
                                                    onclick: 'submit'
                                                }
                                            ],
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
                                            onsubmit: function(e) {
                                                var trackedUrl = e.data.tracked_url;
                                                var trackedTitle = e.data.tracked_title;
                                                var trackedTag = e.data.tracked_tag;
                                                var trackedLink;


                                                if (e.data.tracked_new_window) {
                                                    trackedLink = '<a href="' + trackedUrl + '" id="' + trackedTag + '" target="_blank">' + trackedTitle + '</a>';
                                                } else {
                                                    trackedLink = '<a href="' + trackedUrl + '" id="' + trackedTag + '">' + trackedTitle + '</a>';
                                                }

                                                editor.execCommand('mceInsertContent', false, trackedLink);
                                            }
                                        }
                                    );
                                }
                            },
							{text: '-'},
                            {
								text: 'Request More Tools',
								onclick: function() {
									editor.windowManager.open(
										{
											title: 'Request More Tools',
											body: [

												{
													type: 'label',
													text: "Have a feature or tool in mind that isn't available? Visit the link below to send a feature request. We'll do our best to make it happen."
												},
												{
													type: 'button',
													text: 'Send us your thoughts!',
													onclick : function() {
													                    window.open('https://github.com/dsifford/academic-bloggers-toolkit/issues','_blank');
													                },
												}

											],
											onsubit: function() {
												return;
											}
										});
								}}

							]
						}
			);
            editor.addShortcut('meta+alt+r', 'Insert Formatted Reference', function() {
                editor.windowManager.open(
                    {
                        title: 'Insert Formatted Reference',
                        width: 600,
                        height: 125,
                        body: [
                                {
                                    type: 'textbox',
                                    name: 'ref_id_number',
                                    label: 'PMID',
                                    value: ''
                                },
                                {
                                    type: 'listbox',
                                    label: 'Citation Format',
                                    name: 'ref_id_citation_type',
                                    'values': [
                                        {text: 'American Medical Association (AMA)', value: 'AMA'},
                                        {text: 'American Psychological Association (APA)', value: 'APA'}
                                    ]

                                },
                                {
                                    type: 'checkbox',
                                    name: 'ref_id_include_link',
                                    label: 'Include link to PubMed?'
                                }
                              ],
                        onsubmit: function(e) {

                            if ( jQuery.browser.msie && jQuery.browser.version < 10 ) {

                                var linkLogic;

                                if ( e.data.ref_id_include_link ) {
                                    linkLogic = ' link=' + e.data.ref_id_include_link + ']';
                                } else {
                                    linkLogic = ']';
                                }

                                editor.insertContent(
                                    '[ref id=&quot;' + e.data.ref_id_number + '&quot;' + linkLogic
                                );

                            } else {

                                editor.setProgressState(1);

                                jQuery.get('http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=' + e.data.ref_id_number + '&version=2.0&retmode=json', function( data ){

                                    /**
                                     * ERROR HANDLER
                                     */

                                    if(data.error) {
                                        alert('ERROR: PMID not recognized.');
                                        editor.setProgressState(0);
                                        return;
                                    }

                                    var PMID = e.data.ref_id_number;
                                    var citationFormat = e.data.ref_id_citation_type;
                                    var includePubmedLink = e.data.ref_id_include_link;

                                    var authorsRaw = data.result[PMID].authors;
                                    var title = data.result[PMID].title;
                                    var journalName = data.result[PMID].source;
                                    var pubYear = data.result[PMID].pubdate.substr(0, 4);
                                    var volume = data.result[PMID].volume;
                                    var issue = data.result[PMID].issue;
                                    var pages = data.result[PMID].pages;

                                    var authors = '';
                                    var output, i;

                                    if ( citationFormat == 'AMA' ) {

                                        /**
                                         * AUTHOR PARSING
                                         */

                                        // 0 AUTHORS
                                        if ( authorsRaw.length === 0 ) {
                                            alert('ERROR: No authors were found for this PMID.\n\nPlease double-check PMID or insert reference manually.');
                                        }
                                        // 1 AUTHOR
                                        else if ( authorsRaw.length === 1 ) {
                                            authors = data.result[PMID].authors[0].name;
                                        }
                                        // 2 - 6 AUTHORS
                                        else if ( authorsRaw.length > 1 && authorsRaw.length < 7 ) {

                                            for (i = 0; i < authorsRaw.length - 1; i++) {
                                                authors += authorsRaw[i].name + ', ';
                                            }
                                            authors += authorsRaw[authorsRaw.length - 1].name + '. ';
                                        }
                                        // >7 AUTHORS
                                        else {
                                            for (i = 0; i < 3; i++) {
                                                authors += authorsRaw[i].name + ', ';
                                            }
                                            authors += 'et al. ';
                                        }

                                        // NO VOLUME NUMBER
                                        if ( volume === '' ) {
                                            output = authors + ' ' + title + ' <em>' + journalName + '.</em> ' + pubYear + '; ' + volume + ': ' + pages + '.';
                                        }
                                        // NO ISSUE NUMBER
                                        else if ( issue === '' || issue === undefined ) {
                                            output = authors + ' ' + title + ' <em>' + journalName + '.</em> ' + pubYear + '; ' + volume + ': ' + pages + '.';
                                        } else {
                                            output = authors + ' ' + title + ' <em>' + journalName + '.</em> ' + pubYear + '; ' + volume + '(' + issue + '): ' + pages + '.';
                                        }


                                    } else if ( citationFormat == 'APA' ) {

                                        /**
                                         * AUTHOR PARSING
                                         */

                                        // 0 AUTHORS
                                        if ( authorsRaw.length === 0 ) {
                                            alert('ERROR: No authors were found for this PMID.\n\nPlease double-check PMID or insert reference manually.');
                                        }
                                        // 1 AUTHOR
                                        else if ( authorsRaw.length === 1 ) {

                                            // Check to see if both initials are listed
                                            if ( (/( \w\w)/g).test(data.result[PMID].authors[0].name) ) {
                                                authors +=  data.result[PMID].authors[0].name.substring( 0, data.result[PMID].authors[0].name.length - 3 ) + ', ' +
                                                            data.result[PMID].authors[0].name.substring( data.result[PMID].authors[0].name.length - 2, data.result[PMID].authors[0].name.length - 1 ) + '. ' +
                                                            data.result[PMID].authors[0].name.substring( data.result[PMID].authors[0].name.length - 1 ) + '. ';
                                            } else {
                                                authors +=  data.result[PMID].authors[0].name.substring( 0, data.result[PMID].authors[0].name.length - 2 ) + ', ' +
                                                            data.result[PMID].authors[0].name.substring( data.result[PMID].authors[0].name.length - 1 ) + '. ';
                                            }

                                        }
                                        // 2 Authors
                                        else if ( authorsRaw.length === 2 ) {

                                            if ( (/( \w\w)/g).test(data.result[PMID].authors[0].name) ) {

                                                authors +=  data.result[PMID].authors[0].name.substring( 0, data.result[PMID].authors[0].name.length - 3 ) + ', ' +
                                                            data.result[PMID].authors[0].name.substring( data.result[PMID].authors[0].name.length - 2, data.result[PMID].authors[0].name.length - 1 ) + '. ' +
                                                            data.result[PMID].authors[0].name.substring( data.result[PMID].authors[0].name.length - 1 ) + '., & ';

                                            } else {

                                                authors +=  data.result[PMID].authors[0].name.substring( 0, data.result[PMID].authors[0].name.length - 2 ) + ', ' +
                                                            data.result[PMID].authors[0].name.substring( data.result[PMID].authors[0].name.length - 1 ) + '., & ';

                                            }

                                            if ( (/( \w\w)/g).test(data.result[PMID].authors[1].name) ) {

                                                authors +=  data.result[PMID].authors[1].name.substring( 0, data.result[PMID].authors[1].name.length - 3 ) + ', ' +
                                                            data.result[PMID].authors[1].name.substring( data.result[PMID].authors[1].name.length - 2, data.result[PMID].authors[1].name.length - 1 ) + '. ' +
                                                            data.result[PMID].authors[1].name.substring( data.result[PMID].authors[1].name.length - 1 ) + '. ';

                                            } else {

                                                authors +=  data.result[PMID].authors[1].name.substring( 0, data.result[PMID].authors[1].name.length - 2 ) + ', ' +
                                                            data.result[PMID].authors[1].name.substring( data.result[PMID].authors[1].name.length - 1 ) + '. ';

                                            }

                                        }
                                        // 3-7 AUTHORS
                                        else if ( authorsRaw.length > 2 && authorsRaw.length < 8 ) {

                                            for (i = 0; i < authorsRaw.length - 1; i++) {

                                                if ( (/( \w\w)/g).test(data.result[PMID].authors[i].name) ) {

                                                    authors +=  data.result[PMID].authors[i].name.substring( 0, data.result[PMID].authors[i].name.length - 3 ) + ', ' +
                                                                data.result[PMID].authors[i].name.substring( data.result[PMID].authors[i].name.length - 2, data.result[PMID].authors[i].name.length - 1 ) + '. ' +
                                                                data.result[PMID].authors[i].name.substring( data.result[PMID].authors[i].name.length - 1 ) + '., ';

                                                } else {

                                                    authors +=  data.result[PMID].authors[i].name.substring( 0, data.result[PMID].authors[i].name.length - 2 ) + ', ' +
                                                                data.result[PMID].authors[i].name.substring( data.result[PMID].authors[i].name.length - 1 ) + '., ';

                                                }

                                            }

                                            if ( (/( \w\w)/g).test(data.result[PMID].lastauthor) ) {

                                                authors +=  '& ' + data.result[PMID].lastauthor.substring( 0, data.result[PMID].lastauthor.length - 3 ) + ', ' +
                                                            data.result[PMID].lastauthor.substring( data.result[PMID].lastauthor.length - 2, data.result[PMID].lastauthor.length - 1 ) + '. ' +
                                                            data.result[PMID].lastauthor.substring( data.result[PMID].lastauthor.length - 1 ) + '. ';

                                            } else {

                                                authors +=  '& ' + data.result[PMID].lastauthor.substring( 0, data.result[PMID].lastauthor.length - 2 ) + ', ' +
                                                            data.result[PMID].lastauthor.substring( data.result[PMID].lastauthor.length - 1 ) + '. ';

                                            }

                                        }
                                        // >7 AUTHORS
                                        else {

                                            for (i = 0; i < 6; i++) {

                                                if ( (/( \w\w)/g).test(data.result[PMID].authors[i].name) ) {

                                                    authors +=  data.result[PMID].authors[i].name.substring( 0, data.result[PMID].authors[i].name.length - 3 ) + ', ' +
                                                                data.result[PMID].authors[i].name.substring( data.result[PMID].authors[i].name.length - 2, data.result[PMID].authors[i].name.length - 1 ) + '. ' +
                                                                data.result[PMID].authors[i].name.substring( data.result[PMID].authors[i].name.length - 1 ) + '., ';

                                                } else {

                                                    authors +=  data.result[PMID].authors[i].name.substring( 0, data.result[PMID].authors[i].name.length - 2 ) + ', ' +
                                                                data.result[PMID].authors[i].name.substring( data.result[PMID].authors[i].name.length - 1 ) + '., ';

                                                }

                                            }

                                            if ( (/( \w\w)/g).test(data.result[PMID].lastauthor) ) {

                                                authors +=  '. . . ' + data.result[PMID].lastauthor.substring( 0, data.result[PMID].lastauthor.length - 3 ) + ', ' +
                                                            data.result[PMID].lastauthor.substring( data.result[PMID].lastauthor.length - 2, data.result[PMID].lastauthor.length - 1 ) + '. ' +
                                                            data.result[PMID].lastauthor.substring( data.result[PMID].lastauthor.length - 1 ) + '. ';

                                            } else {

                                                authors +=  '. . . ' + data.result[PMID].lastauthor.substring( 0, data.result[PMID].lastauthor.length - 2 ) + ', ' +
                                                            data.result[PMID].lastauthor.substring( data.result[PMID].lastauthor.length - 1 ) + '. ';

                                            }


                                        }

                                        output = authors + '(' + pubYear + '). ' + title + ' <em>' + journalName + '</em>, ' + (volume !== '' ? volume : '') + (issue !== '' ? '(' + issue + '), ' : '') + pages + '.';

                                    }

                                    // INCLUDE LINK TO PUBMED IF CHECKBOX IS CHECKED
                                    if ( includePubmedLink ) {
                                        output += ' PMID: <a href="http://www.ncbi.nlm.nih.gov/pubmed/' + PMID + '" target="_blank">' + PMID + '</a>';
                                    }

                                    editor.insertContent(output);
                                    editor.setProgressState(0);

                                });
                            }
                        }
                    });
            });

            editor.addShortcut('meta+alt+c', 'Insert Inline Citation', function() {
                    editor.windowManager.open({
                        title: 'Insert Citation',
                        width: 600,
                        height: 88,
                        body: [
                                {
                                    type: 'textbox',
                                    name: 'citation_number',
                                    label: 'Citation Number',
                                    value: ''
                                },
                                {
                                    type: 'checkbox',
                                    name: 'citation_checkbox',
                                    checked: false,
                                    label: 'Return Citation?',
                                },
                              ],

                        onsubmit: function(e) {

                            var trailingText;

                            if (e.data.citation_checkbox) {
                                    trailingText = (' return=TRUE]');
                                } else {
                                    trailingText = (']');
                                }

                            editor.insertContent(
                                '[cite num=&quot;' + e.data.citation_number + '&quot;' + trailingText
                                );
                        }
                    });
            });

        }
		);


	})
();
