jest.unmock('../ButtonRow');

import * as React from 'react';
import { shallow } from 'enzyme';
import * as sinon from 'sinon';
import { ButtonRow } from '../ButtonRow';
import ABT_i18n from '../../../../../../../scripts/Fixtures';
window['ABT_i18n'] = ABT_i18n;

const setup = (
    addManually: boolean = false,
    attachInline: boolean = false
) => {
    const spy = sinon.spy();
    const component = shallow(
        <ButtonRow addManually={addManually} attachInline={attachInline} eventHandler={spy} />
    );
    return {
        addManually: component.find('#addManually'),
        checkbox: component.find('#attachInline'),
        component,
        searchPubmed: component.find('#searchPubmed'),
        spy,
        submit: component.find('#submit-btn'),
    };
};

const submitSpy = sinon.spy();

window['tinyMCE'] = {
    activeEditor: {
        windowManager: {
            open: (a) => {
                const e = { target: { data: { pmid: 12345 }}};
                submitSpy(a.onsubmit(e));
            },
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

// wm.windows[0].settings.params.baseUrl

describe('<ButtonRow />', () => {
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

        expect(spy.callCount).toBe(2);
        expect(spy.firstCall.calledWithExactly(new CustomEvent('TOGGLE_MANUAL'))).toBeTruthy;
        expect(spy.secondCall.calledWithExactly(new CustomEvent('TOGGLE_INLINE_ATTACHMENT'))).toBeTruthy;
    });
    it('should open the pubmed window appropriately', () => {
        const spy = sinon.spy(window.tinyMCE.activeEditor.windowManager, 'open');
        const { searchPubmed } = setup();
        searchPubmed.simulate('click');
        expect(spy.callCount).toBe(1);
        expect(spy.args[0][0].title).toBe('Search PubMed for Reference');
        expect(submitSpy.callCount).toBe(1);
    });
});
