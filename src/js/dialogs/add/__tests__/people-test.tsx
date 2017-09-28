import { mount } from 'enzyme';
import { observable } from 'mobx';
import * as React from 'react';
import People from '../people';

const defaultPeople: ABT.TypedPerson[] = [{ family: 'Doe', given: 'John', type: 'author' }];
const peopleStore = observable<ABT.TypedPerson>([]);

const setup = (
    citationType: CSL.ItemType = 'article-journal',
    people: ABT.TypedPerson[] = defaultPeople,
) => {
    peopleStore.replace(people);
    const component = mount(<People citationType={citationType} people={peopleStore} />);
    return {
        addButton: component.find('.btn-row Button button'),
        component,
    };
};

describe('<People />', () => {
    it('should render with a single person', () => {
        const { component } = setup();
        expect(component.find('Person').length).toBe(1);

        const person = component.find('Person').first();
        expect(person.find('#person-family-0').prop('value')).toBe('Doe');
        expect(person.find('#person-given-0').prop('value')).toBe('John');
    });
    // fit('should add an empty author when "Add Contributor" is clicked', () => {
    //     const { component, addButton } = setup();
    //     expect(component.find('Person').length).toBe(1);

    //     addButton.simulate('click');
    //     expect(component.find('Person').length).toBe(2);

    //     const newPerson = component.find('Person').at(1);
    //     expect(newPerson.find('#person-family-1').prop('value')).toBe('');
    //     expect(newPerson.find('#person-given-1').prop('value')).toBe('');
    //     expect(newPerson.find('select').prop('value')).toBe('author');
    // });
    // fit('should remove a person when remove button is clicked', () => {
    //     const people: ABT.TypedPerson[] = [{ family: 'Doe', given: 'John', type: 'author' }, { family: 'Smith', given: 'Jane', type: 'author' }];
    //     const { component } = setup('article-journal', people);
    //     expect(component.find('Person').length).toBe(2);

    //     const removeButton = component.find('Button').first();
    //     removeButton.simulate('click');

    //     component.instance();

    //     expect(component.find('Person').length).toBe(1);
    //     const person = component.find('Person').first();
    //     expect(person.find('#person-family-0').prop('value')).toBe('Doe');
    //     expect(person.find('#person-given-0').prop('value')).toBe('John');
    // });
    // fit('should update fields when data is changed', () => {
    //     const { component } = setup();
    //     const person = component.find('Person').first();
    //     const familyNameInput = person.find('#person-family-0');
    //     const givenNameInput = person.find('#person-given-0');

    //     expect(familyNameInput.prop('value')).toBe('Doe');
    //     expect(givenNameInput.prop('value')).toBe('John');

    //     familyNameInput.simulate('change', { currentTarget: { value: 'POO' } });
    //     givenNameInput.simulate('change');

    //     peopleStore.replace([{ family: 'FAMILYNAMETEST', given: 'GIVENNAMETEST', type: 'author' }]);

    //     expect(familyNameInput.prop('value')).toBe('FAMILYNAMETEST');
    //     expect(givenNameInput.prop('value')).toBe('GIVENNAMETEST');
    // });
});
