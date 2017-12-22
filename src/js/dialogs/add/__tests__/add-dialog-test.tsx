// jest.mock('utils/resolvers/');
// import { mount, shallow } from 'enzyme';
// import toJSON from 'enzyme-to-json';
// import { observable } from 'mobx';
// import * as React from 'react';

// import { getFromISBN, getFromURL } from 'utils/resolvers';
// import AddDialog from '..';

// const mocks = {
//     getFromURL: getFromURL as jest.Mock<{}>,
//     getFromISBN: getFromISBN as jest.Mock<{}>,
//     onSubmit: jest.fn(),
// };

// const setup = () => {
//     const component = shallow(
//         <AddDialog onSubmit={mocks.onSubmit} focusTrapPaused={observable(false)} />,
//     );
//     const instance = component.instance() as AddDialog;
//     return {
//         component,
//         instance,
//     };
// };

// const mountSetup = () => {
//     const component = mount(
//         <AddDialog onSubmit={mocks.onSubmit} focusTrapPaused={observable(false)} />,
//     );
//     const instance = component.instance() as AddDialog;
//     return {
//         component,
//         instance,
//     };
// };

// describe('<AddDialog />', () => {
//     beforeEach(() => jest.resetAllMocks());
//     it('should match snapshot', () => {
//         const { component, instance } = mountSetup();

//         // Add with identifiers
//         expect(toJSON(component, { noKey: true })).toMatchSnapshot();

//         // Add manually
//         instance.addManually.set(true);
//         component.update();
//         expect(toJSON(component, { noKey: true })).toMatchSnapshot();

//         // With loading spinner
//         instance.currentDialog.set('');
//         instance.isLoading.set(true);
//         component.update();
//         expect(toJSON(component, { noKey: true })).toMatchSnapshot();
//     });
//     it('should handle identifier change', () => {
//         const { component, instance } = setup();
//         expect(instance.identifierList.get()).toBe('');
//         const input = component.find('IdentifierInput');
//         input.simulate('change', { currentTarget: { value: 'foo' } });
//         expect(instance.identifierList.get()).toBe('foo');
//     });
//     it('should toggle attach inline', () => {
//         const { component, instance } = setup();
//         expect(instance.attachInline.get()).toBe(true);

//         const buttonRow = component.find('ButtonRow');
//         buttonRow.simulate('attachInlineToggle');
//         expect(instance.attachInline.get()).toBe(false);
//     });
//     it('should toggle loading state', () => {
//         const { instance } = setup();
//         expect(instance.isLoading.get()).toBe(false);

//         instance.toggleLoadingState();
//         expect(instance.isLoading.get()).toBe(true);

//         instance.toggleLoadingState(true);
//         expect(instance.isLoading.get()).toBe(true);

//         instance.toggleLoadingState();
//         expect(instance.isLoading.get()).toBe(false);
//     });
//     it('should toggle add manually state', () => {
//         const { component, instance } = setup();
//         expect(instance.addManually.get()).toBe(false);

//         const buttonRow = component.find('ButtonRow');
//         buttonRow.simulate('toggleManual');

//         expect(instance.addManually.get()).toBe(true);
//     });
//     it('should handle submit', () => {
//         const { component } = setup();
//         const form = component.find('form');
//         const preventDefault = jest.fn();
//         form.simulate('submit', { preventDefault });
//         expect(preventDefault).toHaveBeenCalledTimes(1);
//         expect(mocks.onSubmit).toHaveBeenCalledTimes(1);
//     });
//     it('should capture input field', () => {
//         const { instance } = setup();
//         const input = document.createElement('input');
//         const focusMock = jest.fn();
//         input.focus = focusMock;
//         instance.captureInputField(input);
//         instance.appendPMID('12345');
//         expect(focusMock).toHaveBeenCalled();
//     });
//     it('should skip capture of input field if null', () => {
//         const { instance } = setup();
//         instance.captureInputField(null);
//         expect(instance.appendPMID).not.toThrow();
//     });
//     it('should handle dialog toggles', () => {
//         const { component, instance } = mountSetup();
//         expect(instance.currentDialog.get()).toBe('');
//         expect(component.props().focusTrapPaused.get()).toBe(false);

//         instance.openPubmedDialog();
//         component.update();
//         expect(instance.currentDialog.get()).toBe('PUBMED');
//         expect(component.props().focusTrapPaused.get()).toBe(true);

