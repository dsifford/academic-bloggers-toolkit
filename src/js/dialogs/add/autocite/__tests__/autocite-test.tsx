import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import React from 'react';
import AutoCite from '..';

const setup = ({ kind = 'webpage' } = {}, pattern?: any) => {
    const getter = jest.fn();
    const component = mount(
        <AutoCite
            kind={kind as any}
            placeholder="Test"
            pattern={pattern}
            getter={getter}
        />,
    );
    return {
        component,
        instance: component.instance() as AutoCite,
        getter,
    };
};

describe('<AutoCite />', () => {
    beforeEach(() => jest.resetAllMocks());
    it('should match snapshots', () => {
        let { component } = setup();
        expect(toJSON(component)).toMatchSnapshot();

        ({ component } = setup({ kind: 'book' }, '[0-9]+'));
        expect(toJSON(component)).toMatchSnapshot();
    });
    it('should handle field change', () => {
        const { component } = setup();
        const query = component.find('#citequery');
        query.simulate('change', { currentTarget: { value: 'hello' } });
    });
    it('should call handleQuery', () => {
        const { component, getter, instance } = setup();
        const button = component.find('button');
        (instance as any).input = {
            validity: {
                valid: true,
            },
        };
        instance.query = 'testing';
        button.simulate('click');

        expect(instance.query).toBe('');
        expect(getter).toHaveBeenCalledTimes(1);

        (instance as any).input.validity = {
            valid: false,
        };
        instance.query = 'foo';
        button.simulate('click');

        expect(instance.query).toBe('foo');
        expect(getter).toHaveBeenCalledTimes(1);
    });
    it('should call handleKeyDown', () => {
        const { component } = setup();
        const input = component.find('#citequery');
        const stopPropagation = jest.fn();
        const preventDefault = jest.fn();

        input.simulate('keyDown', {
            key: 'Enter',
            stopPropagation,
            preventDefault,
        });
        input.simulate('keyDown', {
            key: 'Return',
            stopPropagation,
            preventDefault,
        });
        input.simulate('keyDown', {
            key: 'a',
            stopPropagation,
            preventDefault,
        });

        expect(stopPropagation).toHaveBeenCalledTimes(2);
        expect(preventDefault).toHaveBeenCalledTimes(2);
    });
});
