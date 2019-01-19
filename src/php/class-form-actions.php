<?php
/**
 * Form actions.
 *
 * @package ABT
 */

namespace ABT;

defined( 'ABSPATH' ) || exit;

/**
 * Form actions used throughout the plugin.
 */
abstract class Form_Actions {
	const SET_CITATION_STYLE      = 'abt-form-set-citation-style';
	const SET_LEGACY_EDITOR_STATE = 'abt-form-set-legacy-editor-state';
}
