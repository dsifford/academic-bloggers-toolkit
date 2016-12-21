import * as React from 'react';
import { mount } from 'enzyme';
import { ToggleSwitch } from '../ToggleSwitch';

const setup = (checked = false) => {
    const spy = jest.fn();
    const component = mount((
        <ToggleSwitch
            checked={checked}
            label="Test Label"
            onChange={spy}
        />
    ));
    return {
        component,
        input: component.find('input'),
        label: component.find('label'),
        spy,
    };
};

describe('<ToggleSwitch />', () => {
    it('should render unchecked', () => {
        const { component } = setup();
        expect(component.find('#inline-toggle').props().checked).toBe(false);
    });
    it('should render checked', () => {
        const { component } = setup(true);
        expect(component.find('#inline-toggle').props().checked).toBe(true);
    });
    it('should create and destroy tooltips on mouseover/mouseout', () => {
        const { label } = setup();
        expect(document.getElementById('abt-tooltip')).toBeNull();
        label.simulate('mouseover');
        expect(document.getElementById('abt-tooltip').innerText).toBe('Test Label');
        label.simulate('mouseout');
        expect(document.getElementById('abt-tooltip')).toBeNull();
    });
    it('should call onChange function on click', () => {
        const { input, spy } = setup();
        expect(spy).not.toHaveBeenCalled();
        input.simulate('change');
        expect(spy).toHaveBeenCalled();
        input.simulate('change');
        input.simulate('change');
        expect(spy).toHaveBeenCalledTimes(3);
    });
});
