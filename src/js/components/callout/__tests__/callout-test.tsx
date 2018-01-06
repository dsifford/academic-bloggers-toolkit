import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import * as React from 'react';

import Callout from '..';

describe('<Callout />', () => {
    it('should match snapshots', () => {
        let component = shallow(<Callout children="Hello world" />);
        expect(toJSON(component)).toMatchSnapshot();

        component = shallow(<Callout title="Hello!" children="Hello world" />);
        expect(toJSON(component)).toMatchSnapshot();

        component = shallow(<Callout children="" />);
        expect(toJSON(component)).toMatchSnapshot();

        component = shallow(
            <Callout intent="warning" children="Hello world" />,
        );
        expect(toJSON(component)).toMatchSnapshot();

        const dismiss = () => void 0;
        component = shallow(
            <Callout onDismiss={dismiss} children="Hello world" />,
        );
        expect(toJSON(component)).toMatchSnapshot();
    });
});
