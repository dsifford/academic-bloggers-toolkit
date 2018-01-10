import * as React from 'react';
import toJSON from 'enzyme-to-json';
import { shallow } from 'enzyme';

import ActionBar from '..';

describe('<ActionBar />', () => {
    it('should render with default alignment', () => {
        const component = shallow(
            <ActionBar>
                <button>One</button>
                <button>Two</button>
                <button>Three</button>
            </ActionBar>,
        );
        expect(toJSON(component)).toMatchSnapshot();
    });
    it('should render with separator', () => {
        const component = shallow(
            <ActionBar>
                <button>One</button>
                <ActionBar.Separator />
                <button>Two</button>
            </ActionBar>,
        );
        expect(toJSON(component)).toMatchSnapshot();
    });
    it('should render with right alignment', () => {
        const component = shallow(
            <ActionBar align="right">
                <button>One</button>
                <button>Two</button>
                <button>Three</button>
            </ActionBar>,
        );
        expect(toJSON(component)).toMatchSnapshot();
    });
    it('should render a separator', () => {
        const component = shallow(<ActionBar.Separator />);
        expect(toJSON(component)).toMatchSnapshot();
    });
});
