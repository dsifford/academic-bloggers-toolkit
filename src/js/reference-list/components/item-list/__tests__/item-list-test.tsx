import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { observable } from 'mobx';
import * as React from 'react';

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
        <ItemList items={items} id="cited" ui={ui} CSL={CSLMap} onEditReference={onEditReference}>
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
        expect(ui.selected.slice().sort()).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9']);
    });
});

// FIXME:
// describe('<Items />', () => {
//     const setup = setupItems;
//     it('should match snapshot', () => {
//         let { component } = setup();
//         expect(toJSON(component)).toMatchSnapshot();

//         ({ component } = setup(3, ['1']));
//         expect(toJSON(component)).toMatchSnapshot();
//     });
//     it('should trigger edit reference on double click', () => {
//         const { component } = setup();
//         expect(onEditReference).not.toHaveBeenCalled();
//         component
//             .find('Card')
//             .first()
//             .simulate('doubleClick', { currentTarget: { id: '2' } });
//         expect(onEditReference).toHaveBeenCalled();
//         expect(onEditReference).toBeCalledWith('2');
//     });
//     describe('scroll handler tests', () => {
//         const stopPropagation = jest.fn();
//         const preventDefault = jest.fn();
//         function makeEvent({
//             deltaY = 0,
//             offsetHeight = 250,
//             scrollHeight = 500,
//             scrollTop = 0,
//         }: { [k: string]: number } = {}) {
//             return {
//                 deltaY,
//                 currentTarget: {
//                     offsetHeight,
//                     scrollHeight,
//                     scrollTop,
//                 },
//                 preventDefault,
//                 stopPropagation,
//             };
//         }
//         beforeEach(() => jest.resetAllMocks());
//         test('at top & scrolling up', () => {
//             const { component } = setup();
//             component.simulate('wheel', makeEvent({ deltaY: -5 }));
//             expect(stopPropagation).toHaveBeenCalledTimes(1);
//             expect(preventDefault).toHaveBeenCalledTimes(1);
//         });
//         test('at bottom & scrolling down', () => {
//             const { component } = setup();
//             component.simulate('wheel', makeEvent({ deltaY: 5, scrollTop: 250 }));
//             expect(stopPropagation).toHaveBeenCalledTimes(1);
//             expect(preventDefault).toHaveBeenCalledTimes(1);
//         });
//         test('at bottom & scrolling up', () => {
//             const { component } = setup();
//             component.simulate('wheel', makeEvent({ deltaY: -5, scrollTop: 250 }));
//             expect(stopPropagation).toHaveBeenCalledTimes(1);
//             expect(preventDefault).not.toHaveBeenCalled();
//         });
//         test('at top & scrolling down', () => {
//             const { component } = setup();
//             component.simulate('wheel', makeEvent({ deltaY: 5 }));
//             expect(stopPropagation).toHaveBeenCalledTimes(1);
//             expect(preventDefault).not.toHaveBeenCalled();
//         });
//         test('in middle & scrolling', () => {
//             const { component } = setup();
//             component.simulate('wheel', makeEvent({ deltaY: -5, scrollTop: 50 }));
//             component.simulate('wheel', makeEvent({ deltaY: 5, scrollTop: 50 }));
//             expect(stopPropagation).toHaveBeenCalledTimes(2);
//             expect(preventDefault).not.toHaveBeenCalled();
//         });
//     });
// });
