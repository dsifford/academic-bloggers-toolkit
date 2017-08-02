import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import * as React from 'react';
import AutoCite from '../autocite';

const getter = jest.fn();

const setup = ({ kind = 'webpage', inputType = 'url' } = {}, pattern?: any) => {
    const component = mount(
        <AutoCite
            kind={kind as any}
            inputType={inputType as any}
            placeholder="Test"
            pattern={pattern}
            getter={getter}
        />,
    );
    return {
        component,
    };
};

describe('<AutoCite />', () => {
    beforeEach(() => jest.resetAllMocks());
    it('should match snapshots', () => {
        let { component } = setup();
        expect(toJSON(component)).toMatchSnapshot();

        ({ component } = setup({ kind: 'book', inputType: 'text' }, '[0-9]+'));
        expect(toJSON(component)).toMatchSnapshot();
    });
    it('should handle field change', () => {
        const { component } = setup();
        const query = component.find('#citequery');
        query.simulate('change', { currentTarget: { value: 'hello' } });
    });
    it('should call handleQuery', () => {
        const { component } = setup();
        const instance = (component as any).instance();
        instance.input.validity = {
            valid: true,
        };
        instance.query.set('testing');
        const button = component.find('input[type="button"]');

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
    it('should call handleKeyDown', () => {
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
