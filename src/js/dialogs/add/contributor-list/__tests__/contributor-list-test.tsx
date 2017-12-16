import { mount } from 'enzyme';
import { observable } from 'mobx';
import * as React from 'react';
import { manualPersonObj } from 'utils/constants';
import ContributorList from '../';

const defaultPeople: ABT.Contributor[] = [{ ...manualPersonObj, family: 'Doe', given: 'John' }];
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
        expect(person.find('[data-field="family"]').prop('value')).toBe('Doe');
        expect(person.find('[data-field="given"]').prop('value')).toBe('John');
    });
    it('should add an empty author when "Add Contributor" is clicked', () => {
        const { component, addButton } = setup();
        expect(component.find('Contributor').length).toBe(1);

        addButton.simulate('click');
        expect(component.find('Contributor').length).toBe(2);

        const newPerson = component.find('Contributor').at(1);
        expect(newPerson.find('[data-field="family"]').prop('value')).toBe('');
        expect(newPerson.find('[data-field="given"]').prop('value')).toBe('');
        expect(newPerson.find('select').prop('value')).toBe('author');
    });
    it('should remove a person when remove button is clicked', () => {
        const people: ABT.Contributor[] = [
            { ...manualPersonObj, family: 'Doe', given: 'John' },
            { ...manualPersonObj, family: 'Smith', given: 'Jane' },
        ];
        const { component } = setup('article-journal', people);
        expect(component.find('Contributor').length).toBe(2);
        console.log(peopleStore.length);

        const removeButton = component.find('Button button').at(1);
        removeButton.simulate('click');
        component.update();
        console.log(peopleStore.length);

        expect(component.find('Contributor').length).toBe(1);
        const person = component.find('Contributor').first();
        expect(person.find('[data-field="family"]').prop('value')).toBe('Smith');
        expect(person.find('[data-field="given"]').prop('value')).toBe('Jane');
    });
});
