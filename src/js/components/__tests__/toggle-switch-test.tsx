jest.mock('utils/tooltips');

import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { observable } from 'mobx';
import * as React from 'react';

import { createTooltip, destroyTooltip } from 'utils/tooltips';
import ToggleSwitch from '../toggle-switch';

const changeFn = () => void 0;

describe('<ToggleSwitch />', () => {
    it('should match snapshots', () => {
        const checked = observable(false);
        let component = shallow(
            <ToggleSwitch checked={checked} label="Test 1" onChange={changeFn} />,
        );
        expect(toJSON(component)).toMatchSnapshot();

        checked.set(true);
        component = shallow(<ToggleSwitch checked={checked} label="Test 2" onChange={changeFn} />);
        expect(toJSON(component)).toMatchSnapshot();
    });
    it('should create tooltip on mouseover', () => {
        const component = shallow(
            <ToggleSwitch checked={observable(false)} label="Test 3" onChange={changeFn} />,
        );
        const label = component.find('label');
        expect(createTooltip).not.toHaveBeenCalled();
        expect(destroyTooltip).not.toHaveBeenCalled();
        label.simulate('mouseOver', { currentTarget: { dataset: { tooltip: 'test' } } });
        label.simulate('mouseOut');
        expect(createTooltip).toHaveBeenCalledTimes(1);
        expect(destroyTooltip).toHaveBeenCalledTimes(1);
    });
});
