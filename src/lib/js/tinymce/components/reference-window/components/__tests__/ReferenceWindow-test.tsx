jest.mock('../../../../../utils/Modal');
jest.mock('../../../../../utils/resolvers/');

import * as React from 'react';
import { mount } from 'enzyme';
import { ReferenceWindow } from '../ReferenceWindow';
import { getFromURL, getFromISBN } from '../../../../../utils/resolvers/';

const setup = () => {
    const component = mount(
        <ReferenceWindow />
    );
    const instance = component.instance() as any;
    return {
        component,
        instance,
    };
};

window['tinyMCE'] = {
    activeEditor: {
        windowManager: {
            alert: jest.fn(),
            close: jest.fn(),
            setParams: jest.fn(),
        }
    }
} as any;

const mocks = {
    alert: window['tinyMCE'].activeEditor.windowManager.alert,
    close: window['tinyMCE'].activeEditor.windowManager.close,
    getFromISBN: getFromISBN as jest.Mock<any>,
    getFromURL: getFromURL as jest.Mock<any>,
    setParams: window['tinyMCE'].activeEditor.windowManager.setParams,
};

describe('<ReferenceWindow />', () => {
    it('should render with manual reference input hidden', () => {
        const { component, instance } = setup();
        expect(instance.addManually).toBe(false);
        expect(component.find('ManualEntryContainer').length).toBe(0);
    });
    it('should toggle manual reference input when "addManually" is true', () => {
        const { component, instance } = setup();
        expect(component.find('ManualEntryContainer').length).toBe(0);
        instance.toggleAddManual();

        expect(instance.addManually).toBe(true);
        expect(instance.manualData.get('type')).toBe('webpage');
        expect(component.find('ManualEntryContainer').length).toBe(1);
    });
    it('should handle text field change', () => {
        const { instance } = setup();
        expect(instance.identifierList).toBe('');
        instance.changeIdentifiers('12345');
        expect(instance.identifierList).toBe('12345');
    });
    it('should toggle attachInline', () => {
        const { instance } = setup();
        expect(instance.attachInline).toBe(true);
        instance.toggleAttachInline();
        expect(instance.attachInline).toBe(false);
    });
    it('appendPMID()', () => {
        const { instance } = setup();
        expect(instance.identifierList).toBe('');
        instance.appendPMID('12345');
        expect(instance.identifierList).toBe('12345');
    });
    it('should toggle loading state', () => {
        const { instance } = setup();
        expect(instance.isLoading).toBe(false);
        instance.toggleLoadingState();
        expect(instance.isLoading).toBe(true);
        instance.toggleLoadingState(true);
        expect(instance.isLoading).toBe(true);
        instance.toggleLoadingState(false);
        expect(instance.isLoading).toBe(false);
    });
    it('should handle scroll events', () => {
        const { component } = setup();
        const stopPropagation = jest.fn();
        const preventDefault = jest.fn();
        component.first().simulate('wheel', { stopPropagation, preventDefault });
        expect(stopPropagation).toHaveBeenCalled();
        expect(preventDefault).toHaveBeenCalled();
    });
    it('should handle submit', () => {
        const { instance } = setup();
        const preventDefault = jest.fn();
        instance.handleSubmit({ preventDefault });
        expect(preventDefault).toHaveBeenCalled();
        expect(mocks.setParams).toHaveBeenCalled();
        expect(mocks.close).toHaveBeenCalled();
    });
    describe('handleAutocite()', () => {
        it('should handle a webpage with one author', async () => {
            mocks.getFromURL.mockImplementation(
                () => new Promise(res => res({
                    accessed: '2016-12-10T',
                    authors: [
                        { firstname: 'John', lastname: 'Doe' },
                    ],
                    content_title: 'Google Website',
                    issued: '2016-12-10T',
                    site_title: 'Google',
                    url: 'https://google.com',
                }))
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
                () => new Promise(res => res({
                    accessed: '2016-12-10T',
                    authors: [
                        {},
                    ],
                    content_title: 'Google Website',
                    issued: '2016-12-10T',
                    site_title: 'Google',
                    url: 'https://google.com',
                }))
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
            mocks.getFromURL.mockImplementation(
                () => new Promise((_, rej) => rej())
            );
            const { instance } = setup();
            instance.handleAutocite('webpage', 'testing');
        });
        it('should handle book autocites', async () => {
            mocks.getFromISBN.mockImplementation(
                () => new Promise(res => res({
                    authors: [
                        {},
                    ],
                    issued: '2016-12-10T',
                    'number-of-pages': 155,
                    publisher: 'Test Publisher',
                    title: 'Test Book',
                }))
            );
            const { instance } = setup();
            expect(instance.manualData.get('title')).toBeUndefined();
            await instance.handleAutocite('book', 'testing');
            expect(instance.manualData.get('title')).toBe('Test Book');
        });
        it('should handle book section autocites', async () => {
            mocks.getFromISBN.mockImplementation(
                () => new Promise(res => res({
                    authors: [
                        {},
                    ],
                    issued: '2016-12-10T',
                    'number-of-pages': 155,
                    publisher: 'Test Publisher',
                    title: 'Test Book Section',
                }))
            );
            const { instance } = setup();
            expect(instance.manualData.get('title')).toBeUndefined();
            await instance.handleAutocite('chapter', 'testing');
            expect(instance.manualData.get('container-title')).toBe('Test Book Section');
        });
        it('should handle book-type errors', () => {
            mocks.getFromISBN.mockImplementation(
                () => new Promise((_, rej) => rej())
            );
            const { instance } = setup();
            instance.handleAutocite('chapter', 'testing');
        });
    });
});
