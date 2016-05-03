jest.unmock('../Card');

import * as React from 'react';
import { mount } from 'enzyme';
import * as sinon from 'sinon';
import { Card } from '../Card';

const setup = (
    num: number,
    selected: number[]
) => {
    const spy = sinon.spy();
    const component = mount(
        <Card
            dragStart={spy}
            dragOver={spy}
            dragLeave={spy}
            onClick={spy}
            drop={spy}
            num={num}
            html={`<h1>Hello World</h1>`}
            isSelected={selected} />
    );
    return {
        component,
        spy,
    }
}

describe('<Card />', () => {
    it('should render as selected when index is in "selected"', () => {
        const { component } = setup(1, [1]);
        const style = {
            borderBottom: '1px solid #E5E5E5',
            padding: 5,
            cursor: 'pointer',
            backgroundColor: 'rgba(243, 255, 62, 0.2)',
            textShadow: '0px 0px 0.1px'
        }
        expect(component.find('.abt-card').props().style).toEqual(style);
    });
    it('should render as unselected when index not in "selected"', () => {
        const { component } = setup(3, [1]);
        const style = {
            borderBottom: '1px solid #E5E5E5',
            padding: 5,
            cursor: 'pointer',
        }
        expect(component.find('.abt-card').props().style).toEqual(style);
    });
});
