import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { observable } from 'mobx';
import React from 'react';

import UIStore from 'stores/ui/reference-list';
import ItemList from '..';

const createItems = (numItems: number) => {
    if (numItems === -1) {
        return {
            CSL: [],
            items: [],
        };
    }
    const items = Array(numItems)
        .fill(0)
        .map(
            (_, i) =>
                ({
                    id: `${i + 1}`,
                    type: 'article-journal',
                    title: `Test item ${i + 1}`,
                } as CSL.Data),
        );
    return {
        items,
        CSL: items.map(item => [item.id, item]),
    };
};
const CSLMap = observable.map<CSL.Data>();
const onEditReference = jest.fn();

const setup = (numItems = 3, selectedNum: string[] = []) => {
    const { CSL, items } = createItems(numItems);
    const ui = new UIStore(false);
    ui.selected.replace(selectedNum);
    CSLMap.replace(CSL);
    const component = shallow(
        <ItemList
            items={items}
            id="cited"
            ui={ui}
            CSL={CSLMap}
            onEditReference={onEditReference}
        >
            Hello World
        </ItemList>,
    );
    return {
        component,
        instance: component.instance() as ItemList,
        ui,
    };
};

describe('<ItemList />', () => {
    it('should match snapshot', () => {
        let { component } = setup();
        expect(toJSON(component)).toMatchSnapshot();

        ({ component } = setup(3, ['1']));
        expect(toJSON(component)).toMatchSnapshot();

        ({ component } = setup(-1));
        expect(component.isEmptyRender()).toBe(true);

        ({ component } = setup(0));
        expect(component.isEmptyRender()).toBe(true);
    });
    it('should handle click', () => {
        const { component, ui } = setup();
        expect(ui.cited.isOpen).toBeTruthy();
        component.find('.heading').simulate('click');
        expect(ui.cited.isOpen).toBeFalsy();
    });
    it('should handle double click', () => {
        const { component, ui } = setup();
        ui.uncited.isOpen = true;
        expect(ui.cited.isOpen).toBeTruthy();
        expect(ui.uncited.isOpen).toBeTruthy();
        component.find('.heading').simulate('doubleClick');
        expect(ui.cited.isOpen).toBeTruthy();
        expect(ui.uncited.isOpen).toBeFalsy();
    });
    it('should handle item click', () => {
        const { component, ui } = setup(3, ['2']);
        const items = component.find('Item').first();
        expect(ui.selected.slice()).toEqual(['2']);

        items.simulate('click', { currentTarget: { id: '1' } });
        expect(ui.selected.slice()).toEqual(['2', '1']);

        items.simulate('click', { currentTarget: { id: '2' } });
        expect(ui.selected.slice()).toEqual(['1']);
    });
    it('should handle shift-click selection', () => {
        const { component, ui } = setup(5, ['1']);
        const items = component.find('Item').at(4);
        expect(ui.selected.slice()).toEqual(['1']);

        items.simulate('click', { currentTarget: { id: '5' }, shiftKey: true });
        expect(ui.selected.slice()).toEqual(['1', '2', '3', '4', '5']);
    });
    it('should pass over previously selected items with shift-click', () => {
        const { component, ui } = setup(10, ['3', '5', '7', '9']);
        const items = component.find('Item').first();
        expect(ui.selected.slice()).toEqual(['3', '5', '7', '9']);

        items.simulate('click', { currentTarget: { id: '1' }, shiftKey: true });
        expect(ui.selected.slice().sort()).toEqual([
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
        ]);
    });
});
