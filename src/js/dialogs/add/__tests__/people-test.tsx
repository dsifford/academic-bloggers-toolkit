import { mount } from 'enzyme';
import { IObservableArray, observable } from 'mobx';
import * as React from 'react';
import { People } from '../people';

const defaultPeople = [{ family: 'Doe', given: 'John', type: 'author' }];
const peopleStore = observable([]);

const setup = (citationType = 'article-journal', people = defaultPeople) => {
    peopleStore.replace(people);
    const component = mount(<People citationType={citationType} people={peopleStore} />);
    return {
        addButton: component.find('#add-person'),
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
    it('should add an empty author when "Add Contributor" is clicked', () => {
        const { component, addButton } = setup();
        expect(component.find('Person').length).toBe(1);

        addButton.simulate('click');
        expect(component.find('Person').length).toBe(2);

        const newPerson = component.find('Person').at(1);
        expect(newPerson.find('#person-family-1').prop('value')).toBe('');
        expect(newPerson.find('#person-given-1').prop('value')).toBe('');
        expect(newPerson.find('select').prop('value')).toBe('author');
    });
    it('should remove a person when remove button is clicked', () => {
        const people = [
            { family: 'Doe', given: 'John', type: 'author' },
            { family: 'Smith', given: 'Jane', type: 'author' },
        ];
        const { component } = setup('article-journal', people);
        expect(component.find('Person').length).toBe(2);

        const removeButton = component.find('input[type="button"][value="⨯"]').at(1);
        removeButton.simulate('click');

        expect(component.find('Person').length).toBe(1);
        const person = component.find('Person').first();
        expect(person.find('#person-family-0').prop('value')).toBe('Doe');
        expect(person.find('#person-given-0').prop('value')).toBe('John');
    });
    it('should update fields when data is changed', () => {
        const { component } = setup();
        const person = component.find('Person').first();
        const familyNameInput = person.find('#person-family-0');
        const givenNameInput = person.find('#person-given-0');

        expect(familyNameInput.prop('value')).toBe('Doe');
        expect(givenNameInput.prop('value')).toBe('John');

        familyNameInput.simulate('change', {
            currentTarget: { value: 'FAMILYNAMETEST' },
        });
        givenNameInput.simulate('change', {
            currentTarget: { value: 'GIVENNAMETEST' },
        });

        peopleStore.replace([
            {
                family: 'FAMILYNAMETEST',
                given: 'GIVENNAMETEST',
                type: 'author',
            },
        ]);

        expect(familyNameInput.prop('value')).toBe('FAMILYNAMETEST');
        expect(givenNameInput.prop('value')).toBe('GIVENNAMETEST');
    });
});
