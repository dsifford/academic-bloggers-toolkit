import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import { ComponentType } from '@wordpress/element';

import StyleSearch from 'components/style-search';

export default compose([
    withSelect<StyleSearch.SelectProps>(select => ({
        styleJSON: select('abt/data').getCitationStyles(),
    })),
])(StyleSearch) as ComponentType<StyleSearch.OwnProps>;
