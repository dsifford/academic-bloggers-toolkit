import { shallow, ShallowWrapper } from 'enzyme';
import toJSON, { OutputMapper } from 'enzyme-to-json';
import React from 'react';
import EditDialog from '..';

const defaultData: CSL.Data = {
    id: '12345',
    title: 'Test Title',
    type: 'article-journal',
};

const setup = (data = defaultData) => {
    const onSubmit = jest.fn();
    const component = shallow(<EditDialog data={data} onSubmit={onSubmit} />);
    return {
        component,
        instance: component.instance() as EditDialog,
        onSubmit,
    };
};

const mapper: OutputMapper = json => {
    if (json.props.meta) {
        delete json.props.meta;
    }
    return json;
};

const J = (component: ShallowWrapper) =>
    toJSON(component, { noKey: true, map: mapper });

describe('<EditDialog />', () => {
    const BASELINE = J(setup().component);
    it('should match baseline snapshot', () => {
        expect(BASELINE).toMatchSnapshot();
    });
    it('should submit', () => {
        const { component, onSubmit } = setup();
        const form = component.find('form');
        const preventDefault = jest.fn();
        form.simulate('submit', { preventDefault });
        expect(preventDefault).toHaveBeenCalled();
        expect(onSubmit).toHaveBeenCalledWith(defaultData);
    });
});
