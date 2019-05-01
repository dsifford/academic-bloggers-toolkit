import { withSelect } from '@wordpress/data';

import StyleSearch, { OwnProps, SelectProps } from 'components/style-search';

export default withSelect<SelectProps, OwnProps>(select => ({
    styleJSON: select('abt/data').getCitationStyles(),
}))(StyleSearch);
