import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import * as React from 'react';

import ToggleSwitch from '..';

const changeFn = () => void 0;

describe('<ToggleSwitch />', () => {
    it('should match snapshots', () => {
        let component = shallow(
            <ToggleSwitch
                checked={false}
                tooltip={{ text: 'Test 1', position: 'left' }}
                onChange={changeFn}
            />,
        );
        expect(toJSON(component)).toMatchSnapshot();

        component = shallow(
            <ToggleSwitch
                checked={true}
                tooltip={{ text: 'Test 2', position: 'left' }}
                onChange={changeFn}
            />,
        );
        expect(toJSON(component)).toMatchSnapshot();
    });
    it('should create tooltip on mouseover', () => {
        const component = shallow(
            <ToggleSwitch
                checked={false}
                tooltip={{ text: 'Test 3', position: 'left' }}
                onChange={changeFn}
            />,
        );
        const toggle = component.find('span');
        const getBoundingClientRect = jest.fn().mockReturnValue({ top: 100, left: 100 });
        toggle.simulate('mouseOver', { currentTarget: { getBoundingClientRect } });
        toggle.simulate('mouseOut');
        expect(getBoundingClientRect).toHaveBeenCalled();
    });
});
