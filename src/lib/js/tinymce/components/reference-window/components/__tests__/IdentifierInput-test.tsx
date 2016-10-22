import * as React from 'react';
import { mount } from 'enzyme';
import { IdentifierInput } from '../IdentifierInput';

const setup = () => {
    const spy = jest.fn();
    const component = mount(
        <IdentifierInput
            identifierList="testing"
            change={spy}
        />
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
        expect(input.props().value).toBe('testing');
        input.simulate('change');
        expect(spy).toHaveBeenCalledTimes(1);
    });
});
