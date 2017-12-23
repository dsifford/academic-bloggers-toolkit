<div id='abt-reflist__root'>
	<div id="abt_preload_container"></div>
</div>
<script type="text/javascript">
	( function ( global ) {
		var el=document.createElement( 'span' );
		el.id='abt_changelog';
		document.querySelector( '#abt-reflist > h2' ).appendChild( el );
		global.HW_config={selector:"#abt_changelog",account:"LJ4gE7"};
	} )( window );
</script>
<script async src="//cdn.headwayapp.co/widget.js"></script>
<style type="text/css">
	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		font-weight: 500;
	}
	#abt-reflist__root {
		margin: 0 -12px -12px -12px;
		font-family: "Roboto", sans-serif;
	}
	#abt-reflist {
		z-index: 1;
		transition: box-shadow 0.3s cubic-bezier( .25,.8,.25,1 );
	}
	#abt-reflist.fixed {
		position: fixed;
		box-shadow: 0 14px 28px rgba( 0, 0, 0, .25 ), 0 10px 10px rgba( 0, 0, 0, .22 );
		border: solid rgba( 0, 0, 0, .12 ) 1px;
		margin-right: 10px;
	}
	#abt-reflist h2.hndle {
		box-shadow: 0 1px 3px rgba( 0, 0, 0, .12 ), 0 1px 2px rgba( 0, 0, 0, .24 );
	}
	#abt-reflist .inside {
		margin: 0;
		min-width: 254px;
	}
	#abt_changelog {
		margin: 0 12px;
	}
	#abt-reflist #HW_badge_cont {
		display: inline-block;
		height: auto;
		width: auto;
		top: auto;
		vertical-align: middle;
	}
	#abt-reflist #HW_badge {
		position: relative;
		top: 0;
		left: auto;
	}
	#wp-content-editor-tools,
	#adminmenuwrap,
	#adminmenuback {
		z-index: 1 !important;
	}
	.wp-editor-expand div.mce-toolbar-grp {
		z-index: auto;
	}
	.is-focused:not( .is-open ) > .Select-control {
		border-color: #5b9dd9;
		box-shadow: 0 0 2px rgba( 30, 140, 190, 0.8 );
	}
	@media screen and ( min-width: 782px ) {
		#abt-reflist.fixed {
			margin-right: 25px;
			width: 278px;
		}
	}
	@media only screen and ( max-width: 850px ) {
		#abt-reflist.fixed {
			width: calc( 100% - 25px - 52px );
		}
	}
	@media screen and ( max-width: 782px ) {
		#abt-reflist.fixed {
			width: calc( 100% - 25px );
		}
	}
	#abt_preload_container {
		height: 48px;
		background: #f5f5f5;
		width: 100%;
		margin-top: -6px;
		box-shadow: 0 1px 3px rgba( 0, 0, 0, .12 ), 0 1px 2px rgba( 0, 0, 0, .24 ), 0 -1px 0 rgba( 16, 22, 26, .10 );
	}
</style>
