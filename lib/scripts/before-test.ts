require('ts-node/register');
// import { configure } from 'enzyme';
const { configure } = require('enzyme');
import * as Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

const { i18n, state, wpInfo } = require('../fixtures.ts');
const styles = require('../../src/vendor/citation-styles.json');
window.ABT = {
    state,
    i18n,
    wp: wpInfo,
    styles,
    custom_csl: {
        label: '',
    },
};
