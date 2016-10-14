jest.unmock('../ReferenceList');
jest.unmock('../../Store');

import * as React from 'react';
import { mount } from 'enzyme';
import { ReferenceList } from '../ReferenceList';
import { Store } from '../../Store';

const blankState = {
    CSL: {},
    bibOptions: {
        heading: '',
        style: 'fixed',
    },
    cache: {
        links: 'always',
        locale: 'en_US',
        style: 'american-medical-association',
    },
    citationByIndex: [],
};

const setup = () => {
    const store = new Store(blankState as BackendGlobals.ABT_Reflist_State);
    const component = mount(
        <ReferenceList store={store} />
    );
    return {
        component,
    };
};

describe('<ReferenceList />', () => {
    it('should render with loading spinner', () => {
        const { component } = setup();
        expect(component.find('Spinner').length).toBe(1);
    });
});
