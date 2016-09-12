jest.unmock('../ManualEntryContainer');
jest.unmock('../MetaFields');
// jest.unmock('../People');

import * as React from 'react';
import { mount } from 'enzyme';
import * as sinon from 'sinon';
import { map } from 'mobx';
import { ManualEntryContainer } from '../ManualEntryContainer';

const setup = (
    citationType: CSL.CitationType = 'article-journal',
    isLoading: boolean = false
) => {
    const spy = sinon.spy();
    const component = mount(
        <ManualEntryContainer
            manualData={map([['type', citationType]])}
            people={[]}
            addPerson={spy}
            autoCite={spy}
            changePerson={spy}
            loading={isLoading}
            removePerson={spy}
            typeChange={spy}
        />
    );
    return {
        spy,
        component,
        select: component.find('#type-select'),
        selection: component.find('#type-select').props().value,
    };
};

describe('<ManualEntryContainer />', () => {
    it('should render with loading spinner', () => {
        const { component } = setup('article-journal', true);
        expect(component.find('Spinner')).toBeTruthy();
    });

    it('should render with the correct option', () => {
        const { selection } = setup();
        expect(selection).toBe('article-journal');
    });

    it('should call handleTypeChange when another type is selected', () => {
        const { select, spy } = setup();
        select.simulate('change', { target: { value: 'broadcast' } });
        expect(spy.callCount).toBe(1);
    });

    it('should handle mouse wheel', () => {
        const { component } = setup();
        const scrolldiv = component.find('.abt-scroll-y');
        scrolldiv.simulate('wheel');
    });

    describe('<Autocite />', () => {
        it('should render with autocite for webpage type', () => {
            const { component } = setup('webpage');
            expect(component.find('Autocite')).toBeTruthy();
        });

        it('should call the getter on "Enter" press', () => {
            const { component, spy } = setup('webpage');
            const input = component.find('#citequery');
            input.simulate('keydown', { key: 'j' });
            expect(spy.callCount).toBe(0);
            input.simulate('keydown', { key: 'Enter' });
            expect(spy.callCount).toBe(0);
            input.simulate('change', { target: { value: 'test' }});
            input.simulate('keydown', { key: 'Enter' });
            expect(spy.callCount).toBe(1);
        });
    });
});
