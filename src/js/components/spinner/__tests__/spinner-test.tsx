import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import React from 'react';

import Spinner from '..';

describe('<Spinner />', () => {
    it('should match snapshots', () => {
        let component = shallow(<Spinner size="50px" />);
        expect(toJSON(component)).toMatchSnapshot();

        component = shallow(
            <Spinner size="100px" bgColor="magenta" height={100} overlay />,
        );
        expect(toJSON(component)).toMatchSnapshot();

        const heightFn = () => '100px';
        component = shallow(<Spinner size="100px" height={heightFn} />);
        expect(toJSON(component)).toMatchSnapshot();
    });
});
