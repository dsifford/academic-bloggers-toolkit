<?php 

/*
 * * * * * * * * * * * * * * * * *
 *	In-text citation shortcode * *
 * * * * * * * * * * * * * * * * *
*/

function inline_citation ( $atts ) {
	$a = shortcode_atts( array(
				'num' => 1,
				'return' => FALSE,
		), $atts);
	
	$cite_num = number_format($a['num'], 0);
	
	if ($a['return'] == FALSE) {
		return '<a name="bounceback' . esc_attr($a['num']) . '" class="cite" href="#citation' . esc_attr($a['num']) . '">[' . $cite_num . ']</a>';
	} else {	
		return '<a name="citation' . esc_attr($a['num']) . '" class="cite-return" href="#bounceback' . esc_attr($a['num']) . '">▲</a>';
	}
}
add_shortcode( 'cite', 'inline_citation' );


/*
 * * * * * * * * * * * * * * *
 *	Reference ID Parser  * * *
 * * * * * * * * * * * * * * *
*/

function ref_id_parser ( $atts ) {
	$a = shortcode_atts ( array(
			'id'    => '',
			'style' => '',
		), $atts);
	
	// Prepare URL to convert input ID to PMID
	$abt_get_url = 'http://www.ncbi.nlm.nih.gov/pmc/utils/idconv/v1.0/?tool=my_tool&email=my_email%40example.com&ids=' . esc_attr($a['id']) . '&format=json';	

	// Call API and obtain PMID
	$response = wp_remote_get( $abt_get_url );
	$tidy_json = json_decode( $response['body'] );
	$pmid = $tidy_json->{'records'}[0]->{'pmid'};

	if ( $pmid == '' ) {
	
		return '<strong style="color: red; font-size: 0.8em;">Unable to locate identifier for this reference. To avoid this error, please try again with the PMID.</strong>';
	
	}
	
	// Use PMID collected from previous step in an API GET call to Pubmed E-utils
	$abt_get_url = 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=' . $pmid . '&version=2.0&retmode=json';
	$response = wp_remote_get( $abt_get_url );
	$tidy_json = json_decode( $response['body'] );

	// Prepare empty variables

	$abt_authors = '';
	$abt_title = $tidy_json->{'result'}->{$pmid}->{'title'};
	$abt_journal_name = $tidy_json->{'result'}->{$pmid}->{'source'};
	$abt_pub_year = substr($tidy_json->{'result'}->{$pmid}->{'pubdate'}, 0, 4);
	$abt_volume = $tidy_json->{'result'}->{$pmid}->{'volume'};
	$abt_issue = $tidy_json->{'result'}->{$pmid}->{'issue'};
	$abt_pages = $tidy_json->{'result'}->{$pmid}->{'pages'};

	// Take formatted JSON and parse it into formatted citations

	// American Medical Association (AMA) Format

		if ( count($tidy_json->{'result'}->{$pmid}->{'authors'}) == 1 ) {
		
			$abt_authors = $tidy_json->{'result'}->{$pmid}->{'authors'}[0]->{'name'};
		
		} elseif ( count($tidy_json->{'result'}->{$pmid}->{'authors'}) > 1 && count($tidy_json->{'result'}->{$pmid}->{'authors'}) < 7 ) {
			
			for ( $i=0; $i < count($tidy_json->{'result'}->{$pmid}->{'authors'}) - 1; $i++ ) { 
				
				$abt_authors = $abt_authors . $tidy_json->{'result'}->{$pmid}->{'authors'}[$i]->{'name'} . ', ';

			}

			$abt_authors = $abt_authors . end($tidy_json->{'result'}->{$pmid}->{'authors'})->{'name'} . '.';

		} else {

			for ( $i=0; $i < 3; $i++ ) { 
				
				$abt_authors = $abt_authors . $tidy_json->{'result'}->{$pmid}->{'authors'}[$i]->{'name'} . ', ';

			}

			$abt_authors = $abt_authors . 'et al.';

		}

		if ( $abt_volume == "" ) {
		
			return( $abt_authors . ' ' . $abt_title . ' <em>' . $abt_journal_name . '.</em> ' . $abt_pub_year . '.' );
		
		} elseif ( $abt_issue == '' || is_null($abt_issue) ) {
		
			return( $abt_authors . ' ' . $abt_title . ' <em>' . $abt_journal_name . '.</em> ' . $abt_pub_year . '; ' . $abt_volume . ': ' . $abt_pages . '.' );
		
		} else {

			return( $abt_authors . ' ' . $abt_title . ' <em>' . $abt_journal_name . '.</em> ' . $abt_pub_year . '; ' . $abt_volume . '(' . $abt_issue . '): ' . $abt_pages . '.' );

		}
	
}
add_shortcode( 'ref', 'ref_id_parser' );
