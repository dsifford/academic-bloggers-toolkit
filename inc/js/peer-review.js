jQuery(document).ready(function($) {

		$( "#abt_PR_boxes" ).accordion({
      		collapsible: true,
      		active: false,
      		heightStyle: "content",
   		 });

		// Add smooth scrolling to anchor links + correct for admin bar
		var $root = $('html, body');
		$('a').click(function(){
		    $root.animate({
		        scrollTop: $('[name="' + $.attr(this, 'href').substr(1) + '"]').offset().top + (-32)
		    }, 500);
		    return false;
		});

});
