
(function() {

    tinymce.PluginManager.add('abt_ref_id_parser_mce_button', function(editor, url) {
        editor.addButton('abt_ref_id_parser_mce_button', 
			{
				type: 'menubutton',
				image: url+'/book.png',
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
															body: [
																	{
																		type: 'textbox',
																		name: 'ref_id_number',
																		label: 'PMID/PMCID/DOI',
																		value: ''
																	},
																	{
																		type: 'label',
																		text: 'Note: DOI method rarely works. Use PMID/PMCID whenever possible.'
												                    }
												                  ],
															onsubmit: function(e) {
																editor.insertContent(
																	'[ref id=&quot;' + e.data.ref_id_number + '&quot;]'
																);
															}
														});
												}
											}
										]
							},
							{
								text: 'Peer Review Tools',
								menu:   [
											// TODO: Peer Review Box (Disabled)
											{
												text: 'Insert Peer Review Box',
												disabled: true
											}
										]
							}
						]
			}
		);
	});
})();