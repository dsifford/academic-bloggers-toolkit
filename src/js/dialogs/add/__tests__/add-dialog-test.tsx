// FIXME: rewrite this test suite
jest.mock('../../../utils/resolvers/');

import { mount } from 'enzyme';
import * as React from 'react';
import ReferenceWindow from '../';
import { getFromISBN, getFromURL } from '../../../utils/resolvers/';

const setup = () => {
    const spy = jest.fn();
    const component = mount(<ReferenceWindow onSubmit={spy} />);
    const instance = component.instance() as any;
    return {
        component,
        instance,
        spy,
    };
};

const mocks = {
    getFromISBN: getFromISBN as jest.Mock<any>,
    getFromURL: getFromURL as jest.Mock<any>,
};

describe('<ReferenceWindow />', () => {
    it('should render with manual reference input hidden', () => {
        const { component, instance } = setup();
        expect(instance.addManually.get()).toBe(false);
        expect(component.find('ManualEntryContainer').length).toBe(0);
    });
    it('should toggle manual reference input when "addManually" is true', () => {
        const { component, instance } = setup();
        expect(component.find('ManualEntryContainer').length).toBe(0);
        instance.toggleAddManual();

        expect(instance.addManually.get()).toBe(true);
        expect(instance.manualData.get('type')).toBe('webpage');
        expect(component.find('ManualEntryContainer').length).toBe(1);
    });
    it('should handle text field change', () => {
        const { instance } = setup();
        expect(instance.identifierList.get()).toBe('');
        instance.changeIdentifiers({ currentTarget: { value: '12345' } });
        expect(instance.identifierList.get()).toBe('12345');
    });
    it('should toggle attachInline', () => {
        const { instance } = setup();
        expect(instance.attachInline.get()).toBe(true);
        instance.toggleAttachInline();
        expect(instance.attachInline.get()).toBe(false);
    });
    it('appendPMID()', () => {
        const { instance } = setup();
        expect(instance.identifierList.get()).toBe('');
        instance.appendPMID('12345');
        expect(instance.identifierList.get()).toBe('12345');
    });
    it('should toggle loading state', () => {
        const { instance } = setup();
        expect(instance.isLoading.get()).toBe(false);
        instance.toggleLoadingState();
        expect(instance.isLoading.get()).toBe(true);
        instance.toggleLoadingState(true);
        expect(instance.isLoading.get()).toBe(true);
        instance.toggleLoadingState(false);
        expect(instance.isLoading.get()).toBe(false);
    });
    it('should handle submit', () => {
        const { instance, spy } = setup();
        const preventDefault = jest.fn();
        instance.handleSubmit({ preventDefault });
        expect(preventDefault).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledTimes(1);
    });
    describe('handleAutocite()', () => {
        it('should handle a webpage with one author', async () => {
            mocks.getFromURL.mockImplementation(
                () =>
                    new Promise(res =>
                        res({
                            accessed: '2016-12-10T',
                            authors: [{ firstname: 'John', lastname: 'Doe' }],
                            content_title: 'Google Website',
                            issued: '2016-12-10T',
                            site_title: 'Google',
                            url: 'https://google.com',
                        })
                    )
            );
            const { instance } = setup();
            expect(instance.manualData.get('title')).toBeUndefined();
            expect(instance.manualData.get('issued')).toBeUndefined();
            expect(instance.people[0].family).toBe('');
            await instance.handleAutocite('webpage', 'testing');
            expect(instance.manualData.get('title')).toBe('Google Website');
            expect(instance.manualData.get('issued')).toBe('2016/12/10');
            expect(instance.people[0].family).toBe('Doe');
        });
        it('should handle a webpage with no authors', async () => {
            mocks.getFromURL.mockImplementation(
                () =>
                    new Promise(res =>
                        res({
                            accessed: '2016-12-10T',
                            authors: [{}],
                            content_title: 'Google Website',
                            issued: '2016-12-10T',
                            site_title: 'Google',
                            url: 'https://google.com',
                        })
                    )
            );
            const { instance } = setup();
            expect(instance.manualData.get('title')).toBeUndefined();
            expect(instance.manualData.get('issued')).toBeUndefined();
            expect(instance.people[0].family).toBe('');
            await instance.handleAutocite('webpage', 'testing');
            expect(instance.manualData.get('title')).toBe('Google Website');
            expect(instance.manualData.get('issued')).toBe('2016/12/10');
            expect(instance.people[0].family).toBe('');
        });
        it('should handle webpage type errors', async () => {
            mocks.getFromURL.mockImplementation(() => new Promise((_, rej) => rej()));
            const { instance } = setup();
            instance.handleAutocite('webpage', 'testing');
        });
        it('should handle book autocites', async () => {
            mocks.getFromISBN.mockImplementation(
                () =>
                    new Promise(res =>
                        res({
                            authors: [{}],
                            issued: '2016-12-10T',
                            'number-of-pages': 155,
                            publisher: 'Test Publisher',
                            title: 'Test Book',
                        })
                    )
            );
            const { instance } = setup();
            expect(instance.manualData.get('title')).toBeUndefined();
            await instance.handleAutocite('book', 'testing');
            expect(instance.manualData.get('title')).toBe('Test Book');
        });
        it('should handle book section autocites', async () => {
            mocks.getFromISBN.mockImplementation(
                () =>
                    new Promise(res =>
                        res({
                            authors: [{}],
                            issued: '2016-12-10T',
                            'number-of-pages': 155,
                            publisher: 'Test Publisher',
                            title: 'Test Book Section',
                        })
                    )
            );
            const { instance } = setup();
            expect(instance.manualData.get('title')).toBeUndefined();
            await instance.handleAutocite('chapter', 'testing');
            expect(instance.manualData.get('container-title')).toBe('Test Book Section');
        });
        it('should handle book-type errors', () => {
            mocks.getFromISBN.mockImplementation(() => new Promise((_, rej) => rej()));
            const { instance } = setup();
            instance.handleAutocite('chapter', 'testing');
        });
    });
});
