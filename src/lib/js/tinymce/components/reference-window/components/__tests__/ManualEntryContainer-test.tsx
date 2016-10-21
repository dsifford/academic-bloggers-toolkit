import * as React from 'react';
import { mount } from 'enzyme';
import { map } from 'mobx';
import { ManualEntryContainer, AutoCite } from '../ManualEntryContainer';

const setup = (
    citationType: CSL.CitationType = 'article-journal',
    isLoading: boolean = false
) => {
    const spy = jest.fn();
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
        instance: component.instance() as any,
        select: component.find('#type-select'),
        selection: component.find('#type-select').props().value,
    };
};

const setupAutocite = (kind: 'book'|'chapter'|'webpage' = 'webpage', inputType: 'text'|'url' = 'url') => {
    const spy = jest.fn();
    const component = mount(
        <AutoCite
            getter={spy}
            kind={kind}
            placeholder="Testing"
            inputType={inputType}
        />
    );
    return {
        component,
        instance: component.instance() as any,
        spy,
    };
};

describe('<ManualEntryContainer />', () => {
    it('should render with loading spinner', () => {
        const d = document.createElement('div');
        d.id = 'abt-root';
        document.body.appendChild(d);
        const { component, instance } = setup('article-journal', true);
        expect(component.find('Spinner')).toBeTruthy();
        instance.getHeight();
    });
    it('should render with the correct option', () => {
        const { selection } = setup();
        expect(selection).toBe('article-journal');
    });
    it('should call handleTypeChange when another type is selected', () => {
        const { select, spy } = setup();
        select.simulate('change', { target: { value: 'broadcast' } });
        expect(spy).toHaveBeenCalledTimes(1);
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
        it('should render with autocite for book type', () => {
            const { component } = setup('book');
            expect(component.find('Autocite')).toBeTruthy();
        });
        it('should NOT call the getter on "Enter" press with an empty query', () => {
            const { component, spy } = setup('webpage');
            const input = component.find('#citequery');
            input.simulate('keydown', { key: 'j' });
            expect(spy).toHaveBeenCalledTimes(0);
            input.simulate('keydown', { key: 'Enter' });
            expect(spy).toHaveBeenCalledTimes(0);
        });
        it('should call getter on "Enter" press with a valid query', () => {
            const { component, instance, spy } = setupAutocite();
            instance.input.validity = { valid: false }; // Fixes test environment error
            instance.handleAutociteFieldChange({ target: { value: 'http://www.google.com' }});
            instance.query = 'http://www.google.com';
            instance.input.validity = { valid: true }; // Fixes test environment error
            instance.handleQuery();
            component.update();
            expect(spy).toHaveBeenCalledTimes(1);
        });
    });
});
