require('ts-node/register');
const { ABT_i18n, ABT_Reflist_State, ABT_wp } = require('./fixtures.ts');
const styles = require('../src/vendor/citation-styles.json');
window['ABT_i18n'] = ABT_i18n;
(<any>window)['ABT_Reflist_State'] = ABT_Reflist_State;
(<any>window)['ABT_wp'] = ABT_wp;
(<any>window)['ABT_CitationStyles'] = styles;
