import * as React from 'react';
import { mount } from 'enzyme';
import { People } from '../People';

const setup = (
    citationType: CSL.CitationType = 'article-journal',
    people: CSL.TypedPerson[] = [{family: 'Doe', given: 'John', type: 'author'}]
) => {
    const addPerson = jest.fn();
    const changePerson = jest.fn();
    const removePerson = jest.fn();
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

        expect(addPerson).toHaveBeenCalledTimes(3);
    });

    it('should call removePerson on remove button click',  () => {
        const { removeButton, removePerson } = setup();
        removeButton.simulate('click');
        expect(removePerson).toHaveBeenCalledTimes(1);
    });

    it('should call changePerson appropriately when input fields are changed', () => {

        const { component, changePerson } = setup();

        const firstNameInput = component.find('#person-given-0');
        const lastNameInput = component.find('#person-family-0');

        firstNameInput.simulate('change');
        lastNameInput.simulate('change');

        expect(changePerson).toHaveBeenCalledTimes(2);
        expect(changePerson.mock.calls[0]).toEqual(['0', 'given', 'John']);
        expect(changePerson.mock.calls[1]).toEqual(['0', 'family', 'Doe']);
    });

});
