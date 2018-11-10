import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import React from 'react';

import Store from '_legacy/stores/ui/add-dialog';
import IdentifierInput from '..';

const setup = () => {
    const store = new Store('webpage');
    const fieldRef = jest.fn();
    const component = shallow(
        <IdentifierInput store={store} fieldRef={fieldRef} />,
    );
    return {
        component,
    };
};

describe('<IdentifierInput />', () => {
    const BASELINE = toJSON(setup().component);
    it('should match baseline snapshot', () => {
        expect(BASELINE).toMatchSnapshot();
    });
    it('should update input on change', () => {
        const { component } = setup();
        const input = component.find('input');
        input.simulate('change', { currentTarget: { value: 'testing' } });
        expect(toJSON(component)).toMatchDiffSnapshot(BASELINE);
    });
});
