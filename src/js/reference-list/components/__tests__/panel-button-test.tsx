import { mount } from 'enzyme';
import * as React from 'react';
import PanelButton from '../panel-button';

const setup = (tooltip?: string, disabled = false) => {
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
        const { button } = setup('test');
        expect(button.props().className).toBe(
            'abt-btn abt-btn_flat abt-btn_icon'
        );
        button.simulate('mouseEnter');
        button.simulate('mouseLeave');
    });
    it('should do nothing when no tooltips are defined', () => {
        const { button } = setup(undefined);
        button.simulate('mouseEnter');
        button.simulate('mouseLeave');
    });
    it('should render disabled', () => {
        const { button } = setup(undefined, true);
        expect(button.props().className).toBe(
            'abt-btn abt-btn_flat abt-btn_icon abt-btn_disabled'
        );
    });
});
