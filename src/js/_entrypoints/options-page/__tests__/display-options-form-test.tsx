import * as React from 'react';
import toJSON from 'enzyme-to-json';
import { shallow } from 'enzyme';

import DisplayOptionsForm from '../display-options-form';

const setup = () => {
    const component = shallow(<DisplayOptionsForm />);
    return {
        component,
        store: (component.instance() as DisplayOptionsForm).store,
    };
};

describe('<DisplayOptionsForm />', () => {
    it('should match snapshots', () => {
        const { component } = setup();
        expect(toJSON(component)).toMatchSnapshot();
    });
    it('should handle heading change', () => {
        const { component, store } = setup();
        const input = component.find('input[name="bib_heading"]');
        const before: Partial<ABT.DisplayOptions> = {
            bib_heading: '',
            bibliography: 'fixed',
        };
        const after: Partial<ABT.DisplayOptions> = {
            bib_heading: 'Testing',
            bibliography: 'fixed',
        };

        expect(store.bibliography).toEqual(before.bibliography);
        expect(store.bib_heading).toEqual(before.bib_heading);

        input.simulate('change', { currentTarget: { value: 'Testing' } });
        expect(store.bibliography).toEqual(after.bibliography);
        expect(store.bib_heading).toEqual(after.bib_heading);

        store.options = {
            ...store.options,
            bibliography: 'toggle',
        };
        component.update();
        expect(store.bibliography).not.toEqual(after.bibliography);
        expect(store.bib_heading).toEqual(after.bib_heading);

        input.simulate('change', { currentTarget: { value: '' } });
        expect(store.bibliography).toEqual(before.bibliography);
        expect(store.bib_heading).toEqual(before.bib_heading);
    });
    it('should handle heading level change', () => {
        const { component, store } = setup();
        const radioGroup = component.find(
            'RadioGroup[name="bib_heading_level"]',
        );
        expect(store.options.bib_heading_level).toBe('h3');

        radioGroup.simulate('change', { currentTarget: { value: 'h1' } });
        expect(store.options.bib_heading_level).toBe('h1');
    });
    it('should handle bibliography style change', () => {
        const { component, store } = setup();
        const radioGroup = component.find('RadioGroup[name="bibliography"]');
        expect(store.options.bibliography).toBe('fixed');

        radioGroup.simulate('change', { currentTarget: { value: 'toggle' } });
        expect(store.options.bibliography).toBe('toggle');
    });
    it('should handle link format change', () => {
        const { component, store } = setup();
        const radioGroup = component.find('RadioGroup[name="links"]');
        expect(store.options.links).toBe('always');

        radioGroup.simulate('change', { currentTarget: { value: 'urls' } });
        expect(store.options.links).toBe('urls');
    });
});
