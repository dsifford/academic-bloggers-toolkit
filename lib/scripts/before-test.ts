require('ts-node/register');
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

class Storage {
    private items = new Map<string, string>();

    getItem(key: string): string | null {
        return this.items.get(key) || null;
    }

    setItem(key: string, value: string): void {
        this.items.set(key, value);
    }
}

(<any>window).StorageMock = Storage;
