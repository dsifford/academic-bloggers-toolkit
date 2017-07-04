import { mount } from 'enzyme';
import * as React from 'react';
import { Spinner } from '../Spinner';

interface SpinnerProps {
    /* The length and width in pixels of the spinner*/
    size: string;
    /* Set background color of container */
    bgColor?: string;
    /* If not in a containing element, this is minimum height */
    height?: string | number | (() => string | number);
    /* Add this for a background overlay */
    overlay?: boolean;
}

const setup = (props: SpinnerProps) => {
    const component = mount(<Spinner {...props} />);
    return {
        component,
        root: component.find('.abt-spinner').first(),
        svg: component.find('svg'),
    };
};

describe('<Spinner />', () => {
    it('should with defaults at 40px', () => {
        const { svg, root } = setup({ size: '40px' });
        expect(svg.props().height).toBe('40px');
        expect(svg.props().width).toBe('40px');
        expect(root.props().className).toBe('abt-spinner');
        expect(root.props().style).toEqual({});
    });
    it('should render with an overlay', () => {
        const { svg, root } = setup({ overlay: true, size: '40px' });
        expect(svg.props().height).toBe('40px');
        expect(svg.props().width).toBe('40px');
        expect(root.props().className).toBe('abt-spinner abt-spinner_overlay');
        expect(root.props().style).toEqual({});
    });
    it('should render with a background color', () => {
        const { svg, root } = setup({ bgColor: 'magenta', size: '40px' });
        expect(svg.props().height).toBe('40px');
        expect(svg.props().width).toBe('40px');
        expect(root.props().className).toBe('abt-spinner');
        expect(root.props().style).toEqual({ backgroundColor: 'magenta' });
    });
    it('should render with container height set by string', () => {
        const { svg, root } = setup({ height: '100px', size: '40px' });
        expect(svg.props().height).toBe('40px');
        expect(svg.props().width).toBe('40px');
        expect(root.props().className).toBe('abt-spinner');
        expect(root.props().style).toEqual({
            height: '100px',
            minHeight: '100px',
        });
    });
    it('should render with container height set by height function', () => {
        const getHeight = () => '250px';
        const { svg, root } = setup({ height: getHeight, size: '40px' });
        expect(svg.props().height).toBe('40px');
        expect(svg.props().width).toBe('40px');
        expect(root.props().className).toBe('abt-spinner');
        expect(root.props().style).toEqual({
            height: '250px',
            minHeight: '250px',
        });
    });
});
