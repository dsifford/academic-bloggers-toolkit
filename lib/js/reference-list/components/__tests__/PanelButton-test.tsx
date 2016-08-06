jest.unmock('../PanelButton');

import * as React from 'react';
import { mount } from 'enzyme';
import { PanelButton } from '../PanelButton';

const setup = () => {
    const component = mount(
        <PanelButton data-tooltip="test" />
    );
    return {
        component,
        button: component.find('button'),
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
});
