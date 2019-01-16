import { registerFormatType } from '@wordpress/rich-text';

import citationFormat from './citation';
import footnoteFormat from './footnote';

registerFormatType(...citationFormat);
registerFormatType(...footnoteFormat);
