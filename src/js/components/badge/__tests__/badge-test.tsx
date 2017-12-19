import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import * as React from 'react';

import Badge from '..';

describe('<Badge />', () => {
    test('defaults < 99', () => {
        let component = shallow(<Badge count={5} />);
        expect(toJSON(component)).toMatchSnapshot();

        component = shallow(<Badge count={50} />);
        expect(toJSON(component)).toMatchSnapshot();

        component = shallow(<Badge count={98} />);
        expect(toJSON(component)).toMatchSnapshot();
    });
    test('with color set < 99', () => {
        let component = shallow(<Badge count={5} color="magenta" />);
        expect(toJSON(component)).toMatchSnapshot();

        component = shallow(<Badge count={50} color="#ff00ff" />);
        expect(toJSON(component)).toMatchSnapshot();

        component = shallow(<Badge count={98} color="rgba(150, 150, 150, 0.9)" />);
        expect(toJSON(component)).toMatchSnapshot();
    });
    test('count >= 99', () => {
        let component = shallow(<Badge count={99} />);
        expect(toJSON(component)).toMatchSnapshot();

        component = shallow(<Badge count={175} color="magenta" />);
        expect(toJSON(component)).toMatchSnapshot();
    });
});
