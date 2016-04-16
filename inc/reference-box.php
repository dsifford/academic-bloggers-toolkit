<?php

function call_abt_reference_box() {
    new ABT_Reference_Box();
}


if (is_admin()) {
    add_action('load-post.php', 'call_abt_reference_box');
    add_action('load-post-new.php', 'call_abt_reference_box');
}



class ABT_Reference_Box {

    public function __construct() {
        add_action('add_meta_boxes', array($this, 'add_metabox'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_js'));
        // add_action('save_post', array($this, 'save_PR_meta'));
        // add_action('admin_enqueue_scripts', array($this, 'enqueue_backend_scripts'));
    }

    public function add_metabox($post_type) {
        if ( in_array($post_type, array('post', 'page')) ) {
			add_meta_box(
				'abt_reflist',
				'Reference List',
				array($this, 'render_metabox'),
				'post',
				'side',
				'high'
			);
		}
    }

    public function render_metabox() {
        echo "<div id='abt-reflist' style='margin: 0 -12px;'></div>";
    }

    public function enqueue_js() {
        wp_register_script('abt_reflist', plugins_url('academic-bloggers-toolkit/inc/js/Reflist.js') );
    	wp_enqueue_script( 'abt_reflist', false, array(), false, true );
    }

}







 ?>
