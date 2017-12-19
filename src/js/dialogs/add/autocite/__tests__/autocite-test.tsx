import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import * as React from 'react';
import AutoCite from '..';

const getter = jest.fn();

const setup = ({ kind = 'webpage' } = {}, pattern?: any) => {
    const component = mount(
        <AutoCite kind={kind as any} placeholder="Test" pattern={pattern} getter={getter} />,
    );
    return {
        component,
    };
};

describe('<AutoCite />', () => {
    beforeEach(() => jest.resetAllMocks());
    test('should match snapshots', () => {
        let { component } = setup();
        expect(toJSON(component)).toMatchSnapshot();

        ({ component } = setup({ kind: 'book' }, '[0-9]+'));
        expect(toJSON(component)).toMatchSnapshot();
    });
    test('should handle field change', () => {
        const { component } = setup();
        const query = component.find('#citequery');
        query.simulate('change', { currentTarget: { value: 'hello' } });
    });
    test('should call handleQuery', () => {
        const { component } = setup();
        const instance = (component as any).instance();
        const button = component.find('button');
        instance.input = {
            validity: {
                valid: true,
            },
        };
        instance.query.set('testing');
        button.simulate('click');

        expect(instance.query.get()).toBe('');
        expect(getter).toHaveBeenCalledTimes(1);

        instance.input.validity = {
            valid: false,
        };
        instance.query.set('foo');
        button.simulate('click');

        expect(instance.query.get()).toBe('foo');
        expect(getter).toHaveBeenCalledTimes(1);
    });
    test('should call handleKeyDown', () => {
        const { component } = setup();
        const input = component.find('#citequery');
        const stopPropagation = jest.fn();
        const preventDefault = jest.fn();

        input.simulate('keyDown', { key: 'Enter', stopPropagation, preventDefault });
        input.simulate('keyDown', { key: 'Return', stopPropagation, preventDefault });
        input.simulate('keyDown', { key: 'a', stopPropagation, preventDefault });

        expect(stopPropagation).toHaveBeenCalledTimes(2);
        expect(preventDefault).toHaveBeenCalledTimes(2);
    });
});
