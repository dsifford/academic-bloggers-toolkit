import { registerBlockType } from '@wordpress/blocks';
import { registerStore } from '@wordpress/data';
import { registerPlugin } from '@wordpress/plugins';
import { registerFormatType } from '@wordpress/rich-text';

import bibliographyBlock from 'gutenberg/blocks/bibliography';
import footnotesBlock from 'gutenberg/blocks/footnotes';
import staticBibliographyBlock from 'gutenberg/blocks/static-bibliography';

import citationFormat from 'gutenberg/formats/citation';
import footnoteFormat from 'gutenberg/formats/footnote';

import sidebarPlugin from 'gutenberg/sidebar';
import { dataStore, uiStore } from 'stores';

import 'css/_bibliography.scss?global';
import 'css/_footnotes.scss?global';

registerStore(...dataStore);
registerStore(...uiStore);

registerPlugin(...sidebarPlugin);

registerFormatType(...citationFormat);
registerFormatType(...footnoteFormat);

registerBlockType(...bibliographyBlock);
registerBlockType(...footnotesBlock);
registerBlockType(...staticBibliographyBlock);