//         instance.closePubmedDialog();
//         component.update();
//         expect(component.props().focusTrapPaused.get()).toBe(false);
//     });
//     describe('autocite handler tests', () => {
//         let component: any;
//         let instance: any;
//         const today = new Date()
//             .toISOString()
//             .slice(0, 10)
//             .replace(/-/g, '/');
//         beforeEach(() => {
//             jest.resetAllMocks();

//             ({ component, instance } = setup());
//             expect([...instance.manualData.entries()]).toEqual([['type', 'webpage']]);
//         });
//         it('webpage', async () => {
//             const data: any = {
//                 accessed: '2003-01-02T05:00:00.000Z​​​​​',
//                 authors: [
//                     {
//                         firstname: 'John',
//                         lastname: 'Doe',
//                     },
//                     {
//                         firstname: 'Jane',
//                         lastname: 'Smith',
//                     },
//                     {
//                         firstname: undefined,
//                         lastname: undefined,
//                     },
//                 ],
//                 content_title: 'Test Title',
//                 issued: '2003-01-02T05:00:00.000Z​​​​​',
//                 site_title: 'Google',
//                 url: 'www.google.com',
//             };
//             const expected = [
//                 [
//                     ['type', 'webpage'],
//                     ['URL', 'www.google.com'],
//                     ['accessed', '2003/01/02'],
//                     ['container-title', 'Google'],
//                     ['issued', '2003/01/02'],
//                     ['title', 'Test Title'],
//                 ],
//             ];
//             mocks.getFromURL.mockReturnValue(Promise.resolve(data));
//             await instance.handleAutocite('webpage', 'https://google.com');
//             expect([instance.manualData.entries()]).toEqual(expected);
//         });
//         it('book', async () => {
//             instance.manualData.set('type', 'book');
//             const data: BookMeta = {
//                 title: 'Test Title',
//                 'number-of-pages': '100',
//                 publisher: 'Test Publisher',
//                 issued: '2003/01/02',
//                 authors: [
//                     {
//                         family: 'Smith',
//                         given: 'John',
//                         type: 'author',
//                     },
//                     {
//                         family: 'Doe',
//                         given: 'Jane',
//                         type: 'author',
//                     },
//                 ],
//             };
//             const expected = [
//                 [
//                     ['type', 'book'],
//                     ['accessed', today],
//                     ['issued', '2003/01/02'],
//                     ['number-of-pages', '100'],
//                     ['publisher', 'Test Publisher'],
//                     ['title', 'Test Title'],
//                 ],
//             ];
//             mocks.getFromISBN.mockReturnValue(Promise.resolve(data));
//             await instance.handleAutocite('book', '1111111111');
//             expect([instance.manualData.entries()]).toEqual(expected);
//         });
//         it('chapter', async () => {
//             instance.manualData.set('type', 'chapter');
//             const data: BookMeta = {
//                 title: 'Test Title',
//                 'number-of-pages': '100',
//                 publisher: 'Test Publisher',
//                 issued: '2003/01/02',
//                 authors: [
//                     {
//                         family: 'Smith',
//                         given: 'John',
//                         type: 'author',
//                     },
//                     {
//                         family: 'Doe',
//                         given: 'Jane',
//                         type: 'author',
//                     },
//                 ],
//             };
//             const expected = [
//                 [
//                     ['type', 'chapter'],
//                     ['accessed', today],
//                     ['issued', '2003/01/02'],
//                     ['number-of-pages', '100'],
//                     ['publisher', 'Test Publisher'],
//                     ['container-title', 'Test Title'],
//                 ],
//             ];
//             mocks.getFromISBN.mockReturnValue(Promise.resolve(data));
//             await instance.handleAutocite('chapter', '1111111111');
//             expect([instance.manualData.entries()]).toEqual(expected);
//         });
//         it('should handle errors', async () => {
//             mocks.getFromURL.mockReturnValueOnce(Promise.reject(new Error('Test error handling')));
//             await instance.handleAutocite('webpage', 'https://google.com');
//             expect(component.instance().errorMessage.get()).toBe('Test error handling');
//             instance.setErrorMessage();
//             expect(component.instance().errorMessage.get()).toBe('');
//         });
//     });
// });
