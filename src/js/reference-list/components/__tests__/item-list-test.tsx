import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { observable } from 'mobx';
import * as React from 'react';
import ItemList, { Items } from '../item-list';

interface MockItems {
    items?: CSL.Data[];
    CSL: any;
}
const createItems = (numItems: number): MockItems => {
    if (numItems === -1) {
        return {
            CSL: [],
        };
    }
    const items = Array(numItems).fill(0).map((_, i) => ({
        id: `${i + 1}`,
        title: `Test item ${i + 1}`,
    }));
    return {
        items,
        CSL: items.map(item => [item.id, item]),
    };
};
const UI = {
    cited: {
        maxHeight: observable('300px'),
        isOpen: observable(true),
    },
    uncited: {
        maxHeight: observable('300px'),
        isOpen: observable(false),
    },
};
const selected = observable<string>([]);
const CSLMap = observable.map<CSL.Data>();
const onEditReference = jest.fn();

const setupItemList = (numItems = 3, selectedNum: string[] = []) => {
    const { CSL, items } = createItems(numItems);
    selected.replace(selectedNum);
    CSLMap.replace(CSL);
    const component = shallow(
        <ItemList
            items={items}
            id="cited"
            ui={UI}
            selectedItems={selected}
            CSL={CSLMap}
            onEditReference={onEditReference}
        >
            Hello World
        </ItemList>,
    );
    return {
        component,
        instance: component.instance() as ItemList,
    };
};

const setupItems = (numItems = 3, selectedNum: string[] = [], withTooltip: boolean = true) => {
    const { items, CSL } = createItems(numItems);
    selected.replace(selectedNum);
    CSLMap.replace(CSL);
    const component = shallow(
        <Items
            items={items!}
            CSL={CSL}
            selectedItems={selected}
            withTooltip={withTooltip}
            onEditReference={onEditReference}
        />,
    );
    return {
        component,
        instance: component.instance() as Items,
    };
};

describe('<ItemList />', () => {
    const setup = setupItemList;
    beforeEach(() => {
        UI.cited.maxHeight.set('300px');
        UI.cited.isOpen.set(true);
        UI.uncited.maxHeight.set('300px');
        UI.uncited.isOpen.set(false);
        jest.resetAllMocks();
    });
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
        const { component } = setup();
        expect(UI.cited.isOpen.get()).toBeTruthy();
        component.find('.abt-item-heading').simulate('click');
        expect(UI.cited.isOpen.get()).toBeFalsy();
    });
    it('should handle double click', () => {
        const { component } = setup();
        UI.uncited.isOpen.set(true);
        expect(UI.cited.isOpen.get()).toBeTruthy();
        expect(UI.uncited.isOpen.get()).toBeTruthy();
        component.find('.abt-item-heading').simulate('doubleClick');
        expect(UI.cited.isOpen.get()).toBeTruthy();
        expect(UI.uncited.isOpen.get()).toBeFalsy();
    });
    it('shuold handle item click', () => {
        const { component } = setup(3, ['2']);
        const items = component.find('Items');
        expect(selected.slice()).toEqual(['2']);

        items.simulate('click', { currentTarget: { id: '1' } });
        expect(selected.slice()).toEqual(['2', '1']);

        items.simulate('click', { currentTarget: { id: '2' } });
        expect(selected.slice()).toEqual(['1']);
    });
});

describe('<Items />', () => {
    const setup = setupItems;
    it('should match snapshot', () => {
        let { component } = setup();
        expect(toJSON(component)).toMatchSnapshot();

        ({ component } = setup(3, ['1']));
        expect(toJSON(component)).toMatchSnapshot();
    });
    it('should trigger edit reference on double click', () => {
        const { component } = setup();
        expect(onEditReference).not.toHaveBeenCalled();
        component.find('Card').first().simulate('doubleClick', { currentTarget: { id: '2' } });
        expect(onEditReference).toHaveBeenCalled();
        expect(onEditReference).toBeCalledWith('2');
    });
    describe('scroll handler tests', () => {
        const stopPropagation = jest.fn();
        const preventDefault = jest.fn();
        function makeEvent(
            {
                deltaY = 0,
                offsetHeight = 250,
                scrollHeight = 500,
                scrollTop = 0,
            }: { [k: string]: number } = {},
        ) {
            return {
                deltaY,
                currentTarget: {
                    offsetHeight,
                    scrollHeight,
                    scrollTop,
                },
                preventDefault,
                stopPropagation,
            };
        }
        beforeEach(() => jest.resetAllMocks());
        test('at top & scrolling up', () => {
            const { component } = setup();
            component.simulate('wheel', makeEvent({ deltaY: -5 }));
            expect(stopPropagation).toHaveBeenCalledTimes(1);
            expect(preventDefault).toHaveBeenCalledTimes(1);
        });
        test('at bottom & scrolling down', () => {
            const { component } = setup();
            component.simulate('wheel', makeEvent({ deltaY: 5, scrollTop: 250 }));
            expect(stopPropagation).toHaveBeenCalledTimes(1);
            expect(preventDefault).toHaveBeenCalledTimes(1);
        });
        test('at bottom & scrolling up', () => {
            const { component } = setup();
            component.simulate('wheel', makeEvent({ deltaY: -5, scrollTop: 250 }));
            expect(stopPropagation).toHaveBeenCalledTimes(1);
            expect(preventDefault).not.toHaveBeenCalled();
        });
        test('at top & scrolling down', () => {
            const { component } = setup();
            component.simulate('wheel', makeEvent({ deltaY: 5 }));
            expect(stopPropagation).toHaveBeenCalledTimes(1);
            expect(preventDefault).not.toHaveBeenCalled();
        });
        test('in middle & scrolling', () => {
            const { component } = setup();
            component.simulate('wheel', makeEvent({ deltaY: -5, scrollTop: 50 }));
            component.simulate('wheel', makeEvent({ deltaY: 5, scrollTop: 50 }));
            expect(stopPropagation).toHaveBeenCalledTimes(2);
            expect(preventDefault).not.toHaveBeenCalled();
        });
    });
});
