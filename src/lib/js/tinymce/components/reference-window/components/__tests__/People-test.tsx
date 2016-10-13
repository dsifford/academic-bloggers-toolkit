jest.unmock('../People');

import * as React from 'react';
import { mount } from 'enzyme';
import * as sinon from 'sinon';
import { People } from '../People';

const setup = (
    citationType: CSL.CitationType = 'article-journal',
    people: CSL.TypedPerson[] = [{family: 'Doe', given: 'John', type: 'author'}]
) => {
    const addPerson = sinon.spy();
    const changePerson = sinon.spy();
    const removePerson = sinon.spy();
    const component = mount(
        <People
            citationType={citationType}
            people={people}
            addPerson={addPerson}
            changePerson={changePerson}
            removePerson={removePerson}
        />
    );
    return {
        addPerson,
        changePerson,
        removePerson,
        component,
        addButton: component.find('#add-person'),
        removeButton: component.find('.abt-btn.abt-btn_flat.abt-btn_icon'),
        select: component.find('select'),
    };
};

describe('<People />', () => {

    it('should call addPerson on click', () => {
        const { addButton, addPerson } = setup();

        addButton.simulate('click');
        addButton.simulate('click');
        addButton.simulate('click');

        expect(addPerson.callCount).toBe(3);
    });

    it('should call removePerson on remove button click',  () => {
        const { removeButton, removePerson } = setup();
        removeButton.simulate('click');
        expect(removePerson.callCount).toBe(1);
    });

    it('should call changePerson appropriately when input fields are changed', () => {

        const { component, changePerson } = setup();

        const firstNameInput = component.find('#person-given-0');
        const lastNameInput = component.find('#person-family-0');

        firstNameInput.simulate('change');
        lastNameInput.simulate('change');

        expect(changePerson.callCount).toBe(2);
        expect(changePerson.firstCall.args[0]).toBe('0');
        expect(changePerson.firstCall.args[1]).toBe('given');
        expect(changePerson.firstCall.args[2]).toBe('John');
        expect(changePerson.secondCall.args[0]).toBe('0');
        expect(changePerson.secondCall.args[1]).toBe('family');
        expect(changePerson.secondCall.args[2]).toBe('Doe');
    });

});
