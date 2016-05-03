jest.unmock('../ManualEntryContainer');

import * as React from 'react';
import { mount } from 'enzyme';
import * as sinon from 'sinon';
import { ManualSelection, ManualEntryContainer } from '../ManualEntryContainer';

const setup = (
    citationType: CSL.CitationType = 'article-journal'
) => {
    const spy = sinon.spy();
    const component = mount(
        <ManualEntryContainer manualData={{ type: citationType }} people={[]} eventHandler={spy} />
    );
    return {
        spy,
        component,
        select: component.find('#type'),
        selection: component.find('#type').props().value,
    }
}


describe('<ManualEntryContainer />', () => {

    it('should render with the correct option', () => {
        const { selection } = setup();
        expect(selection).toBe('article-journal');
    });

    it('should dispatch CHANGE_CITATION_TYPE when another type is selected', () => {
        const { select, spy } = setup();
        select.simulate('change', { target: { value: 'broadcast' }, });
        expect(spy.callCount).toBe(1);
        expect(spy.firstCall.args[0].detail).toBe('broadcast');
    })

});
