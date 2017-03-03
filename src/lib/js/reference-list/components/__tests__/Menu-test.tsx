import { mount, shallow } from 'enzyme';
import * as React from 'react';
import { Menu, renderer as Renderer } from '../Menu';

const ABT_CitationStyles = [
    {label: 'American Medical Association', value: 'american-medical-association'},
    {label: 'APA 5th Edition', value: 'apa-5th'},
];

const ABT_i18n = {
    referenceList: {
        menu: {
            stylePlaceholder: 'Choose citation style...',
            tooltips: {
                destroy: 'Delete all references',
                help: 'View usage instructions',
                import: 'Import references from file',
                refresh: 'Refresh reference list',
            },
        },
    },
};

const ABT_Custom_CSL = {
    CSL: '',
    label: 'Test Label',
    value: 'test-value',
};

window['ABT_CitationStyles'] = ABT_CitationStyles;
window['ABT_i18n'] = ABT_i18n as any;
window['ABT_Custom_CSL'] = ABT_Custom_CSL;

const setup = () => {
    const spy = jest.fn();
    const component = mount((
        <Menu
            isOpen={true}
            cslStyle="american-medical-association"
            itemsSelected={true}
            submitData={spy}
        />
    ));
    return {
        component,
        importBtn: component.find('#IMPORT_RIS'),
        spy,
    };
};

const setupRenderer = (label: string, value = 'test', focusedOption = false) => {
    const option = {label, value};
    const focus = jest.fn();
    const select = jest.fn();
    const component = shallow((
        <Renderer
            style={{}}
            focusOption={focus}
            focusedOption={focusedOption === true ? option : {}}
            option={option}
            selectValue={select}
        />
    ));
    return {
        component,
        focus,
        select,
    };
};

describe('<Menu />', () => {
    it('should handle basic interactions', () => {
        const { component, importBtn, spy } = setup();
        expect(spy).toHaveBeenCalledTimes(0);
        importBtn.simulate('click');
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith('IMPORT_RIS');
        (component.instance() as any).handleSelect({label: 'APA 5th Edition', value: 'apa-5th'});
        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy.mock.calls[1]).toEqual(['CHANGE_STYLE', 'apa-5th']);
    });
    it('should render the appropriate heights', () => {
        window['ABT_Custom_CSL'].value = null;
        const { component } = setup();
        const inst = component.instance() as any;
        const handler = inst.dynamicOptionHeightHandler;
        expect(handler({option: {label: 'aaa'}})).toBe(30);
        expect(handler({option: {label: 'a'.repeat(35)}})).toBe(30);
        expect(handler({option: {label: 'a'.repeat(36)}})).toBe(40);
        expect(handler({option: {label: 'a'.repeat(65)}})).toBe(40);
        expect(handler({option: {label: 'a'.repeat(66)}})).toBe(50);
        expect(handler({option: {label: 'a'.repeat(80)}})).toBe(50);
        expect(handler({option: {label: 'a'.repeat(81)}})).toBe(60);
        expect(handler({option: {label: 'a'.repeat(90)}})).toBe(60);
        expect(handler({option: {label: 'a'.repeat(91)}})).toBe(70);
        expect(handler({option: {label: 'a'.repeat(110)}})).toBe(70);
        expect(handler({option: {label: 'a'.repeat(111)}})).toBe(90);
        expect(handler({option: {label: 'a'.repeat(250)}})).toBe(90);
    });
});
describe('Menu Renderer', () => {
    it('should render options with the correct heights', () => {
        let { component } = setupRenderer('a');
        expect(component.props().style.height).toBe(30);
        ({ component } = setupRenderer('a'.repeat(35)));
        expect(component.props().style.height).toBe(30);
        ({ component } = setupRenderer('a'.repeat(36)));
        expect(component.props().style.height).toBe(40);
        ({ component } = setupRenderer('a'.repeat(65)));
        expect(component.props().style.height).toBe(40);
        ({ component } = setupRenderer('a'.repeat(66)));
        expect(component.props().style.height).toBe(50);
        ({ component } = setupRenderer('a'.repeat(80)));
        expect(component.props().style.height).toBe(50);
        ({ component } = setupRenderer('a'.repeat(81)));
        expect(component.props().style.height).toBe(60);
        ({ component } = setupRenderer('a'.repeat(90)));
        expect(component.props().style.height).toBe(60);
        ({ component } = setupRenderer('a'.repeat(91)));
        expect(component.props().style.height).toBe(70);
        ({ component } = setupRenderer('a'.repeat(110)));
        expect(component.props().style.height).toBe(70);
        ({ component } = setupRenderer('a'.repeat(111)));
        expect(component.props().style.height).toBe(90);
        ({ component } = setupRenderer('a'.repeat(250)));
        expect(component.props().style.height).toBe(90);
    });
    it('should render the header row correctly', () => {
        const { component } = setupRenderer('label', 'header');
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
        const { component } = setupRenderer('test', 'test', true);
        expect(component.props().style.backgroundColor).toBe('#f5f5f5');
    });
    it('should call the select handler when clicked', () => {
        const { component, select } = setupRenderer('test');
        expect(select).toHaveBeenCalledTimes(0);
        component.simulate('click');
        expect(select).toHaveBeenCalledTimes(1);
        expect(select.mock.calls[0]).toEqual([{label: 'test', value: 'test'}]);
    });
    it('should call the focus handler when focused', () => {
        const { component, focus } = setupRenderer('test label');
        expect(focus).toHaveBeenCalledTimes(0);
        component.simulate('mouseOver');
        expect(focus).toHaveBeenCalledTimes(1);
        expect(focus.mock.calls[0]).toEqual([{label: 'test label', value: 'test'}]);
    });
});
