jest.unmock('../Card');

import * as React from 'react';
import { mount, } from 'enzyme';
import * as sinon from 'sinon';
import { Card, } from '../Card';

const setup = (
    selected: boolean
) => {
    const spy = sinon.spy();
    const component = mount(
        <Card
            onClick={spy}
            html={`<h1>Hello World</h1>`}
            isSelected={selected} />
    );
    return {
        component,
        spy,
    };
};

describe('<Card />', () => {
    it('should render as selected when index is in "selected"', () => {
        const { component, } = setup(true);
        expect(component.find('.abt-card').props().className).toEqual('abt-card selected');
    });
    it('should render as unselected when index not in "selected"', () => {
        const { component, } = setup(false);
        expect(component.find('.abt-card').props().className).toEqual('abt-card');
    });
});
