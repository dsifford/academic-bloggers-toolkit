jest.mock('utils/resolvers/');
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import * as React from 'react';

import { BookMeta, getFromISBN, getFromURL } from 'utils/resolvers/';
import AddDialog from '../';

const mocks = {
    getFromURL: getFromURL as jest.Mock<{}>,
    getFromISBN: getFromISBN as jest.Mock<{}>,
    onSubmit: jest.fn(),
};

const setup = () => {
    const component = shallow(<AddDialog onSubmit={mocks.onSubmit} />);
    const instance = component.instance() as AddDialog;
    return {
        component,
        instance,
    };
};

describe('<AddDialog />', () => {
    beforeEach(() => jest.resetAllMocks());
    it('should match snapshot', () => {
        const { component, instance } = setup();

        // Add with identifiers
        expect(toJSON(component)).toMatchSnapshot();

        // Add manually
        instance.addManually.set(true);
        component.update().render();
        expect(toJSON(component)).toMatchSnapshot();
    });
    it('should handle pubmed dialog submit', () => {
        const { component, instance } = setup();
        expect(instance.identifierList.get()).toBe('');
        const ButtonRow = component.find('ButtonRow');

        ButtonRow.simulate('pubmedDialogSubmit', '12345');
        expect(instance.identifierList.get()).toBe('12345');

        ButtonRow.simulate('pubmedDialogSubmit', '54321');
        expect(instance.identifierList.get()).toBe('12345,54321');

        // TODO: Handle duplicates
    });
    it('should handle identifier change', () => {
        const { component, instance } = setup();
        expect(instance.identifierList.get()).toBe('');
        const input = component.find('IdentifierInput');
        input.simulate('change', { currentTarget: { value: 'foo' } });
        expect(instance.identifierList.get()).toBe('foo');
    });
    it('should handle type change', () => {
        const { component, instance } = setup();
        instance.addManually.set(true);
        instance.manualData.set('randomThing', 'random value');
        instance.people.push({ family: 'Smith', given: 'Bob', type: 'editor' });
        expect([...instance.manualData.entries()]).toEqual([
            ['type', 'webpage'],
            ['randomThing', 'random value'],
        ]);
        expect(instance.people.length).toBe(2);
        const manualEntryContainer = component.find('ManualEntryContainer');
        manualEntryContainer.simulate('typeChange', 'book');
        expect([...instance.manualData.entries()]).toEqual([['type', 'book']]);
        expect(instance.people.length).toBe(1);
    });
    it('should toggle attach inline', () => {
        const { component, instance } = setup();
        expect(instance.attachInline.get()).toBe(true);

        const buttonRow = component.find('ButtonRow');
        buttonRow.simulate('attachInlineToggle');
        expect(instance.attachInline.get()).toBe(false);
    });
    it('should toggle loading state', () => {
        const { instance } = setup();
        expect(instance.isLoading.get()).toBe(false);

        instance.toggleLoadingState();
        expect(instance.isLoading.get()).toBe(true);

        instance.toggleLoadingState(true);
        expect(instance.isLoading.get()).toBe(true);

        instance.toggleLoadingState();
        expect(instance.isLoading.get()).toBe(false);
    });
    it('should toggle add manually state', () => {
        const { component, instance } = setup();
        expect(instance.addManually.get()).toBe(false);

        const buttonRow = component.find('ButtonRow');
        buttonRow.simulate('toggleManual');

        expect(instance.addManually.get()).toBe(true);
    });
    it('should handle submit', () => {
        const { component } = setup();
        const form = component.find('form');
        const preventDefault = jest.fn();
        form.simulate('submit', { preventDefault });
        expect(preventDefault).toHaveBeenCalledTimes(1);
        expect(mocks.onSubmit).toHaveBeenCalledTimes(1);
    });
    it('should capture input field', () => {
        const { instance } = setup();
        const input = document.createElement('input');
        const focusMock = jest.fn();
        input.focus = focusMock;
        instance.captureInputField(input);
        instance.appendPMID('12345');
        expect(focusMock).toHaveBeenCalled();
    });
    it('should skip capture of input field if null', () => {
        const { instance } = setup();
        instance.captureInputField(null);
        expect(instance.appendPMID).not.toThrow();
    });
    describe('autocite handler tests', () => {
        let component: any;
        let instance: any;
        let manualEntryContainer: any;
        const today = new Date().toISOString().substr(0, 10).replace(/-/g, '/');
        beforeEach(() => {
            jest.resetAllMocks();

            ({ component, instance } = setup());
            expect([...instance.manualData.entries()]).toEqual([['type', 'webpage']]);

            instance.addManually.set(true);
            component.update();

            manualEntryContainer = component.find('ManualEntryContainer');
        });
        test('webpage', async () => {
            const data: any = {
                accessed: '2003-01-02T05:00:00.000Z​​​​​',
                authors: [
                    {
                        firstname: 'John',
                        lastname: 'Doe',
                    },
                    {
                        firstname: 'Jane',
                        lastname: 'Smith',
                    },
                    {
                        firstname: undefined,
                        lastname: undefined,
                    },
                ],
                content_title: 'Test Title',
                issued: '2003-01-02T05:00:00.000Z​​​​​',
                site_title: 'Google',
                url: 'www.google.com',
            };
            const expected = [
                [
                    ['type', 'webpage'],
                    ['URL', 'www.google.com'],
                    ['accessed', '2003/01/02'],
                    ['container-title', 'Google'],
                    ['issued', '2003/01/02'],
                    ['title', 'Test Title'],
                ],
            ];
            mocks.getFromURL.mockReturnValueOnce(Promise.resolve(data));
            await manualEntryContainer.simulate('autoCite', 'webpage', 'www.google.com');
            expect([instance.manualData.entries()]).toEqual(expected);
        });
        test('book', async () => {
            instance.manualData.set('type', 'book');
            const data: BookMeta = {
                title: 'Test Title',
                'number-of-pages': '100',
                publisher: 'Test Publisher',
                issued: '2003/01/02',
                authors: [
                    {
                        family: 'Smith',
                        given: 'John',
                        type: 'author',
                    },
                    {
                        family: 'Doe',
                        given: 'Jane',
                        type: 'author',
                    },
                ],
            };
            const expected = [
                [
                    ['type', 'book'],
                    ['accessed', today],
                    ['issued', '2003/01/02'],
                    ['number-of-pages', '100'],
                    ['publisher', 'Test Publisher'],
                    ['title', 'Test Title'],
                ],
            ];
            mocks.getFromISBN.mockReturnValueOnce(Promise.resolve(data));
            await manualEntryContainer.simulate('autoCite', 'book', '1234567890');
            expect([instance.manualData.entries()]).toEqual(expected);
        });
        test('chapter', async () => {
            instance.manualData.set('type', 'chapter');
            const data: BookMeta = {
                title: 'Test Title',
                'number-of-pages': '100',
                publisher: 'Test Publisher',
                issued: '2003/01/02',
                authors: [
                    {
                        family: 'Smith',
                        given: 'John',
                        type: 'author',
                    },
                    {
                        family: 'Doe',
                        given: 'Jane',
                        type: 'author',
                    },
                ],
            };
            const expected = [
                [
                    ['type', 'chapter'],
                    ['accessed', today],
                    ['issued', '2003/01/02'],
                    ['number-of-pages', '100'],
                    ['publisher', 'Test Publisher'],
                    ['container-title', 'Test Title'],
                ],
            ];
            mocks.getFromISBN.mockReturnValueOnce(Promise.resolve(data));
            await manualEntryContainer.simulate('autoCite', 'chapter', '1234567890');
            expect([instance.manualData.entries()]).toEqual(expected);
        });
        it('should handle errors', async () => {
            mocks.getFromURL.mockReturnValueOnce(Promise.reject(new Error('Test error handling')));
            await manualEntryContainer.simulate('autoCite', 'webpage', 'www.google.com');
            mocks.getFromURL.mockReturnValueOnce(Promise.reject({}));
            await manualEntryContainer.simulate('autoCite', 'webpage', 'www.google.com');
            expect(true).toBe(true);
        });
    });
});
