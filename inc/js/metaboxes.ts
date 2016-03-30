declare var wp, meta_image;

if (document.readyState != 'loading'){
	editorJS();
} else {
	document.addEventListener('DOMContentLoaded', editorJS);
}

function editorJS() {

  var authorNameInputs = document.querySelectorAll('input[id^=author_name_]');
  var authorResponseTables = document.querySelectorAll('table[id^=author_response]');
  var reviewContent = document.querySelectorAll('textarea[id^=peer_review_content_]');
  var responseContent = document.querySelectorAll('textarea[id^=author_content_]');

  // Inital actions on load
  for (var i = 0; i < 3; i++) {

    // Hide empty author responses
    if ((authorNameInputs[i] as any).value == '') {
      (authorResponseTables[i] as any).style.display = 'none';
    }

    // Replace <br> and <p> tags with actual line breaks on post edit screen
    (reviewContent[i] as any).value = (reviewContent[i] as any).value.replace(/(<br>)|(<br \/>)|(<p>)|(<\/p>)/, "").replace(/(<br>)|(<br \/>)|(<p>)|(<\/p>)/g, "\r");
    (responseContent[i] as any).value = (responseContent[i] as any).value.replace(/(<br>)|(<br \/>)|(<p>)|(<\/p>)/, "").replace(/(<br>)|(<br \/>)|(<p>)|(<\/p>)/g, "\r");

  }


  // ==================================================
  //               SELECT BOX HANDLER
  // ==================================================

  // Show/hide nodes based on select option
  var selectBox = document.querySelector('#reviewer_selector');
  var selectDivs = document.querySelectorAll('#peer_review_metabox_wrapper > div');
  selectBox.addEventListener('change', selectHandler);

  // Simulate a change event on initial page load
  var simulatedChange = new Event('change');
  selectBox.dispatchEvent(simulatedChange);

  function selectHandler(e) {
    for (var i = 0; i < selectDivs.length; i++) {
      (selectDivs[i] as any).style.display = 'none';
    }

    switch (e.target.value) {
      case '3':
        selectDivs['2'].style.display = '';
      case '2':
        selectDivs['1'].style.display = '';
      case '1':
        selectDivs['0'].style.display = '';
    }

  };


  // ==================================================
  //          AUTHOR RESPONSE BUTTON HANDLER
  // ==================================================

  // Show hide author response based on button toggle
  var toggleButtons = document.querySelectorAll('input[id^=author_response_button]');
  for (var i = 0; i < toggleButtons.length; i++) {

    toggleButtons[i].addEventListener('click', function(e) {

      let currentIndex = parseInt((e.target as any).id.slice(-1)) - 1;

      if ((authorResponseTables[currentIndex] as any).style.display == 'none') {
        (authorResponseTables[currentIndex] as any).style.display = 'block';
        return;
      }

      (authorResponseTables[currentIndex] as any).style.display = 'none';

    });
  }

  //=====================================================
  //          MEDIA UPLOAD HANDLER
  //=====================================================

  // Instantiates the variable that holds the media library frame.
  var abt_meta_image_frames = [null, null, null, null, null, null];
  wp.media.frames.abt_meta_image_frames = {
    '1': null,
    '2': null,
    '3': null,
    '4': null,
    '5': null,
    '6': null
  };

  var headshotButtons = document.querySelectorAll('input[id^=headshot_image_button]');
  for (var i = 0; i < headshotButtons.length; i++) {

    headshotButtons[i].addEventListener('click', function(e) {

      var headshotImageInput;
      var i = parseInt((e.target as any).id.slice(-1)) - 1;
      switch (i) {
        case 0:
        case 1:
        case 2:
          headshotImageInput = document.querySelector('#reviewer_headshot_image_' + (i+1).toString());
          break;
        case 3:
        case 4:
        case 5:
          headshotImageInput = document.querySelector('#author_headshot_image_' + (i-2).toString());
          break;
      }

      if (abt_meta_image_frames[i]) {
        abt_meta_image_frames[i].open();
        return;
      }

      abt_meta_image_frames[i] = wp.media.frames.abt_meta_image_frames[i] = wp.media({
          title: meta_image.title,
          button: { text:  meta_image.button },
          library: { type: 'image' }
      });

      // Runs when an image is selected.
      abt_meta_image_frames[i].on('select', function(){

        // Grabs the attachment selection and creates a JSON representation of the model.
        var media_attachment = abt_meta_image_frames[i].state().get('selection').first().toJSON();

        // Sends the attachment URL to our custom image input field.
        headshotImageInput.value = media_attachment.url;

      });

      // Opens the media library frame.
      abt_meta_image_frames[i].open();

    });

  }

}
