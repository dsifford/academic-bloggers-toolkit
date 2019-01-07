import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import React from 'react';

import Contributor from '../contributor';

const setup = (literal = false) => {
    const contributorTypes: any = [
        { label: 'Author', type: 'author' },
        { label: 'Editor', type: 'editor' },
    ];
    const contributor: ABT.Contributor = {
        family: 'Smith',
        given: 'John',
        type: 'author',
    };
    const literalContributor: ABT.Contributor = {
        literal: 'Literal Name',
        type: 'editor',
    };
    const onRemove = jest.fn();
    const component = shallow(
        <Contributor
            contributorTypes={contributorTypes}
            index={0}
            contributor={literal ? literalContributor : contributor}
            onRemove={onRemove}
        />,
    );
    return {
        component,
        instance: component.instance() as Contributor,
    };
};

describe('<Contributor />', () => {
    const BASELINE = toJSON(setup().component);
    const LITERAL_BASELINE = toJSON(setup(true).component);
    it('should match baseline snapshot', () => {
        expect(BASELINE).toMatchSnapshot();
    });
    it('should match literal baseline snapshot', () => {
        expect(LITERAL_BASELINE).toMatchSnapshot();
    });
    it('should toggle literal', () => {
        const { component, instance } = setup();
        expect(instance.isLiteral).toBe(false);
        expect(instance.props.contributor.family).toBe('Smith');
        const button = component.find('Button').first();
        button.simulate('click');
        expect(instance.isLiteral).toBe(true);
        button.simulate('click');
        expect(instance.isLiteral).toBe(false);
        expect(instance.props.contributor.family).toBe('');
    });
    it('should update fields', () => {
        const { component, instance } = setup();
        expect(instance.props.contributor.family).toBe('Smith');
        const input = component.find('input').first();
        input.simulate('change', {
            currentTarget: { dataset: { field: 'family' } },
            value: 'testing',
        });
        expect(() =>
            instance.update({ currentTarget: { dataset: {} } } as any),
        ).toThrowError(ReferenceError);
    });
});
