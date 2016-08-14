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

window['ABT_CitationStyles'] = ABT_CitationStyles;
window['ABT_i18n'] = ABT_i18n;

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
    it('should handle interactions', () => {
        const { component, importBtn, s } = setup();
        expect(s.callCount).toBe(0);
        importBtn.simulate('click');
        expect(s.callCount).toBe(1);
        expect(s.calledWithExactly('IMPORT_RIS')).toBe(true);
        (component.instance() as any).handleSelect({label: 'APA 5th Edition', value: 'apa-5th'});
        expect(s.callCount).toBe(2);
        expect(s.secondCall.calledWithExactly('CHANGE_STYLE', 'apa-5th')).toBe(true);
    });
});
