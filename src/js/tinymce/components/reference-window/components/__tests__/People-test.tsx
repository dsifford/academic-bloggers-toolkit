import { mount } from 'enzyme';
import { IObservableArray, observable } from 'mobx';
import * as React from 'react';
import { People } from '../People';

const peopleStore: IObservableArray<CSL.TypedPerson> = observable([]);

const setup = (
    citationType: CSL.CitationType = 'article-journal',
    people: CSL.TypedPerson[] = [
        { family: 'Doe', given: 'John', type: 'author' },
    ]
) => {
    peopleStore.replace(people);
    const component = mount(
        <People citationType={citationType} people={peopleStore} />
    );
    return {
        addButton: component.find('#add-person'),
        component,
        instance: component.instance(),
    };
};

describe('<People />', () => {
    it('should render with a single person', () => {
        const { component } = setup();
        expect(component.find('Person').length).toBe(1);

        const person = component.find('Person').first();
        expect(person.find('#person-family-0').props().value).toBe('Doe');
        expect(person.find('#person-given-0').props().value).toBe('John');
    });
    it('should add an empty author when "Add Contributor" is clicked', () => {
        const { component, addButton } = setup();
        expect(component.find('Person').length).toBe(1);

        addButton.simulate('click');
        expect(component.find('Person').length).toBe(2);

        const newPerson = component.find('Person').at(1);
        expect(newPerson.find('#person-family-1').props().value).toBe('');
        expect(newPerson.find('#person-given-1').props().value).toBe('');
        expect(newPerson.find('select').props().value).toBe('author');
    });
    it('should remove a person when remove button is clicked', () => {
        const people = [
            { family: 'Doe', given: 'John', type: 'author' },
            { family: 'Smith', given: 'Jane', type: 'author' },
        ];
        const { component } = setup(
            'article-journal',
            people as CSL.TypedPerson[]
        );
        expect(component.find('Person').length).toBe(2);

        const removeButton = component
            .find('input[type="button"][value="⨯"]')
            .at(1);
        removeButton.simulate('click');

        expect(component.find('Person').length).toBe(1);
        const person = component.find('Person').first();
        expect(person.find('#person-family-0').props().value).toBe('Doe');
        expect(person.find('#person-given-0').props().value).toBe('John');
    });
    it('should update fields when data is changed', () => {
        const { component } = setup();
        const person = component.find('Person').first();
        const familyNameInput = person.find('#person-family-0');
        const givenNameInput = person.find('#person-given-0');

        expect(familyNameInput.props().value).toBe('Doe');
        expect(givenNameInput.props().value).toBe('John');

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

        expect(familyNameInput.props().value).toBe('FAMILYNAMETEST');
        expect(givenNameInput.props().value).toBe('GIVENNAMETEST');
    });
});
