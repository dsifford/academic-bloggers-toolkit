require('ts-node/register');
import { configure } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import { i18n, state, wpInfo } from './fixtures';
const styles = require('../src/vendor/citation-styles.json');

configure({ adapter: new Adapter() });

class Storage {
    private items = new Map<string, string>();

    getItem(key: string): string | null {
        return this.items.get(key) || null;
    }

    setItem(key: string, value: string): void {
        this.items.set(key, value);
    }
}

Object.defineProperties(window, {
    ABT: {
        configurable: true,
        writable: true,
        value: {
            state,
            i18n,
            wp: wpInfo,
            styles,
            options: {
                citation_style: {
                    kind: 'predefined',
                    label: 'American Medical Association',
                    value: 'american-medical-association',
                },
            },
        },
    },
    StorageMock: {
        value: Storage,
    },
});
