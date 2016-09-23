jest.unmock('../MetaFields');

import * as React from 'react';
import { map } from 'mobx';
import { mount } from 'enzyme';
import { MetaFields } from '../MetaFields';

const setup = (
    title = 'article-journal'
) => {
    const meta = map([['type', title]]);
    const component = mount(
        <MetaFields meta={meta} />
    );
    return {
        component,
        field: component.find(`#title`),
        title: component.find(`#meta-${title}`).text(),
    };
};

describe('<MetaFields />', () => {
    it('should render with the correct title', () => {
        let { title } = setup();
        expect(title).toBe('Journal Article');

        ({ title } = setup('article-magazine'));
        expect(title).toBe('Magazine Article');
    });

    it('should call updateField when fields are changed', () => {
        const { component, field } = setup();
        expect(component.props().meta.get('title')).toBeUndefined();
        field.simulate('change', { target: { id: 'title', value: 'newTitle' }});
        expect(component.props().meta.get('title')).toBe('newTitle');
    });
});
