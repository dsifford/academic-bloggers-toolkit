interface Window {
  tinymce: any;
}

let addManuallyButton = document.getElementById('add-manually');
addManuallyButton.addEventListener('click', (e: Event) => {

  let manualCitation = document.getElementById('manual-citation');
  let pubmedRelated = document.getElementById('pubmed-related');

  pubmedRelated.style.display = 'none';
  manualCitation.style.display = '';

})


let manualCitationSelection = document.getElementById('manual-type-selection');
manualCitationSelection.addEventListener('change', (e: Event) => {

  let modalContainer = top.document.querySelector('div.mce-floatpanel[aria-label="Insert Formatted Reference"]');
  (<any>modalContainer).style.height = '536px';
  (<any>modalContainer).children[0].children[1].style.height = '500px';

  for (let i = 0; i < e.srcElement.childElementCount; i++) {
    console.log(manualCitationSelection.children[i])
    if (manualCitationSelection.children[i].attributes[0].value === (<any>e.target).value) {
      document.getElementById(`manual-${manualCitationSelection.children[i].attributes[0].value}`).style.display = '';
      continue;
    }
    document.getElementById(`manual-${manualCitationSelection.children[i].attributes[0].value}`).style.display = 'none';
  }

});
