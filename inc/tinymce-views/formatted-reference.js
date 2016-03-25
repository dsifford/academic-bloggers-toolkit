var addManuallyButton = document.getElementById('add-manually');
addManuallyButton.addEventListener('click', function (e) {
    var manualCitation = document.getElementById('manual-citation');
    var pubmedRelated = document.getElementById('pubmed-related');
    pubmedRelated.style.display = 'none';
    manualCitation.style.display = '';
});
var manualCitationSelection = document.getElementById('manual-type-selection');
manualCitationSelection.addEventListener('change', function (e) {
    var modalContainer = top.document.querySelector('div.mce-floatpanel[aria-label="Insert Formatted Reference"]');
    modalContainer.style.height = '536px';
    modalContainer.children[0].children[1].style.height = '500px';
    for (var i = 0; i < e.srcElement.childElementCount; i++) {
        console.log(manualCitationSelection.children[i]);
        if (manualCitationSelection.children[i].attributes[0].value === e.target.value) {
            document.getElementById("manual-" + manualCitationSelection.children[i].attributes[0].value).style.display = '';
            continue;
        }
        document.getElementById("manual-" + manualCitationSelection.children[i].attributes[0].value).style.display = 'none';
    }
});
