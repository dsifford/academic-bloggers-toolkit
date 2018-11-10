import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import React from 'react';
import Container from '..';

const setup = () => {
    const onClose = jest.fn();
    const component = shallow(
        <Container title="Hello World" onClose={onClose}>
            <h1>Hello World</h1>
        </Container>,
    );
    return {
        component,
        instance: component.instance() as Container,
        onClose,
    };
};

describe('<Container />', () => {
    it('should match snapshot', () => {
        const { component } = setup();
        expect(toJSON(component)).toMatchSnapshot();
    });
    it('should render', () => {
        const { component } = setup();
        expect(component).toBeTruthy();
    });
    it('should handle mouse wheel appropriately', () => {
        const { component } = setup();
        const preventDefault = jest.fn();
        component.simulate('wheel', { cancelable: false, preventDefault });
        expect(preventDefault).not.toHaveBeenCalled();
        component.simulate('wheel', { cancelable: true, preventDefault });
        expect(preventDefault).toHaveBeenCalledTimes(1);
    });
    it('should close with and without an associated event', () => {
        const { instance } = setup();
        expect(instance.close).not.toThrow();
        const preventDefault = jest.fn();
        instance.close({ preventDefault } as any);
        expect(preventDefault).toHaveBeenCalled();
    });
    it('should handle key event', () => {
        const { instance, onClose } = setup();
        const mockEvent = {
            key: 'a',
            stopPropagation: jest.fn(),
        };
        (instance as any).handleKeyEvent(mockEvent);
        mockEvent.key = 'Escape';
        (instance as any).handleKeyEvent(mockEvent);
        expect(onClose).toHaveBeenCalledTimes(1);
        expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
    });
    it('should toggle focus trap', () => {
        const { instance } = setup();
        expect(instance.focusTrapPaused).toBe(false);
        instance.toggleFocusTrap();
        expect(instance.focusTrapPaused).toBe(true);
    });
});
