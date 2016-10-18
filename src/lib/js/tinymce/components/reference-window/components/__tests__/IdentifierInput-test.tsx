import * as React from 'react';
import { mount } from 'enzyme';
import { spy as s} from 'sinon';
import { IdentifierInput } from '../IdentifierInput';

const setup = () => {
    const spy = s();
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
        const mounted = s(IdentifierInput.prototype, 'componentDidMount');
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
