jest.unmock('../PanelButton');

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
    it('should create and destroy tooltips', () => {
        const { button } = setup();
        button.simulate('mouseover');

        let tip = document.querySelector('.mce-tooltip-inner');
        expect(tip.innerHTML).toBe('test');

        button.simulate('mouseleave');
        expect(document.getElementById('abt-reflist-tooltip')).toBe(null);
    });

    it('should destroy an existing tooltip on initial mount', () => {
        const tip = document.createElement('DIV');
        tip.id = 'abt-reflist-tooltip';
        document.body.appendChild(tip);

        expect(document.getElementById('abt-reflist-tooltip')).toBeTruthy();
        setup();
        expect(document.getElementById('abt-reflist-tooltip')).toBe(null);
    });

    it('should render disabled', () => {
        const { button } = setup('test', true);
        expect(button.hasClass('disabled')).toBe(true);
    });

    it('should render with no tooltips', () => {
        const { button } = setup(null);
        button.simulate('mouseover');

        let tip = document.querySelector('.mce-tooltip-inner');
        expect(tip).toBe(null);
    });
});
