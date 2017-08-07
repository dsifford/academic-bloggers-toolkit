import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import * as React from 'react';
import * as diff from 'snapshot-diff';

import Button from '../button';

const setup = (props: any = {}) => {
    if (!props.label) props.label = 'Click Me!';
    const component = mount(<Button {...props} />);
    return {
        component,
    };
};

describe('<Button />', () => {
    describe('Text Button', () => {
        const { component: defaultTextButton } = setup();
        const defaultJSON = toJSON(defaultTextButton);
        test('with defaults', async () => {
            expect(defaultJSON).toMatchSnapshot();
        });
        test('with focusable', () => {
            const { component } = setup({ focusable: true });
            expect(diff(defaultJSON, toJSON(component))).toMatchSnapshot();
        });
        test('with primary', () => {
            const { component } = setup({ primary: true });
            expect(diff(defaultJSON, toJSON(component))).toMatchSnapshot();
        });
        test('with flat', () => {
            const { component } = setup({ flat: true });
            expect(diff(defaultJSON, toJSON(component))).toMatchSnapshot();
        });
        test('with all variants', () => {
            const { component } = setup({ flat: true, focusable: true, primary: true });
            expect(diff(defaultJSON, toJSON(component))).toMatchSnapshot();
        });
        test('with tooltip', () => {
            const tooltip = {
                text: 'Hello world',
                position: 'top' as 'top' | 'right' | 'bottom' | 'left',
            };
            const { component } = setup({ tooltip });
            expect(diff(defaultJSON, toJSON(component))).toMatchSnapshot();
        });
    });
    describe('Icon Button', () => {
        const { component: defaultIconButton } = setup({ icon: 'plus' });
        const defaultJSON = toJSON(defaultIconButton);
        test('with defaults', async () => {
            expect(defaultJSON).toMatchSnapshot();
        });
        test('with all variants and different icon', () => {
            const { component } = setup({
                icon: 'minus',
                flat: true,
                focusable: true,
                primary: true,
            });
            expect(diff(defaultJSON, toJSON(component))).toMatchSnapshot();
        });
    });
    test('tooltip handler', () => {
        const tooltip = {
            text: 'Hello World',
            position: 'top' as 'top' | 'right' | 'bottom' | 'left',
        };
        const { component } = setup({ tooltip });
        const button = component.find('button');
        const beforeState = {
            isShowingTooltip: false,
            transform: '',
        };
        expect(component.state()).toEqual(beforeState);

        button.simulate('mouseenter');
        expect(component.state()).not.toEqual(beforeState);
        expect(component.state('isShowingTooltip')).toBeTruthy();
        expect(component.state('transform')).not.toBe('');

        button.simulate('mouseleave');
        expect(component.state()).not.toEqual(beforeState); // transform stays set
        expect(component.state('isShowingTooltip')).toBeFalsy();
        expect(component.state('transform')).not.toBe('');
    });
    test('link button handler', () => {
        window.open = jest.fn();
        const { component } = setup({ href: 'https://google.com' });
        const button = component.find('button');
        button.simulate('click');
        expect(window.open).toHaveBeenCalledWith('https://google.com', '_blank');
    });
});
