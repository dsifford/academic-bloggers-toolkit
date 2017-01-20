jest.mock('../../../utils/TinymceFunctions');
jest.mock('../../API');
import * as React from 'react';
import { observable } from 'mobx';
import { mount } from 'enzyme';
import { ItemList } from '../ItemList';
import { editReferenceWindow } from '../../../utils/TinymceFunctions';
import { parseManualData } from '../../API';

const ERW = editReferenceWindow as jest.Mock<any>;
const PMD = parseManualData as jest.Mock<any>;

const setup = (open = true, items = [{id: 'aaa'}, {id: 'bbb'}, {id: 'ccc'}]) => {
    const spy = jest.fn();
    const component = mount((
        <ItemList
            id="test-id"
            CSL={observable.map()}
            items={items}
            selectedItems={['aaa']}
            click={spy}
            toggle={spy}
            isOpen={open}
            maxHeight="300px"
        >
            Test List
        </ItemList>
    ));
    return {
        badge: component.find('.abt-item-heading__badge'),
        component,
        heading: component.find('.abt-item-heading'),
        label: component.find('.abt-item-heading__label'),
        spy,
    };
};

describe('<ItemList />', () => {
    beforeAll(() => {
        window.tinyMCE = {
            EditorManager: {
                get() {
                    return null;
                }
            }
        } as any;
    });
    beforeEach(() => {
        ERW.mockImplementation(() => new Promise(res => res()));
        PMD.mockImplementation(() => [{id: 'test-id', type: 'article-journal'}]);
    });
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
    it('should trigger editSingleReference on double click', () => {
        const { component } = setup();
        const card = component.find('Card').first();
        card.simulate('doubleClick');
    });
    it('should handle errors on submit', () => {
        ERW.mockImplementation(() => new Promise((_, __) => { throw new Error('Some unhandled error'); }));
        const { component } = setup();
        const card = component.find('Card').first();
        card.simulate('doubleClick');
    });
    it('should handle cases where user exits early', () => {
        ERW.mockImplementation(() => new Promise((_, rej) => rej()));
        const { component } = setup();
        const card = component.find('Card').first();
        card.simulate('doubleClick');
    });
});
