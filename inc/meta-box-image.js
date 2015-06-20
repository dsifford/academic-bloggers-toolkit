/*
 * Attaches the image uploader to the input field
 */
jQuery(document).ready(function($){
    
    // Show/hide nodes based on selector option
    $('#reviewer_selector').bind('change', function (e) { 
        if( $('#reviewer_selector').val() == '0') {
            $('#tabs-1').hide('slow');
            $('#tabs-2').hide('slow');
            $('#tabs-3').hide('slow');
        }
        else if( $('#reviewer_selector').val() == '1') {
            $('#tabs-1').show('slow');
            $('#tabs-2').hide('slow');
            $('#tabs-3').hide('slow');
        }
        else if( $('#reviewer_selector').val() == '2') {
            $('#tabs-1').show('slow');
            $('#tabs-2').show('slow');
            $('#tabs-3').hide('slow');
        } else {
            $('#tabs-1').show('slow');
            $('#tabs-2').show('slow');
            $('#tabs-3').show('slow');
        }
      }).trigger('change');

// TODO: Combine the following three functions into a single function

    // Show hide author response based on button toggle
    $('#author_response_button_1').on('click', function(event) {
        event.preventDefault();

        $('#author_response_1').toggle(500);
    });

    $('#author_response_button_2').on('click', function(event) {
        event.preventDefault();

        $('#author_response_2').toggle(500);
    });

    $('#author_response_button_3').on('click', function(event) {
        event.preventDefault();

        $('#author_response_3').toggle(500);
    });



    // Instantiates the variable that holds the media library frame.
    var meta_image_frame_reviewer_1, meta_image_frame_reviewer_2, meta_image_frame_reviewer_3, 
        meta_image_frame_author_1, meta_image_frame_author_2, meta_image_frame_author_3; 

// -----------------------------------------------------------------
// TODO: Combine the following 6 functions into a single function
// ----------------------------------------------------------------

    // Image selector function for First Reviewer
    $('#reviewer_headshot_image_button_1').click(function(e){

        e.preventDefault();

        // If the frame already exists, re-open it.
        if ( meta_image_frame_reviewer_1 ) {
            meta_image_frame_reviewer_1.open();
            return;
        }
 
        // Sets up the media library frame
        meta_image_frame_reviewer_1 = wp.media.frames.meta_image_frame_reviewer_1 = wp.media({
            title: meta_image.title,
            button: { text:  meta_image.button },
            library: { type: 'image' }
        });
 
        // Runs when an image is selected.
        meta_image_frame_reviewer_1.on('select', function(){
 
            // Grabs the attachment selection and creates a JSON representation of the model.
            var media_attachment_reviewer_1 = meta_image_frame_reviewer_1.state().get('selection').first().toJSON();
 
            // Sends the attachment URL to our custom image input field.
            $('#reviewer_headshot_image_1').val(media_attachment_reviewer_1.url);
        });
 
        // Opens the media library frame.
        meta_image_frame_reviewer_1.open();
    });


    // Image selector function for Second Reviewer
    $('#reviewer_headshot_image_button_2').click(function(e){

        e.preventDefault();

        // If the frame already exists, re-open it.
        if ( meta_image_frame_reviewer_2 ) {
            meta_image_frame_reviewer_2.open();
            return;
        }
    
        // Sets up the media library frame
        meta_image_frame_reviewer_2 = wp.media.frames.meta_image_frame_reviewer_2 = wp.media({
            title: meta_image.title,
            button: { text:  meta_image.button },
            library: { type: 'image' }
        });
    
        // Runs when an image is selected.
        meta_image_frame_reviewer_2.on('select', function(){
    
            // Grabs the attachment selection and creates a JSON representation of the model.
            var media_attachment_reviewer_2 = meta_image_frame_reviewer_2.state().get('selection').first().toJSON();
    
            // Sends the attachment URL to our custom image input field.
            $('#reviewer_headshot_image_2').val(media_attachment_reviewer_2.url);
        });
    
        // Opens the media library frame.
        meta_image_frame_reviewer_2.open();
    });

    
    // Image selector function for Third Reviewer
    $('#reviewer_headshot_image_button_3').click(function(e){

        e.preventDefault();

        // If the frame already exists, re-open it.
        if ( meta_image_frame_reviewer_3 ) {
            meta_image_frame_reviewer_3.open();
            return;
        }
    
        // Sets up the media library frame
        meta_image_frame_reviewer_3 = wp.media.frames.meta_image_frame_reviewer_3 = wp.media({
            title: meta_image.title,
            button: { text:  meta_image.button },
            library: { type: 'image' }
        });
    
        // Runs when an image is selected.
        meta_image_frame_reviewer_3.on('select', function(){
    
            // Grabs the attachment selection and creates a JSON representation of the model.
            var media_attachment_reviewer_3 = meta_image_frame_reviewer_3.state().get('selection').first().toJSON();
    
            // Sends the attachment URL to our custom image input field.
            $('#reviewer_headshot_image_3').val(media_attachment_reviewer_3.url);
        });
    
        // Opens the media library frame.
        meta_image_frame_reviewer_3.open();
    });


    // Image selector function for First Author Reponse
    $('#author_headshot_image_button_1').click(function(e){

        e.preventDefault();

        // If the frame already exists, re-open it.
        if ( meta_image_frame_author_1 ) {
            meta_image_frame_author_1.open();
            return;
        }
    
        // Sets up the media library frame
        meta_image_frame_author_1 = wp.media.frames.meta_image_frame_author_1 = wp.media({
            title: meta_image.title,
            button: { text:  meta_image.button },
            library: { type: 'image' }
        });
    
        // Runs when an image is selected.
        meta_image_frame_author_1.on('select', function(){
    
            // Grabs the attachment selection and creates a JSON representation of the model.
            var media_attachment_author_1 = meta_image_frame_author_1.state().get('selection').first().toJSON();
    
            // Sends the attachment URL to our custom image input field.
            $('#author_headshot_image_1').val(media_attachment_author_1.url);
        });
    
        // Opens the media library frame.
        meta_image_frame_author_1.open();
    });


    // Image selector function for Second Author Response
    $('#author_headshot_image_button_2').click(function(e){

        e.preventDefault();

        // If the frame already exists, re-open it.
        if ( meta_image_frame_author_2 ) {
            meta_image_frame_author_2.open();
            return;
        }
    
        // Sets up the media library frame
        meta_image_frame_author_2 = wp.media.frames.meta_image_frame_author_2 = wp.media({
            title: meta_image.title,
            button: { text:  meta_image.button },
            library: { type: 'image' }
        });
    
        // Runs when an image is selected.
        meta_image_frame_author_2.on('select', function(){
    
            // Grabs the attachment selection and creates a JSON representation of the model.
            var media_attachment_author_2 = meta_image_frame_author_2.state().get('selection').first().toJSON();
    
            // Sends the attachment URL to our custom image input field.
            $('#author_headshot_image_2').val(media_attachment_author_2.url);
        });
    
        // Opens the media library frame.
        meta_image_frame_author_2.open();
    });


    // Image selector function for Third Author Response
    $('#author_headshot_image_button_3').click(function(e){

        e.preventDefault();

        // If the frame already exists, re-open it.
        if ( meta_image_frame_author_3 ) {
            meta_image_frame_author_3.open();
            return;
        }
    
        // Sets up the media library frame
        meta_image_frame_author_3 = wp.media.frames.meta_image_frame_author_3 = wp.media({
            title: meta_image.title,
            button: { text:  meta_image.button },
            library: { type: 'image' }
        });
    
        // Runs when an image is selected.
        meta_image_frame_author_3.on('select', function(){
    
            // Grabs the attachment selection and creates a JSON representation of the model.
            var media_attachment_author_3 = meta_image_frame_author_3.state().get('selection').first().toJSON();
    
            // Sends the attachment URL to our custom image input field.
            $('#author_headshot_image_3').val(media_attachment_author_3.url);
        });
    
        // Opens the media library frame.
        meta_image_frame_author_3.open();
    });
    
    // Hide empty author response fields
    for (var i = 1; i < 4; i++) {
        if ( $('#author_name_' + i).val() === '' ) {
            $('#author_response_' + i).hide();
        }
    }


});