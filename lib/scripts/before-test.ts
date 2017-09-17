require('ts-node/register');
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
