import { mount } from 'enzyme';
import * as React from 'react';
import { ButtonRow } from '../ButtonRow';
const before = beforeAll;

const setup = (addManually: boolean = false, attachInline: boolean = false) => {
    const spy = jest.fn();
    const component = mount(
        <ButtonRow
            addManually={addManually}
            attachInline={attachInline}
            attachInlineToggle={spy}
            pubmedCallback={spy}
            toggleManual={spy}
        />
    );
    return {
        addManually: component.find('#addManually'),
        checkbox: component.find('#inline-toggle'),
        component,
        label: component.find('label'),
        searchPubmed: component.find('#searchPubmed'),
        spy,
        submit: component.find('#submit-btn'),
    };
};

describe('<ButtonRow />', () => {
    let submitSpy;

    before(() => {
        submitSpy = jest.fn();
        window['tinyMCE'] = {
            activeEditor: {
                windowManager: {
                    open: jest.fn(a => {
                        const e = { target: { data: { pmid: 12345 } } };
                        submitSpy(a.onsubmit(e));
                    }),
                    windows: [
                        {
                            settings: {
                                params: {
                                    baseUrl: 'http://www.test.com/',
                                },
                            },
                        },
                    ],
                },
            },
        } as any;
    });

    it('should render with the correct labels for "falsy" props', () => {
        const { checkbox, addManually } = setup();
        expect(addManually.props().value).toBe('Add Manually');
        expect(checkbox.props().checked).toBe(false);
    });
    it('should render with the correct labels for "truthy" props', () => {
        const { checkbox, addManually } = setup(true, true);
        expect(addManually.props().value).toBe('Add with Identifier');
        expect(checkbox.props().checked).toBe(true);
    });
    it('should handle toggles correctly', () => {
        const { checkbox, addManually, spy } = setup();
        expect(addManually.props().value).toBe('Add Manually');
        expect(checkbox.props().checked).toBe(false);

        checkbox.simulate('change');
        addManually.simulate('click');
        expect(spy).toHaveBeenCalledTimes(2);
    });
    it('should open the pubmed window appropriately', () => {
        const spy = window.tinyMCE.activeEditor.windowManager.open as any;
        const { searchPubmed } = setup();
        searchPubmed.simulate('click');
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0][0].title).toBe('Search PubMed for Reference');
        expect(submitSpy).toHaveBeenCalledTimes(1);
    });
    it('should handle mouseover correctly', () => {
        const { label } = setup();
        label.simulate('mouseover');
    });
});
