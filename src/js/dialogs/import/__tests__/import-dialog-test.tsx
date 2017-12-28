import { mount, shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import * as React from 'react';
import ImportDialog from '..';

const mocks = {
    submit: jest.fn(),
};

const setup = () => {
    const component = shallow(<ImportDialog onSubmit={mocks.submit} />);
    return {
        component,
        instance: component.instance() as ImportDialog,
    };
};

const createContents = (kind: 'ris' | 'bibtex', length: number): string => {
    switch (kind) {
        case 'ris':
            return Array(length)
                .fill('')
                .reduce((s, _, i) => {
                    return [
                        s,
                        `TY  - ICOMM`,
                        `TI  - Test ${i + 1}`,
                        `SP  - ${i + 1}`,
                        `EP  - ${i + 1}`,
                        `ER  - `,
                    ].join('\n');
                }, '');
        case 'bibtex':
            return Array(length)
                .fill('')
                .reduce((s, _, i) => {
                    return [
                        s,
                        `@article{id_${i + 1},`,
                        `   title = {Test ${i + 1}},`,
                        `}
                    `,
                    ].join('\n');
                }, '');
        default:
            throw new Error('Test Error');
    }
};

const createFile = (name: string, contents: string, kind = 'text/plain') =>
    new File([contents], name, { type: kind });

describe('<ImportDialog />', () => {
    it('should match snapshot', () => {
        const { component } = setup();
        expect(toJSON(component)).toMatchSnapshot();
    });
    it('should mount', () => {
        const component = mount(<ImportDialog onSubmit={mocks.submit} />);
        expect(component.isEmptyRender()).toBeFalsy();
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
        component
            .find('Button')
            .at(1)
            .simulate('click', { preventDefault });
        expect(preventDefault).toHaveBeenCalledTimes(1);
        expect(mocks.submit).toHaveBeenCalledTimes(1);
    });
    it('should set file name and value', () => {
        const { instance } = setup();
        expect(instance.file.name.get()).toBe('');
        expect(instance.file.value.get()).toBe('');

        instance.setFile({ name: 'foo' });
        expect(instance.file.name.get()).toBe('foo');
        expect(instance.file.value.get()).toBe('');

        instance.setFile({ value: 'bar' });
        expect(instance.file.name.get()).toBe('');
        expect(instance.file.value.get()).toBe('bar');

        instance.setFile();
        expect(instance.file.name.get()).toBe('');
        expect(instance.file.value.get()).toBe('');
    });
    it('should open file on click', () => {
        const { component, instance } = setup();
        const click = jest.fn();
        instance.inputField = {
            click,
        } as any;
        component
            .find('Button')
            .at(0)
            .simulate('click');
        expect(click).toHaveBeenCalled();
    });
    describe('file upload test cases', () => {
        beforeEach(() => jest.resetAllMocks());
        it('valid RIS file with 0 references', async () => {
            const { instance } = setup();
            await instance.handleFileUpload({
                currentTarget: { files: [createFile('test.ris', '')] },
            } as any);
            expect(instance.payload.length).toBe(0);
            expect(instance.errorMessage.get()).toBe(
                'The selected file could not be processed',
            );
        });
        it('valid RIS file with 1 reference', async () => {
            const { instance } = setup();
            await instance.handleFileUpload({
                currentTarget: {
                    files: [createFile('test.ris', createContents('ris', 1))],
                },
            } as any);
            expect(instance.payload.length).toBe(1);
            expect(instance.payload[0].title).toBe('Test 1');
            expect(instance.errorMessage.get()).toBe('');
        });
        it('valid bibtex file with 0 references', async () => {
            const { instance } = setup();
            await instance.handleFileUpload({
                currentTarget: { files: [createFile('test.bib', '')] },
            } as any);
            expect(instance.payload.length).toBe(0);
            expect(instance.errorMessage.get()).toBe(
                'The selected file could not be processed',
            );
        });
        it('valid bibtex file with 1 reference', async () => {
            const { instance } = setup();
            await instance.handleFileUpload({
                currentTarget: {
                    files: [
                        createFile('test.bib', createContents('bibtex', 1)),
                    ],
                },
            } as any);
            expect(instance.payload.length).toBe(1);
            expect(instance.payload[0].title).toBe('Test 1');
            expect(instance.errorMessage.get()).toBe('');
        });
        it('invalid file type', async () => {
            const { instance } = setup();
            await instance.handleFileUpload({
                currentTarget: { files: [createFile('test', 'testing')] },
            } as any);
            expect(instance.payload.length).toBe(0);
            expect(instance.errorMessage.get()).toBe(
                'Invalid file extension. Extension must be .ris, .bib, or .bibtex',
            );
        });
        it('invalid RIS which throws error', async () => {
            const { instance } = setup();
            await instance.handleFileUpload({
                currentTarget: { files: [createFile('test.ris', 'testing')] },
            } as any);
            expect(instance.payload.length).toBe(0);
            expect(instance.errorMessage.get()).toBe(
                'The selected file could not be processed',
            );
        });
    });
});
