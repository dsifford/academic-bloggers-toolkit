import { registerBlockType } from '@wordpress/blocks';

import 'css/_bibliography.scss?global';
import 'css/_footnotes.scss?global';

import bibliographyBlock from './bibliography';
import footnotesBlock from './footnotes';
import staticBibliographyBlock from './static-bibliography';

registerBlockType(...bibliographyBlock);
registerBlockType(...footnotesBlock);
registerBlockType(...staticBibliographyBlock);
