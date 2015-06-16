// TODO: 

// (function() {
//     tinymce.PluginManager.add('custom_mce_button', function(editor, url) {
//         editor.addButton('custom_mce_button', {
//             text: 'Tooltip',
//             icon: false,
//             onclick: function() {
//                 editor.insertContent('Hello World!');
//             }
//         });
//     });
// })();

// In-text citation button function

(function() {
    tinymce.PluginManager.add('abt_inline_citation_mce_button', function(editor, url) {
        editor.addButton('abt_inline_citation_mce_button', {
            image: url+'/quotation_icon.png',
            title: 'Add Inline Citation',
            onclick: function() {
                editor.windowManager.open({
                    title: 'Insert Citation',
                    body: [{
                        type: 'textbox',
                        name: 'citation_number',
                        label: 'Citation Number',
                        value: ''
                    }, {
                        type: 'checkbox',
                        name: 'citation_checkbox',
                        checked: false,
                        label: 'Return Citation?',
                    }, ],
                    onsubmit: function(e) {

                    	if (e.data.citation_checkbox) {
                            	var trailingText = (' return=TRUE]');
                            } else {
                            	var trailingText = (']');
                            }
                        
                        editor.insertContent(
                            '[cite num=&quot;' + e.data.citation_number + '&quot;' + trailingText
                            );
                    }
                });
            }
        });
    });
})();


// Reference ID Parser Button Function

(function() {
    tinymce.PluginManager.add('abt_ref_id_parser_mce_button', function(editor, url) {
        editor.addButton('abt_ref_id_parser_mce_button', {
            image: url+'/book.png',
            title: 'Insert Formatted Reference',
            onclick: function() {
                editor.windowManager.open({
                    title: 'Insert Formatted Reference',
                    body: [{
                        type: 'textbox',
                        name: 'ref_id_number',
                        label: 'PMID/PMCID/DOI',
                        value: ''
                    }, {
                        type: 'label',
                        text: 'Note: DOI method rarely works. Use PMID/PMCID whenever possible.',

                    }, ],
                    onsubmit: function(e) {
                        
                        editor.insertContent(
                            '[ref id=&quot;' + e.data.ref_id_number + '&quot;]'
                            );
                    }
                });
            }
        });
    });
})();