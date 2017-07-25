jest.mock('../../../utils/parsers/');
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import * as React from 'react';
import ImportDialog from '../';
import { RISParser, TeXParser } from '../../../utils/parsers/';

const mocks = {
    ris: (RISParser as any) as jest.Mock<{}>,
    tex: (TeXParser as any) as jest.Mock<{}>,
    submit: jest.fn(),
};

const setup = () => {
    const component = shallow(<ImportDialog onSubmit={mocks.submit} />);
    return {
        component,
        instance: component.instance() as ImportDialog,
    };
};

const createFile = (name: string, contents: string, kind = 'text/plain') =>
    new File([contents], name, { type: kind });

describe('<ImportDialog />', () => {
    it('should match snapshot', () => {
        const { component } = setup();
        expect(toJSON(component)).toMatchSnapshot();
    });
    it('should set error messages', () => {
        const { instance } = setup();
        expect(instance.errorMessage.get()).toBe('');

        instance.setErrorMessage('foo');
        expect(instance.errorMessage.get()).toBe('foo');

        instance.setErrorMessage();
        expect(instance.errorMessage.get()).toBe('');

        instance.setErrorMessage(() => 'foobar');
        expect(instance.errorMessage.get()).toBe('');
    });
    it('should handle submit', () => {
        const { component } = setup();
        const preventDefault = jest.fn();
        component.find('input[type="button"]').simulate('click', { preventDefault });
        expect(preventDefault).toHaveBeenCalledTimes(1);
        expect(mocks.submit).toHaveBeenCalledTimes(1);
    });
    describe('file upload test cases', () => {
        beforeEach(() => jest.resetAllMocks());
        test('valid RIS file with 0 references', async () => {
            const { instance } = setup();
            const parse = jest.fn().mockReturnValue([]);
            mocks.ris.mockImplementation(() => ({
                parse,
                unsupportedRefs: [],
            }));
            await instance.handleFileUpload(
                {
                    currentTarget: { files: [createFile('test.ris', 'testing')] },
                } as any,
            );
            expect(instance.payload.length).toBe(0);
            expect(instance.errorMessage.get()).toBe('The selected file could not be processed.');
        });
        test('valid RIS file with 1 reference', async () => {
            const { instance } = setup();
            const parse = jest.fn().mockReturnValue([{ title: 'title 1' }]);
            mocks.ris.mockImplementation(() => ({
                parse,
                unsupportedRefs: [],
            }));
            await instance.handleFileUpload(
                {
                    currentTarget: { files: [createFile('test.ris', 'testing')] },
                } as any,
            );
            expect(instance.payload.length).toBe(1);
            expect(instance.payload[0].title).toBe('title 1');
            expect(instance.errorMessage.get()).toBe('');
        });
        test('valid RIS file with 1 reference and 1 unsupported reference', async () => {
            const { instance } = setup();
            const parse = jest.fn().mockReturnValue([{ title: 'title 1' }]);
            mocks.ris.mockImplementation(() => ({
                parse,
                unsupportedRefs: ['12345'],
            }));
            await instance.handleFileUpload(
                {
                    currentTarget: { files: [createFile('test.ris', 'testing')] },
                } as any,
            );
            expect(instance.payload.length).toBe(1);
            expect(instance.payload[0].title).toBe('title 1');
            expect(instance.errorMessage.get()).toBe(
                'The following references were unable to be processed: 12345',
            );
        });
        test('valid bibtex file with 1 reference', async () => {
            const { instance } = setup();
            const parse = jest.fn().mockReturnValue([{ title: 'title 1' }]);
            mocks.tex.mockImplementation(() => ({
                parse,
                unsupportedRefs: [],
            }));
            await instance.handleFileUpload(
                {
                    currentTarget: { files: [createFile('test.bib', 'testing')] },
                } as any,
            );
            expect(instance.payload.length).toBe(1);
            expect(instance.payload[0].title).toBe('title 1');
            expect(instance.errorMessage.get()).toBe('');
        });
        test('invalid file type', async () => {
            const { instance } = setup();
            const parse = jest.fn().mockReturnValue([{ title: 'title 1' }]);
            await instance.handleFileUpload(
                {
                    currentTarget: { files: [createFile('test', 'testing')] },
                } as any,
            );
            expect(instance.payload.length).toBe(0);
            expect(instance.errorMessage.get()).toBe(
                'Invalid file extension. Extension must be .ris, .bib, or .bibtex',
            );
        });
        test('invalid RIS which throws error', async () => {
            const { instance } = setup();
            mocks.ris.mockImplementation(() => {
                throw new Error('unexpected error');
            });
            await instance.handleFileUpload(
                {
                    currentTarget: { files: [createFile('test.ris', 'testing')] },
                } as any,
            );
            expect(instance.payload.length).toBe(0);
            expect(instance.errorMessage.get()).toBe('The selected file could not be processed.');
        });
    });
});
