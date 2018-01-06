import * as React from 'react';
import toJSON from 'enzyme-to-json';
import { shallow } from 'enzyme';

import ManualDataStore from 'stores/data/manual-data-store';
import Field from '../field';

const setup = () => {
    const meta = new ManualDataStore('webpage', '12345');
    const field = {
        label: 'Title',
        value: 'title',
    };
    const component = shallow(
        <Field field={field} meta={meta} onChange={jest.fn()} />,
    );
    return {
        component,
        meta,
    };
};

describe('<Field />', () => {
    it('should match snapshots', () => {
        const { component, meta } = setup();
        const before = toJSON(component);
        expect(before).toMatchSnapshot();

        meta.updateField('title', 'TEST');
        component.update();
        const after = toJSON(component);
        expect(after).toMatchDiffSnapshot(before);
    });
});
