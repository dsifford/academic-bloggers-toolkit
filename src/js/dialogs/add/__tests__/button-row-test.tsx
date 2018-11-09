import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import React from 'react';

import Store from 'stores/ui/add-dialog';
import ButtonRow from '../button-row';

const setup = () => {
    const store = new Store('webpage');
    const onSearchPubmedClick = jest.fn();
    const component = shallow(
        <ButtonRow store={store} onSearchPubmedClick={onSearchPubmedClick} />,
    );
    return {
        component,
        instance: component.instance() as ButtonRow,
        onSearchPubmedClick,
    };
};

describe('<ButtonRow />', () => {
    const BASELINE = toJSON(setup().component);
    it('should match baseline snapshots', () => {
        expect(BASELINE).toMatchSnapshot();
    });
    it('should toggle add manually', () => {
        const { component } = setup();
        const button = component.find('Button').first();
        button.simulate('click');
        expect(toJSON(component)).toMatchDiffSnapshot(BASELINE);
    });
    it('should toggle attach inline', () => {
        const { component } = setup();
        const toggle = component.find('ToggleSwitch');
        toggle.simulate('change');
        expect(toJSON(component)).toMatchDiffSnapshot(BASELINE);
    });
});
