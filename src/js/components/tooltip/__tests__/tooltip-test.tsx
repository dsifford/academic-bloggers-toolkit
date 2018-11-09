import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import React from 'react';
import diff from 'snapshot-diff';

import Tooltip from '..';

const setup = ({ active = true, transform = '' } = {}) => {
    const component = shallow(
        <Tooltip
            id="test"
            text="Hello World"
            transform={transform}
            active={active}
        />,
    );
    return {
        component,
    };
};

const getTransform = (position: 'top' | 'right' | 'bottom' | 'left') => {
    const mockRect: ClientRect = {
        bottom: 100,
        height: 100,
        left: 100,
        right: 100,
        top: 100,
        width: 100,
    };
    return Tooltip.transform(position, mockRect);
};

describe('<Tooltip />', () => {
    describe('Component tests', () => {
        test('matches snapshots', () => {
            let { component } = setup();
            const initialRender = toJSON(component);
            expect(initialRender).toMatchSnapshot();

            ({ component } = setup({ active: false }));
            expect(diff(initialRender, toJSON(component))).toMatchSnapshot();

            ({ component } = setup({ transform: 'translateX(50%)' }));
            expect(diff(initialRender, toJSON(component))).toMatchSnapshot();
        });
    });
    describe('transform()', () => {
        test('top', () => {
            expect(getTransform('top')).toBe(
                'translateX(-50%) translateX(50px) translateY(-105px)',
            );
        });
        test('right', () => {
            expect(getTransform('right')).toBe(
                'translateX(100px) translateX(5px)',
            );
        });
        test('bottom', () => {
            expect(getTransform('bottom')).toBe(
                'translateX(-50%) translateX(50px) translateY(105px)',
            );
        });
        test('left', () => {
            expect(getTransform('left')).toBe(
                'translateX(-100%) translateX(-5px)',
            );
        });
    });
});
