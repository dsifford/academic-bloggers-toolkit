import React from 'react';
import toJSON from 'enzyme-to-json';
import { shallow } from 'enzyme';

import RadioGroup from '..';

const setup = () => {
    const onChange = jest.fn();
    const component = shallow(
        <RadioGroup
            name="test"
            label="Test Radio Group"
            value="one"
            items={[
                {
                    label: 'One',
                    value: 'one',
                },
                {
                    label: 'Two',
                    value: 'two',
                },
            ]}
            onChange={onChange}
        />,
    );
    return {
        component,
        onChange,
    };
};

// Stub out `Date.now()` so that keys and id's remain constant in
// testing environment.
Date.now = jest.fn(() => 12345);

describe('<RadioGroup />', () => {
    it('should match snapshots', () => {
        const { component } = setup();
        expect(toJSON(component)).toMatchSnapshot();
    });
});
