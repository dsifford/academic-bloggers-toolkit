declare var tinymce, tinyMCE, AU_locationInfo

interface String {
  toTitleCase(): string
}
String.prototype.toTitleCase = function(): string {
  let smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;

  return this.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function(match, index, title){
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

interface TinyMCEMenuItem {
  text: string
  menu?: TinyMCEMenuItem[]
  onclick?: (e?: Event) => void
}

interface TinyMCEWindowElement {
  type: string
  name: string
  label: string
  value: string
  tooltip?: string
}

interface TinyMCEWindowMangerObject {
  title: string
  width: number
  height: any
  body?: TinyMCEWindowElement[]
  url?: string
  onclose?: (e?: Event) => void
}

interface TinyMCEPluginButton {
  type: string
  image: string
  title: string
  icon: boolean
  menu: TinyMCEMenuItem[]
}

interface Author {
  authtype: string
  clusterid: string
  name: string
}

interface ReferenceFormData {
  'citation-format': string
  'pmid-input'?: string
  'include-link'?: boolean
  'manual-type-selection'?: string
}

interface ReferenceObj {
  authors: Author[]
  title: string
  source: string
  pubdate: string
  volume: string
  issue: string
  pages: string
  lastauthor: string
  fulljournalname?: string
}

interface ReferencePayload {
  [i: number]: ReferenceObj
  uids?: string[]
}




class ReferenceParser {

  public citationFormat: string;
  public includeLink: boolean;
  public manualCitationType: string;
  public PMIDquery: string;
  public editor: any;

  constructor(data: ReferenceFormData, editor: Object) {
    this.citationFormat = data['citation-format'];
    this.PMIDquery = data['pmid-input'].replace(/\s/g, '');
    this.manualCitationType = data['manual-type-selection'];
    this.includeLink = data['include-link'];
    this.editor = editor;
  }

  public fromPMID(): void {
    let requestURL = `http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${this.PMIDquery}&version=2.0&retmode=json`;
    let request = new XMLHttpRequest();
    request.open('GET', requestURL, true);
    request.addEventListener('load', this._parsePMID.bind(this));
    request.send(null);
  }


  private _parsePMID(e: Event): void {
    let req = <XMLHttpRequest>e.target;

    // Handle bad request
    if (req.readyState !== 4 || req.status !== 200) {
      this.editor.windowManager.alert('Your request could not be processed. Please try again.');
      return;
    }

    let res = JSON.parse(req.responseText);

    // Handle response errors
    if (res.error) {
      let badPMID = res.error.match(/uid (\S+)/)[1];
      let badIndex = this.PMIDquery.split(',').indexOf(badPMID);
      this.editor.windowManager.alert(
        `PMID "${badPMID}" at index #${badIndex + 1} failed to process. Double check your list!`
      );
    }

    let payload: string[]|Error;
    switch (this.citationFormat) {
      case 'ama':
        payload = this._parseAMA(res.result);
        break;
      case 'apa':
        payload = this._parseAPA(res.result);
        break;
      default:
        this.editor.windowManager.alert('An error occurred while trying to parse the citation');
        return;
    }

    if ((payload as Error).name === 'Error') {
      this.editor.windowManager.alert((payload as Error).message);
      return;
    }
    if ((payload as string[]).length === 1) {
      this.editor.insertContent((payload as string[]).join());
      this.editor.setProgressState(0);
      return;
    }

    let orderedList: string =
      '<ol>' + (payload as string[]).map((ref: string) => `<li>${ref}</li>`).join('') + '</ol>';

    this.editor.insertContent(orderedList);
    this.editor.setProgressState(0);

  }


  private _parseAMA(data: ReferencePayload): string[]|Error {
    let pmidArray: string[] = data.uids;
    let output: string[];

    try {
      output = pmidArray.map((PMID: string): string => {
        let ref: ReferenceObj = data[PMID];
        let year: string = ref.pubdate.substr(0, 4);
        let link  = this.includeLink === true
                  ? ` PMID: <a href="http://www.ncbi.nlm.nih.gov/pubmed/${PMID}" target="_blank">${PMID}</a>`
                  : '';

        let authors: string = '';
        switch (ref.authors.length) {
          case 0:
            throw new Error(`No authors were found for PMID ${PMID}`);
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
          case 6:
            authors = ref.authors.map((author: Author) => author.name).join(', ') + '.';
            break;
          default:
            for (let i = 0; i < 3; i++) { authors+= ref.authors[i].name + ', ' };
            authors += 'et al.';
        }

        return `${authors} ${ref.title} <em>${ref.source}.</em> ${year}; ` +
               `${ref.volume === undefined || ref.volume === '' ? '' : ref.volume}` +
               `${ref.issue === undefined || ref.issue === '' ? '' : '('+ref.issue+')'}:` +
               `${ref.pages}.${link}`;
      });
    } catch(e) {
      return e;
    }

    return output;
  }

  private _parseAPA(data: ReferencePayload): string[]|Error {
    let pmidArray: string[] = data.uids;
    let output: string[];

    try {
      output = pmidArray.map((PMID: string): string => {
        let ref: ReferenceObj = data[PMID];
        let year: string = ref.pubdate.substr(0, 4);
        let link  = this.includeLink === true
                  ? ` PMID: <a href="http://www.ncbi.nlm.nih.gov/pubmed/${PMID}" target="_blank">${PMID}</a>`
                  : '';

        let authors: string = '';
        switch (ref.authors.length) {
          case 0:
            throw new Error(`No authors were found for PMID ${PMID}`);
          case 1:
            authors = ref.authors.map((author: Author) =>
              `${author.name.split(' ')[0]}, ` +                   // Last name
              `${author.name.split(' ')[1].split('').join('. ')}.` // First Initial(s)
            ).join();
            break;
          case 2:
            authors = ref.authors.map((author: Author) =>
              `${author.name.split(' ')[0]}, ` +                    // Last name
              `${author.name.split(' ')[1].split('').join('. ')}.`  // First Initial(s)
            ).join(', & ');
            break;
          case 3:
          case 4:
          case 5:
          case 6:
          case 7:
            authors = ref.authors.map((author, i, arr) => {
              if (i === arr.length - 1) {
                return(
                  `& ${author.name.split(' ')[0]}, ` +
                  `${author.name.split(' ')[1].split('').join('. ')}.`
                );
              }
              return(
                `${author.name.split(' ')[0]}, ` +
                `${author.name.split(' ')[1].split('').join('. ')}., `
              );
            }).join('');
            break;
          default:
            for (let i = 0; i < 6; i++) {
              authors +=
                `${ref.authors[i].name.split(' ')[0]}, ` +
                `${ref.authors[i].name.split(' ')[1].split('').join('. ')}., `
            }
            authors += `. . . ` +
              `${ref.lastauthor.split(' ')[0]}, ` +
              `${ref.lastauthor.split(' ')[1].split('').join('. ')}.`;
            break;
        }

        return `${authors} (${year}). ${ref.title} <em>` +
          `${ref.fulljournalname === undefined || ref.fulljournalname === '' ? ref.source : ref.fulljournalname.toTitleCase()}.</em>, ` +
          `${ref.volume === undefined || ref.volume === '' ? '' : ref.volume}` +
          `${ref.issue === undefined || ref.issue === '' ? '' : '('+ref.issue+')'}, ` +
          `${ref.pages}.${link}`;
      });
    } catch(e) {
      return e;
    }

    return output;
  }

}


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
          let refparser = new ReferenceParser(payload, editor);

          console.log(payload);

          if (payload.hasOwnProperty('manual-type-selection')) {
            // do manual parsing
            editor.setProgressState(0);
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
