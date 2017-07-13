jest.mock('../result-list');
jest.mock('../paginate');
jest.mock('../../../utils/resolvers/');

import { shallow } from 'enzyme';
import * as React from 'react';
import PubmedDialog from '../';
import { pubmedQuery } from '../../../utils/resolvers/';

const mocks = {
    pmq: pubmedQuery as jest.Mock<any>,
};

const setup = () => {
    const spy = jest.fn();
    const component = shallow(<PubmedDialog onSubmit={spy} />);
    const instance = component.instance() as any;
    return {
        component,
        instance,
    };
};

describe('<PubmedWindow />', () => {
    beforeEach(() => jest.resetAllMocks());
    it('should render with loading spinner', () => {
        const { component, instance } = setup();
        instance.toggleLoading();
        expect(instance.isLoading.get()).toBe(true);
        expect(component.find('Spinner').length).toBe(1);
    });
    it('should update query on input change', () => {
        const { component, instance } = setup();
        const input = component.find('input[type="text"]');
        expect((input as any).props().value).toBe('');
        input.simulate('change', { currentTarget: { value: 'TESTING' } });
        expect((component as any).find('input[type="text"]').props().value).toBe('TESTING');
    });
    it('should handle queries', async () => {
        mocks.pmq.mockReturnValue(Promise.resolve([{ title: 'testing' }]))
        const { instance, component } = setup();
        await instance.sendQuery({ preventDefault: () => void 0})
        expect((component as any).instance().results.slice()).toEqual([{ title: 'testing' }]);
    });
});
