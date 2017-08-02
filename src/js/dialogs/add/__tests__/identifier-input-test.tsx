import { mount } from 'enzyme';
import { observable } from 'mobx';
import * as React from 'react';
import { IdentifierInput } from '../identifier-input';

const setup = () => {
    const spy = jest.fn();
    const identifiers = observable('testing');
    const component = mount(
        <IdentifierInput fieldRef={jest.fn()} identifierList={identifiers} onChange={spy} />,
    );
    return {
        component,
        spy,
        input: component.find('#identifierList'),
    };
};

describe('<IdentifierInput />', () => {
    it('should handle input changes correctly', () => {
        const { input, spy } = setup();
        expect(input.prop('value')).toBe('testing');
        input.simulate('change');
        expect(spy).toHaveBeenCalledTimes(1);
    });
});
