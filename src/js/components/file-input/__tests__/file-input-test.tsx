import * as React from 'react';
import toJSON from 'enzyme-to-json';
import { shallow } from 'enzyme';

import FileInput, { Props } from '..';

type TestProps = Pick<Props, 'disabled' | 'fill' | 'large' | 'text'>;

const setup = (props?: TestProps) => {
    const onChange = jest.fn();
    const component = shallow(
        <FileInput {...props} inputProps={{ onChange }} />,
    );
    return {
        component,
        onChange,
    };
};

describe('<FileInput />', () => {
    const BASE_COMPONENT = toJSON(setup().component);
    it('should match snapshots', () => {
        expect(BASE_COMPONENT).toMatchSnapshot();

        const { component: disabledVariant } = setup({ disabled: true });
        expect(toJSON(disabledVariant)).toMatchDiffSnapshot(BASE_COMPONENT);

        const { component: fillVariant } = setup({ fill: true });
        expect(toJSON(fillVariant)).toMatchDiffSnapshot(BASE_COMPONENT);

        const { component: largeVariant } = setup({ large: true });
        expect(toJSON(largeVariant)).toMatchDiffSnapshot(BASE_COMPONENT);

        const { component: textVariant } = setup({ text: 'Hello World' });
        expect(toJSON(textVariant)).toMatchDiffSnapshot(BASE_COMPONENT);
    });
    it('should handle change', () => {
        const { component, onChange } = setup();
        let input = component.find('input').first();
        input.simulate('change', 'foo');
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith('foo');

        const noInputChangeHandler = shallow(<FileInput inputProps={{}} />);
        input = noInputChangeHandler.find('input').first();
        expect(() => input.simulate('change', 'foo')).not.toThrowError();
    });
});
