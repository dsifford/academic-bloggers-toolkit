import * as React from 'react';
import { mount } from 'enzyme';
import { PanelButton } from '../PanelButton';

const setup = (tooltip = 'test', disabled = false) => {
    const component = mount(
        <PanelButton data-tooltip={tooltip} disabled={disabled} />
    );
    return {
        component,
        button: component.find('a'),
    };
};

describe('<PanelButton/>', () => {
    it('should create tooltip on mouseover', () => {
        const { button } = setup();
        expect(button.props().className).toBe('abt-btn abt-btn_flat abt-btn_icon');
        button.simulate('mouseenter');
        button.simulate('mouseleave');
    });

    it('should do nothing when no tooltips are defined', () => {
        const { button } = setup(null);
        button.simulate('mouseover');
        button.simulate('mouseleave');
    });

    it('should render disabled', () => {
        const { button } = setup(null, true);
        expect(button.props().className).toBe('abt-btn abt-btn_flat abt-btn_icon abt-btn_disabled');
    });
});
