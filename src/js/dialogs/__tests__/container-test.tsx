import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { observable } from 'mobx';
import * as React from 'react';
import Container from '../container';

const setup = () => {
    const currentDialog = observable('hello');
    const component = shallow(
        <Container title="Hello World" currentDialog={currentDialog}>
            <h1>Hello World</h1>
        </Container>,
    );
    return {
        component,
        instance: component.instance() as Container,
        currentDialog,
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
    it('should close when escape is pressed', () => {
        const { component, currentDialog } = setup();
        const stopPropagation = jest.fn();
        component.simulate('keyDown', { key: 'a', stopPropagation });
        expect(currentDialog.get()).toBe('hello');
        expect(stopPropagation).not.toHaveBeenCalled();
        component.simulate('keyDown', { key: 'Escape', stopPropagation });
        expect(currentDialog.get()).toBe('');
        expect(stopPropagation).toHaveBeenCalledTimes(1);
    });
    it('should close with and without an associated event', () => {
        const { instance } = setup();
        expect(instance.close).not.toThrow();
        const preventDefault = jest.fn();
        instance.close({ preventDefault } as any);
        expect(preventDefault).toHaveBeenCalled();
    });
});
