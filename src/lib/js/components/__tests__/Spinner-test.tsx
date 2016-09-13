jest.autoMockOff();

import * as React from 'react';
import { mount } from 'enzyme';
import { Spinner } from '../Spinner';

interface SpinnerProps {
    /* The length and width in pixels of the spinner*/
    size: string;
    /* Set background color of container */
    bgColor?: string;
    /* If not in a containing element, this is minimum height */
    height?: string|Function;
    /* Add this for a background overlay */
    overlay?: boolean;
}

const setup = (props: SpinnerProps) => {
    const component = mount(
        <Spinner {...props} />
    );
    return {
        component,
        root: component.find('div').first(),
        svg: component.find('.abt-spinner'),
    };
};

describe('<Spinner />', () => {
    it('should with defaults at 40px', () => {
        const { svg, root } = setup({size: '40px'});
        expect(svg.props().height).toBe('40px');
        expect(svg.props().width).toBe('40px');
        expect(root.props().className).toBe('abt-spinner-container');
        expect(root.props().style).toEqual({});
    });

    it('should render with an overlay', () => {
        const { svg, root } = setup({overlay: true, size: '40px'});
        expect(svg.props().height).toBe('40px');
        expect(svg.props().width).toBe('40px');
        expect(root.props().className).toBe('abt-spinner-container abt-overlay');
        expect(root.props().style).toEqual({});
    });

    it('should render with a background color', () => {
        const { svg, root } = setup({bgColor: 'magenta', size: '40px'});
        expect(svg.props().height).toBe('40px');
        expect(svg.props().width).toBe('40px');
        expect(root.props().className).toBe('abt-spinner-container');
        expect(root.props().style).toEqual({ backgroundColor: 'magenta' });
    });

    it('should render with container height set by string', () => {
        const { svg, root } = setup({height: '100px', size: '40px'});
        expect(svg.props().height).toBe('40px');
        expect(svg.props().width).toBe('40px');
        expect(root.props().className).toBe('abt-spinner-container');
        expect(root.props().style).toEqual({ height: '100px', minHeight: '100px' });
    });

    it('should render with container height set by height function', () => {
        const getHeight = () => '250px';
        const { svg, root } = setup({height: getHeight, size: '40px'});
        expect(svg.props().height).toBe('40px');
        expect(svg.props().width).toBe('40px');
        expect(root.props().className).toBe('abt-spinner-container');
        expect(root.props().style).toEqual({ height: '250px', minHeight: '250px' });
    });
});
