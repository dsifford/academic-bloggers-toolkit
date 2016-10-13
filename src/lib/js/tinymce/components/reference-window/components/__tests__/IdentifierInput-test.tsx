jest.unmock('../IdentifierInput');

import * as React from 'react';
import { mount } from 'enzyme';
import * as sinon from 'sinon';
import { IdentifierInput } from '../IdentifierInput';

const setup = () => {
    const spy = sinon.spy();
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
    it('should call componentDidMount', () => {
        const mounted = sinon.spy(IdentifierInput.prototype, 'componentDidMount');
        setup();
        expect(mounted.called).toBe(true);
    });
    it('should handle input changes correctly', () => {
        const { input, spy } = setup();
        expect(input.props().value).toBe('testing');
        input.simulate('change');
        expect(spy.callCount).toBe(1);
    });
});
