import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import React from 'react';

import ManualDataStore from 'stores/data/manual-data-store';
import ContributorList from '..';

const setup = (citationType: CSL.ItemType = 'webpage') => {
    const store = new ManualDataStore(citationType);
    const component = shallow(
        <ContributorList
            citationType={store.citationType}
            people={store.people}
        />,
    );
    return {
        component,
        instance: component.instance() as ContributorList,
    };
};

describe('<ContributorList />', () => {
    const BASELINE = toJSON(setup().component);
    it('should match baseline snapshots', () => {
        expect(BASELINE).toMatchSnapshot();
    });
    it('should add and remove contributors', () => {
        const { component, instance } = setup();
        const addButton = component.find('Button').last();
        addButton.simulate('click');
        expect(toJSON(component, { noKey: true })).toMatchDiffSnapshot(
            BASELINE,
        );

        instance.remove({ currentTarget: { dataset: { index: '0' } } } as any);
        component.update();
        expect(toJSON(component, { noKey: true })).toMatchDiffSnapshot(
            BASELINE,
        );
    });
    it('should throw an error when contributor index is not a number', () => {
        const { instance } = setup();
        expect(() =>
            instance.remove({
                currentTarget: { dataset: { index: 'uh-oh!' } },
            } as any),
        ).toThrowError(TypeError);
    });
});
