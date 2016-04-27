jest.unmock('../People');

import * as React from 'react';
import { mount } from 'enzyme';
import * as sinon from 'sinon';
import { People } from '../People';

const setup = (
    citationType: CSL.CitationType = 'article-journal',
    people: CSL.TypedPerson[] = [{type: 'author', family: 'Doe', given: 'John'}]
) => {
    const eventHandler = sinon.spy();
    const component = mount(
        <People citationType={citationType} eventHandler={eventHandler} people={people} />
    );
    return {
        eventHandler,
        component,
        addButton: component.find('#add-person'),
        removeButton: component.find('#remove-button-0'),
        select: component.find('select'),
    }
}

describe('<People />', () => {

    it('should dispatch the ADD_PERSON event when add button is clicked', () => {

        const { addButton, eventHandler } = setup();

        addButton.simulate('click');
        addButton.simulate('click');
        addButton.simulate('click');

        expect(eventHandler.callCount).toBe(3);
        expect(eventHandler.getCall(0).args[0].type).toBe('ADD_PERSON');
        expect(eventHandler.getCall(1).args[0].type).toBe('ADD_PERSON');
        expect(eventHandler.getCall(2).args[0].type).toBe('ADD_PERSON');

    });

    it('should dispatch the REMOVE_PERSON event when remove button is clicked',  () => {

        const { removeButton, eventHandler } = setup();

        removeButton.simulate('click');

        expect(eventHandler.callCount).toBe(1);
        expect(eventHandler.lastCall.args[0].type).toBe('REMOVE_PERSON');

    });

    it('should dispatch the PERSON_CHANGE event appropriately when input fields are changed', () => {

        const { component, eventHandler } = setup();

        const firstNameInput = component.find('#person-given-0');
        const lastNameInput = component.find('#person-family-0');

        firstNameInput.simulate('change');
        lastNameInput.simulate('change');

        expect(eventHandler.callCount).toBe(2);
        expect(eventHandler.firstCall.args[0].type).toBe('PERSON_CHANGE');
        expect(eventHandler.secondCall.args[0].type).toBe('PERSON_CHANGE');

        expect(eventHandler.firstCall.args[0].detail).toEqual({ index: 0, field: 'given', value: 'John' });
        expect(eventHandler.secondCall.args[0].detail).toEqual({ index: 0, field: 'family', value: 'Doe' });

    });

    it('should dispatch the PERSON_CHANGE event appropriately when select fields are changed', () => {

        const { component, eventHandler } = setup();
        const select = component.find('#peopleSelect-0');

        select.simulate('change');

        expect(eventHandler.callCount).toBe(1);
        expect(eventHandler.firstCall.args[0].type).toBe('PERSON_CHANGE');
        expect(eventHandler.firstCall.args[0].detail).toEqual({ index: 0, field: 'type', value: 'author' });

    });

    it('should display the correct label for AUTHOR in varying types', () => {

        const { select, component } = setup('bill');
        expect(select.text()).toBe('Sponsor');

        component.setProps({ citationType: 'broadcast' });
        expect(component.find('#peopleSelect-0').text()).toBe('Producer');

    });

});
