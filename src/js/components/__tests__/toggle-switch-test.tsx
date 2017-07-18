jest.mock('../../utils/tooltips');
import { shallow } from 'enzyme';
import { observable } from 'mobx';
import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ToggleSwitch from '../toggle-switch';

import { createTooltip, destroyTooltip } from '../../utils/tooltips';

const changeFn = () => void 0;

describe('<ToggleSwitch />', () => {
    it('should match snapshots', () => {
        const checked = observable(false);
        let component = renderer.create(
            <ToggleSwitch checked={checked} label="Test 1" onChange={changeFn} />
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        checked.set(true);
        component = renderer.create(
            <ToggleSwitch checked={checked} label="Test 2" onChange={changeFn} />
        );
        tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
    it('should create tooltip on mouseover', () => {
        const component = shallow(
            <ToggleSwitch checked={observable(false)} label="Test 3" onChange={changeFn} />
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
