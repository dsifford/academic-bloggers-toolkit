import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import React from 'react';

import ManualDataStore from '_legacy/stores/data/manual-data-store';
import MetaFields from '..';

const setup = (citationType: CSL.ItemType = 'webpage') => {
    const store = new ManualDataStore(citationType);
    const component = shallow(<MetaFields meta={store} />);
    return {
        component,
        instance: component.instance() as MetaFields,
    };
};

describe('<MetaFields />', () => {
    it('should match snapshots', () => {
        const { component } = setup();
        expect(
            toJSON(component, {
                noKey: true,
                map: json => ({
                    ...json,
                    props: { ...json.props, meta: '__SKIPPED__' },
                }),
            }),
        ).toMatchSnapshot();
    });
    it('should update fields', () => {
        const { instance } = setup();
        expect(instance.props.meta.fields.title).toBe('');
        instance.updateField({
            currentTarget: { dataset: { field: 'title' }, value: 'testing' },
        } as any);
        expect(instance.props.meta.fields.title).toBe('testing');
    });
    it('should throw errors when field ID is not set properly', () => {
        const { instance } = setup();
        expect(() =>
            instance.updateField({ currentTarget: { dataset: {} } } as any),
        ).toThrowError(ReferenceError);
    });
});
