jest.unmock('../Menu');
jest.unmock('../PanelButton');

import * as React from 'react';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import { Menu } from '../Menu';

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
                import: 'Import references from RIS file',
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
window['ABT_i18n'] = ABT_i18n;
window['ABT_Custom_CSL'] = ABT_Custom_CSL;

const setup = () => {
    const s = spy();
    const component = mount(
        <Menu
            cslStyle="american-medical-association"
            submitData={s}
        />
    );
    return {
        component,
        importBtn: component.find('#IMPORT_RIS'),
        s,
    };
};

describe('<Menu />', () => {
    it('should handle basic interactions', () => {
        const { component, importBtn, s } = setup();
        expect(s.callCount).toBe(0);
        importBtn.simulate('click');
        expect(s.callCount).toBe(1);
        expect(s.calledWithExactly('IMPORT_RIS')).toBe(true);
        (component.instance() as any).handleSelect({label: 'APA 5th Edition', value: 'apa-5th'});
        expect(s.callCount).toBe(2);
        expect(s.secondCall.calledWithExactly('CHANGE_STYLE', 'apa-5th')).toBe(true);
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
