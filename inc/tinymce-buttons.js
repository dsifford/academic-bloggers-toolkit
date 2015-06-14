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

(function() {
    tinymce.PluginManager.add('custom_mce_button', function(editor, url) {
        editor.addButton('custom_mce_button', {
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