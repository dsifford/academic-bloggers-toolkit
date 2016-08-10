jest.unmock('../ItemList');

import * as React from 'react';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import { ItemList } from '../ItemList';

const setup = (open = true, items = [{id: 'aaa'}, {id: 'bbb'}, {id: 'ccc'}]) => {
    const s = spy();
    const component = mount(
        <ItemList
            id="test-id"
            items={items}
            selectedItems={['aaa']}
            click={s}
            toggle={s}
            isOpen={open}
            maxHeight="300px"
        >
            Test List
        </ItemList>
    );
    return {
        badge: component.find('.badge'),
        component,
        groupLabel: component.find('.group-label'),
        label: component.find('.label'),
        s,
    };
};

describe('<ItemList />', () => {
    it('should not render with no items', () => {
        const { component } = setup(true, null);
        expect(component.isEmptyRender()).toBe(true);
    });

    it('should render with the correct label', () => {
        const { label } = setup();
        expect(label.text()).toBe('Test List');
    });

    it('should render with three items', () => {
        const { badge } = setup();
        expect(badge.text()).toBe('3');
    });

    it('should handle single clicks', () => {
        const { groupLabel, s } = setup();
        expect(s.callCount).toBe(0);
        groupLabel.simulate('click');
        expect(s.callCount).toBe(1);
        expect(s.calledWithExactly('test-id')).toBe(true);
        groupLabel.simulate('doubleClick');
        expect(s.callCount).toBe(2);
        expect(s.secondCall.calledWithExactly('test-id', true)).toBe(true);
    });
});
