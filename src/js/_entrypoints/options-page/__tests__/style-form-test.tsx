import * as React from 'react';
import toJSON from 'enzyme-to-json';
import { shallow } from 'enzyme';

import StyleForm from '../style-form';

const setup = () => {
    const component = shallow(<StyleForm />);
    return {
        component,
    };
};

describe('<StyleForm />', () => {
    it('should match snapshots', () => {
        const { component } = setup();
        expect(toJSON(component)).toMatchSnapshot();
    });
});
