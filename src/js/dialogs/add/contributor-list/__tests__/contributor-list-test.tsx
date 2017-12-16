import { mount } from 'enzyme';
import { observable } from 'mobx';
import * as React from 'react';
import ContributorList from '../';

const defaultPeople: ABT.Contributor[] = [{ family: 'Doe', given: 'John', type: 'author' }];
const peopleStore = observable<ABT.Contributor>([]);

const setup = (
    citationType: keyof ABT.FieldMappings = 'article-journal',
    people: ABT.Contributor[] = defaultPeople,
) => {
    peopleStore.replace(people);
    const component = mount(<ContributorList citationType={citationType} people={peopleStore} />);
    return {
        addButton: component.find('.btn-row Button button'),
        component,
    };
};

describe('<People />', () => {
    it('should render with a single person', () => {
        const { component } = setup();
        expect(component.find('Contributor').length).toBe(1);

        const person = component.find('Contributor').first();
        expect(person.find('#person-family-0').prop('value')).toBe('Doe');
        expect(person.find('#person-given-0').prop('value')).toBe('John');
    });
    it('should add an empty author when "Add Contributor" is clicked', () => {
        const { component, addButton } = setup();
        expect(component.find('Contributor').length).toBe(1);

        addButton.simulate('click');
        expect(component.find('Contributor').length).toBe(2);

        const newPerson = component.find('Contributor').at(1);
        expect(newPerson.find('#person-family-1').prop('value')).toBe('');
        expect(newPerson.find('#person-given-1').prop('value')).toBe('');
        expect(newPerson.find('select').prop('value')).toBe('author');
    });
    it('should remove a person when remove button is clicked', () => {
        const people: ABT.Contributor[] = [
            { family: 'Doe', given: 'John', type: 'author' },
            { family: 'Smith', given: 'Jane', type: 'author' },
        ];
        const { component } = setup('article-journal', people);
        expect(component.find('Contributor').length).toBe(2);

        const removeButton = component.find('Button button').first();
        removeButton.simulate('click');
        component.update();

        expect(component.find('Contributor').length).toBe(1);
        const person = component.find('Contributor').first();
        expect(person.find('#person-family-0').prop('value')).toBe('Smith');
        expect(person.find('#person-given-0').prop('value')).toBe('Jane');
    });
    it('should update fields when data is changed', () => {
        const { component } = setup();
        const person = component.find('Contributor').first();
        const familyNameInput = person.find('#person-family-0');
        const givenNameInput = person.find('#person-given-0');

        expect(familyNameInput.prop('value')).toBe('Doe');
        expect(givenNameInput.prop('value')).toBe('John');
        component.update();

        const getAttribute1 = (str: string) => (str === 'data-index' ? '0' : 'family');
        const getAttribute2 = (str: string) => (str === 'data-index' ? '0' : 'given');
        (familyNameInput as any)
            .props()
            .onChange({ currentTarget: { value: 'FAMILYNAMETEST', getAttribute: getAttribute1 } });
        (givenNameInput as any)
            .props()
            .onChange({ currentTarget: { value: 'GIVENNAMETEST', getAttribute: getAttribute2 } });
        component.update();

        expect(component.props().people[0].given).toBe('GIVENNAMETEST');
        expect(component.props().people[0].family).toBe('FAMILYNAMETEST');
    });
});
