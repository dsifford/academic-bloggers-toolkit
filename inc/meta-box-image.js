/*
 * Attaches the image uploader to the input field
 */
jQuery(document).ready(function($){
 
    $('#reviewer_selector').bind('change', function (e) { 
        if( $('#reviewer_selector').val() == '0') {
            $('.form-table').hide('slow');
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

    // Instantiates the variable that holds the media library frame.
    var meta_image_frame;
 
    // Function for First Reviewer
    $('#reviewer_headshot_image_button_1').click(function(e){

        e.preventDefault();

        // If the frame already exists, re-open it.
        if ( meta_image_frame ) {
            meta_image_frame.open();
            return;
        }
 
        // Sets up the media library frame
        meta_image_frame = wp.media.frames.meta_image_frame = wp.media({
            title: meta_image.title,
            button: { text:  meta_image.button },
            library: { type: 'image' }
        });
 
        // Runs when an image is selected.
        meta_image_frame.on('select', function(){
 
            // Grabs the attachment selection and creates a JSON representation of the model.
            var media_attachment = meta_image_frame.state().get('selection').first().toJSON();
 
            // Sends the attachment URL to our custom image input field.
            $('#reviewer_headshot_image_1').val(media_attachment.url);
        });
 
        // Opens the media library frame.
        meta_image_frame.open();
    });

    // Function for Second Reviewer
    $('#reviewer_headshot_image_button_2').click(function(e){

        e.preventDefault();

        // If the frame already exists, re-open it.
        if ( meta_image_frame ) {
            meta_image_frame.open();
            return;
        }
    
        // Sets up the media library frame
        meta_image_frame = wp.media.frames.meta_image_frame = wp.media({
            title: meta_image.title,
            button: { text:  meta_image.button },
            library: { type: 'image' }
        });
    
        // Runs when an image is selected.
        meta_image_frame.on('select', function(){
    
            // Grabs the attachment selection and creates a JSON representation of the model.
            var media_attachment = meta_image_frame.state().get('selection').first().toJSON();
    
            // Sends the attachment URL to our custom image input field.
            $('#reviewer_headshot_image_2').val(media_attachment.url);
        });
    
        // Opens the media library frame.
        meta_image_frame.open();
    });

    // Function for Third Reviewer
    $('#reviewer_headshot_image_button_3').click(function(e){

        e.preventDefault();

        // If the frame already exists, re-open it.
        if ( meta_image_frame ) {
            meta_image_frame.open();
            return;
        }
    
        // Sets up the media library frame
        meta_image_frame = wp.media.frames.meta_image_frame = wp.media({
            title: meta_image.title,
            button: { text:  meta_image.button },
            library: { type: 'image' }
        });
    
        // Runs when an image is selected.
        meta_image_frame.on('select', function(){
    
            // Grabs the attachment selection and creates a JSON representation of the model.
            var media_attachment = meta_image_frame.state().get('selection').first().toJSON();
    
            // Sends the attachment URL to our custom image input field.
            $('#reviewer_headshot_image_3').val(media_attachment.url);
        });
    
        // Opens the media library frame.
        meta_image_frame.open();
    });
});