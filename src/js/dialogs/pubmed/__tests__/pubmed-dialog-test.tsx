jest.mock('../result-list');
jest.mock('../paginate');
jest.mock('utils/resolvers/');

import { shallow } from 'enzyme';
import * as React from 'react';
import { pubmedQuery } from 'utils/resolvers/';
import PubmedDialog, { placeholderGenerator } from '../';

const mocks = {
    pmq: pubmedQuery as jest.Mock<any>,
};

const setup = () => {
    const spy = jest.fn();
    const component = shallow(<PubmedDialog onSubmit={spy} />);
    const instance = component.instance() as any;
    return {
        component,
        instance: instance as PubmedDialog,
    };
};

describe('<PubmedWindow />', () => {
    it('should render with loading spinner', () => {
        const { component, instance } = setup();
        instance.toggleLoading();
        component.update();
        expect(instance.isLoading.get()).toBe(true);
    });
    it('should update query on input change', () => {
        const { component, instance } = setup();
        const input = component.find('input[type="text"]');
        expect((input as any).props().value).toBe('');
        input.simulate('change', { currentTarget: { value: 'TESTING' } });
        expect(instance.query.get()).toBe('TESTING');
    });
    it('should loop through placeholders', () => {
        const ph = placeholderGenerator();
        const firstValue = ph.next().value;
        for (const _ of Array(9)) {
            ph.next();
        }
        expect(firstValue).toEqual(ph.next().value);
    });
    it('should set error', () => {
        const { component, instance } = setup();
        expect(instance.errorMessage.get()).toBe('');
        expect(component.find('Callout').prop('children')).toBeFalsy();

        instance.setError();
        expect(instance.errorMessage.get()).toBe('');
        expect(component.find('Callout').prop('children')).toBeFalsy();

        instance.setError('Hello World');
        expect(instance.errorMessage.get()).toBe('Hello World');

        const testfn: any = () => void 0;
        instance.setError(testfn);
        expect(instance.errorMessage.get()).toBe('');
        expect(component.find('Callout').prop('children')).toBeFalsy();
    });
    describe('Query handler tests', () => {
        beforeEach(() => jest.resetAllMocks());
        test('query that goes as expected', async () => {
            mocks.pmq.mockReturnValue(Promise.resolve([{ title: 'testing' }]));
            const { instance, component } = setup();
            const mockEvent: any = {
                preventDefault: jest.fn(),
            };
            await instance.sendQuery(mockEvent);
            expect((component as any).instance().results.slice()).toEqual([{ title: 'testing' }]);
            expect(mockEvent.preventDefault).toHaveBeenCalled();
        });
        test('query that returns 0-length result', async () => {
            mocks.pmq.mockReturnValue(Promise.resolve([]));
            const { instance, component } = setup();
            const mockEvent: any = {
                preventDefault: jest.fn(),
            };
            await instance.sendQuery(mockEvent);
            expect((component as any).instance().results.slice()).toEqual([]);
            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(instance.errorMessage.get()).toEqual('Your search returned 0 results');
        });
        test('query that throws an error', async () => {
            mocks.pmq.mockReturnValue(Promise.reject(new Error('Hello world')));
            const { instance, component } = setup();
            const mockEvent: any = {
                preventDefault: jest.fn(),
            };
            await instance.sendQuery(mockEvent);
            expect((component as any).instance().results.slice()).toEqual([]);
            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(instance.errorMessage.get()).toEqual('Hello world');
        });
    });
});
