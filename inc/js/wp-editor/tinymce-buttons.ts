/// <reference path="../ABT.d.ts"/>
/// <reference path="./inc/toTitleCase.ts"/>
/// <reference path="./main-parser.ts"/>
/// <reference path="./parsers/ama.ts"/>
/// <reference path="./parsers/apa.ts"/>
declare var tinymce, tinyMCE, AU_locationInfo


tinymce.PluginManager.add('abt_ref_id_parser_mce_button', (editor, url: string) => {

  let ABT_Button: TinyMCEPluginButton = {
    type: 'menubutton',
    image: url + '/../images/book.png',
    title: 'Academic Blogger\'s Toolkit',
    icon: true,
    menu: [],
  };

  //==================================================
  //                 MENU ITEMS
  //==================================================

  let separator: TinyMCEMenuItem = { text: '-' };


  let bibToolsMenu: TinyMCEMenuItem = {
    text: 'Bibliography Tools',
    menu: [],
  };


  let trackedLink: TinyMCEMenuItem = {
    text: 'Tracked Link',
    onclick: () => {

      let user_selection = tinyMCE.activeEditor.selection.getContent({format: 'text'});

      /** TODO: Fix this so it doesn't suck */
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
        onsubmit: (e) => {
          let trackedUrl = e.data.tracked_url;
          let trackedTitle = e.data.tracked_title;
          let trackedTag = e.data.tracked_tag;
          let trackedLink = `<a href="${trackedUrl}" id="${trackedTag}" ` +
            `${e.data.tracked_new_window ? 'target="_blank"' : ''}>${trackedTitle}</a>`;

          editor.execCommand('mceInsertContent', false, trackedLink);

        }
      });
    }
  }
  // End Tracked Link Menu Item

  let requestTools: TinyMCEMenuItem = {
    text: 'Request More Tools',
    onclick: () => {
      editor.windowManager.open({
        title: 'Request More Tools',
        body: [{
          type: 'container',
          html:
            `<div style="text-align: center;">` +
              `Have a feature or tool in mind that isn't available?<br>` +
              `<a ` +
              `href="https://github.com/dsifford/academic-bloggers-toolkit/issues" ` +
              `style="color: #00a0d2;" ` +
              `target="_blank">Open an issue</a> on the GitHub repository and let me know!` +
            `</div>`,
        }],
        buttons: [],
      });
    }
  }


  let inlineCitation: TinyMCEMenuItem = {
    text: 'Inline Citation',
    onclick: () => {
      editor.windowManager.open(<TinyMCEWindowMangerObject>{
        title: 'Inline Citation',
        url: AU_locationInfo.tinymceViewsURL + 'inline-citation.html',
        width: 400,
        height: 85,
        onClose: (e) => {
          editor.insertContent(
            '[cite num=&quot;' + e.target.params.data + '&quot;]'
          );
        }
      });
    }
  }

  let formattedReference: TinyMCEMenuItem = {
    text: 'Formatted Reference',
    onclick: () => {
      editor.windowManager.open(<TinyMCEWindowMangerObject>{
        title: 'Insert Formatted Reference',
        url: AU_locationInfo.tinymceViewsURL + 'formatted-reference.html',
        width: 600,
        height: 100,
        onclose: (e: any) => {

          // If the user presses the exit button, return.
          if (Object.keys(e.target.params).length === 0) {
            return;
          }
          editor.setProgressState(1);
          let payload: ReferenceFormData = e.target.params.data;
          let refparser = new Parsers.MainParser(payload, editor);

          console.log(payload);

          if (payload.hasOwnProperty('manual-type-selection')) {
            refparser.fromManualInput(payload);
            editor.setProgressState(0);
            return;
          }

          // do pmid parsing
          refparser.fromPMID();

        },
      });
    },
  }

    //   onsubmit: function(e) {
    //
    //     editor.setProgressState(1);
    //     var inputText = e.data.ref_id_number;
    //     var citationFormat = e.data.ref_id_citation_type;
    //     var includePubmedLink = e.data.ref_id_include_link;
    //     var requestURL = 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=' + inputText + '&version=2.0&retmode=json';
    //
    //     var request = new XMLHttpRequest();
    //     request.open('GET', requestURL, true);
    //     request.onload = function() {
    //       if (request.readyState === 4) {
    //         if (request.status === 200) {
    //           console.log(request.responseText)
    //           let output = parseRequestData(JSON.parse(request.responseText), inputText, citationFormat, includePubmedLink);
    //           editor.insertContent(output);
    //           editor.setProgressState(0);
    //         } else {
    //           alert('ERROR: PMID not recognized.');
    //           editor.setProgressState(0);
    //           return;
    //         }
    //       }
    //     };
    //     request.send(null);
    //
    //   }
    // });



  bibToolsMenu.menu.push(inlineCitation, separator, formattedReference);
  ABT_Button.menu.push(bibToolsMenu, trackedLink, separator, requestTools);


  editor.addButton('abt_ref_id_parser_mce_button', ABT_Button);




/* TODO: */
//   editor.addShortcut('meta+alt+r', 'Insert Formatted Reference', function() {
//     editor.windowManager.open({
//       title: 'Insert Formatted Reference',
//       width: 600,
//       height: 125,
//       body: [{
//         type: 'textbox',
//         name: 'ref_id_number',
//         label: 'PMID',
//         value: ''
//       }, {
//           type: 'listbox',
//           label: 'Citation Format',
//           name: 'ref_id_citation_type',
//           'values': [{
//             text: 'American Medical Association (AMA)',
//             value: 'AMA'
//           }, {
//               text: 'American Psychological Association (APA)',
//               value: 'APA'
//             }]
//
//         }, {
//           type: 'checkbox',
//           name: 'ref_id_include_link',
//           label: 'Include link to PubMed?'
//         }
//       ],
//       onsubmit: function(e) {
//
//         editor.setProgressState(1);
//         var PMID = e.data.ref_id_number;
//         var citationFormat = e.data.ref_id_citation_type;
//         var includePubmedLink = e.data.ref_id_include_link;
//
//         var request = new XMLHttpRequest();
//         request.open('GET', 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=' + PMID + '&version=2.0&retmode=json', true);
//         request.onload = function() {
//           if (request.readyState === 4) {
//             if (request.status === 200) {
//               let output = parseRequestData(JSON.parse(request.responseText), PMID, citationFormat, includePubmedLink);
//               editor.insertContent(output);
//               editor.setProgressState(0);
//             } else {
//               alert('ERROR: PMID not recognized.');
//               editor.setProgressState(0);
//               return;
//             }
//           }
//         };
//         request.send(null);
//
//       }
//     });
//   });
//
//   editor.addShortcut('meta+alt+c', 'Insert Inline Citation', function() {
//     editor.windowManager.open({
//       title: 'Insert Citation',
//       width: 600,
//       height: 58,
//       body: [{
//         type: 'textbox',
//         name: 'citation_number',
//         label: 'Citation Number',
//         value: ''
//       }],
//       onsubmit: function(e) {
//         editor.insertContent(
//           '[cite num=&quot;' + e.data.citation_number + '&quot;]'
//           );
//       }
//     });
//   });
//
// });
//
});
