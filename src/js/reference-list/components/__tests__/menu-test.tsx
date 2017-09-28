import { mount, shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { observable } from 'mobx';
import * as React from 'react';
import Menu, { dynamicOptionHeightHandler, renderer as Renderer } from '../menu';

const styles = {
    renamed: {},
    styles: [
        {
            label: 'American Medical Association',
            value: 'american-medical-association',
            id: 'american-medical-association',
        },
        { label: 'APA 5th Edition', value: 'apa-5th', id: 'apa-5th' },
    ],
};

const custom_csl = {
    CSL: '',
    label: 'Test Label',
    value: 'test-value',
};

const setupMenu = (isOpen: boolean = true) => {
    const spy = jest.fn();
    const component = mount(
        <Menu
            isOpen={observable(isOpen)}
            cslStyle={observable('american-medical-association')}
            itemsSelected={true}
            onSubmit={spy}
        />,
    );
    return {
        component,
        instance: component.instance() as Menu,
        importBtn: component.find('button#OPEN_IMPORT_DIALOG'),
        spy,
    };
};

const setupRenderer = (label: string, value = 'test', focusedOption = false) => {
    const option = { label, value };
    const focus = jest.fn();
    const select = jest.fn();
    const component = shallow(
        <Renderer
            style={{}}
            focusOption={focus}
            focusedOption={focusedOption === true ? option : {}}
            option={option}
            selectValue={select}
        />,
    );
    return {
        component,
        focus,
        select,
    };
};

describe('<Menu />', () => {
    const setup = setupMenu;
    beforeEach(() => {
        window.ABT = {
            ...window.ABT,
            styles,
            custom_csl,
        };
        jest.resetAllMocks();
    });
    it('should match snapshots', () => {
        let { component } = setup();
        expect(toJSON(component)).toMatchSnapshot();

        ({ component } = setup(false));
        expect(toJSON(component)).toMatchSnapshot();
    });
    it('should handle basic interactions', () => {
        const { component, importBtn, spy } = setup();
        expect(spy).toHaveBeenCalledTimes(0);
        importBtn.simulate('click');
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith({ kind: 'OPEN_IMPORT_DIALOG' });
        (component.instance() as any).handleSelect({
            label: 'APA 5th Edition',
            value: 'apa-5th',
            id: 'apa-5th',
        });
        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy.mock.calls[1]).toEqual([{ data: 'apa-5th', kind: 'CHANGE_STYLE' }]);
    });
    it('should handle empty data', () => {
        const { component, importBtn, spy } = setup();
        expect(spy).toHaveBeenCalledTimes(0);
        importBtn.simulate('click');
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith({ kind: 'OPEN_IMPORT_DIALOG' });
        (component.instance() as any).handleSelect([]);
        expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should work without custom CSL defined', () => {
        window.ABT.custom_csl = { value: undefined, label: '' };
        const { instance } = setup();
        expect(instance.styles).toEqual(styles.styles);
    });
    it('should have functioning static methods', () => {
        expect(Menu.willEnter()).toEqual({ height: 0, scale: 0 });
        expect(Menu.willLeave()).toEqual({
            height: { damping: 25, precision: 0.01, stiffness: 300, val: 0 },
            scale: { damping: 25, precision: 0.01, stiffness: 300, val: 0 },
        });
    });
});
describe('dynamicOptionHeightHandler()', () => {
    it('should render the appropriate heights', () => {
        expect(dynamicOptionHeightHandler({ option: { label: 'aaa', value: '', id: 'a' } })).toBe(
            30,
        );
        expect(
            dynamicOptionHeightHandler({ option: { label: 'a'.repeat(35), value: '', id: 'a' } }),
        ).toBe(30);
        expect(
            dynamicOptionHeightHandler({ option: { label: 'a'.repeat(36), value: '', id: 'a' } }),
        ).toBe(40);
        expect(
            dynamicOptionHeightHandler({ option: { label: 'a'.repeat(65), value: '', id: 'a' } }),
        ).toBe(40);
        expect(
            dynamicOptionHeightHandler({ option: { label: 'a'.repeat(66), value: '', id: 'a' } }),
        ).toBe(50);
        expect(
            dynamicOptionHeightHandler({ option: { label: 'a'.repeat(80), value: '', id: 'a' } }),
        ).toBe(50);
        expect(
            dynamicOptionHeightHandler({ option: { label: 'a'.repeat(81), value: '', id: 'a' } }),
        ).toBe(60);
        expect(
            dynamicOptionHeightHandler({ option: { label: 'a'.repeat(90), value: '', id: 'a' } }),
        ).toBe(60);
        expect(
            dynamicOptionHeightHandler({ option: { label: 'a'.repeat(91), value: '', id: 'a' } }),
        ).toBe(70);
        expect(
            dynamicOptionHeightHandler({ option: { label: 'a'.repeat(110), value: '', id: 'a' } }),
        ).toBe(70);
        expect(
            dynamicOptionHeightHandler({ option: { label: 'a'.repeat(111), value: '', id: 'a' } }),
        ).toBe(90);
        expect(
            dynamicOptionHeightHandler({ option: { label: 'a'.repeat(250), value: '', id: 'a' } }),
        ).toBe(90);
    });
});
describe('Menu Renderer', () => {
    const setup = setupRenderer;
    it('should render options with the correct heights', () => {
        let { component } = setup('a');
        expect(component.props().style.height).toBe(30);
        ({ component } = setup('a'.repeat(35)));
        expect(component.props().style.height).toBe(30);
        ({ component } = setup('a'.repeat(36)));
        expect(component.props().style.height).toBe(40);
        ({ component } = setup('a'.repeat(65)));
        expect(component.props().style.height).toBe(40);
        ({ component } = setup('a'.repeat(66)));
        expect(component.props().style.height).toBe(50);
        ({ component } = setup('a'.repeat(80)));
        expect(component.props().style.height).toBe(50);
        ({ component } = setup('a'.repeat(81)));
        expect(component.props().style.height).toBe(60);
        ({ component } = setup('a'.repeat(90)));
        expect(component.props().style.height).toBe(60);
        ({ component } = setup('a'.repeat(91)));
        expect(component.props().style.height).toBe(70);
        ({ component } = setup('a'.repeat(110)));
        expect(component.props().style.height).toBe(70);
        ({ component } = setup('a'.repeat(111)));
        expect(component.props().style.height).toBe(90);
        ({ component } = setup('a'.repeat(250)));
        expect(component.props().style.height).toBe(90);
    });
    it('should render the header row correctly', () => {
        const { component } = setup('label', 'header');
        const style: React.CSSProperties = {
            alignItems: 'center',
            backgroundColor: '#eee',
            borderBottom: '1px solid #ddd',
            cursor: 'default',
            display: 'flex',
            fontWeight: 400,
            height: 30,
            padding: '0 5px',
        };
        expect(component.props().style).toEqual(style);
    });
    it('should render with darker background when focused', () => {
        const { component } = setup('test', 'test', true);
        expect(component.props().style.backgroundColor).toBe('#f5f5f5');
    });
    it('should call the select handler when clicked', () => {
        const { component, select } = setup('test');
        expect(select).toHaveBeenCalledTimes(0);
        component.simulate('click');
        expect(select).toHaveBeenCalledTimes(1);
        expect(select.mock.calls[0]).toEqual([{ label: 'test', value: 'test' }]);
    });
    it('should call the focus handler when focused', () => {
        const { component, focus } = setup('test label');
        expect(focus).toHaveBeenCalledTimes(0);
        component.simulate('mouseOver');
        expect(focus).toHaveBeenCalledTimes(1);
        expect(focus.mock.calls[0]).toEqual([{ label: 'test label', value: 'test' }]);
    });
});
