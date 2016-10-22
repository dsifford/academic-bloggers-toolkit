import * as React from 'react';
import { mount } from 'enzyme';
import { ItemList } from '../ItemList';

const setup = (open = true, items = [{id: 'aaa'}, {id: 'bbb'}, {id: 'ccc'}]) => {
    const spy = jest.fn();
    const component = mount(
        <ItemList
            id="test-id"
            items={items}
            selectedItems={['aaa']}
            click={spy}
            toggle={spy}
            isOpen={open}
            maxHeight="300px"
        >
            Test List
        </ItemList>
    );
    return {
        badge: component.find('.abt-item-heading__badge'),
        component,
        heading: component.find('.abt-item-heading'),
        label: component.find('.abt-item-heading__label'),
        spy,
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
        const { heading, spy } = setup();
        expect(spy).toHaveBeenCalledTimes(0);
        heading.simulate('click');
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith('test-id');
        heading.simulate('doubleClick');
        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy.mock.calls[1]).toEqual(['test-id', true]);
    });
});
