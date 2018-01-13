jest.mock('utils/parse-csl');

import * as React from 'react';
import toJSON from 'enzyme-to-json';
import { shallow } from 'enzyme';

import PCSL from 'utils/parse-csl';
import StyleForm from '../style-form';

const parseCSL = PCSL as jest.Mock;

const setup = () => {
    const component = shallow(<StyleForm />);
    return {
        component,
        store: (component.instance() as StyleForm).store,
    };
};

describe('<StyleForm />', () => {
    it('should match snapshots', () => {
        const { component } = setup();
        expect(toJSON(component)).toMatchSnapshot();
    });
    it('should handle type change', () => {
        const { component, store } = setup();
        const radioGroup = component.find('RadioGroup');
        expect(store.kind).toBe('predefined');
        expect(store.label).toBeTruthy();
        expect(store.value).toBeTruthy();

        radioGroup.simulate('change', { currentTarget: { value: 'custom' } });
        expect(store.kind).toBe('custom');
        expect(store.label).toBeFalsy();
        expect(store.value).toBeFalsy();

        radioGroup.simulate('change', {
            currentTarget: { value: 'predefined' },
        });
        expect(store.kind).toBe('predefined');
        expect(store.label).toBeTruthy();
        expect(store.value).toBeTruthy();
    });
    it('should handle predefined style change', () => {
        const { component, store } = setup();
        const input = component.find('StyleInput');
        const afterStyle: ABT.CitationStyle = {
            kind: 'predefined',
            label: 'Hello World',
            value: 'hello-world',
        };
        expect(store.style).not.toEqual(afterStyle);

        input.simulate('selected', null, { suggestion: afterStyle });
        expect(store.style).toEqual(afterStyle);
    });
    it('should set and clear error messages', () => {
        const { component } = setup();
        const instance = component.instance() as StyleForm;
        expect(instance.errorMessage).toBe('');

        instance.setErrorMessage('Foo');
        expect(instance.errorMessage).toBe('Foo');

        instance.setErrorMessage();
        expect(instance.errorMessage).toBe('');
    });
    describe('file upload tests', () => {
        let { component, store } = setup();
        let instance = component.instance() as StyleForm;
        beforeEach(() => {
            ({ component, store } = setup());
            store.style = {
                kind: 'custom',
                label: '',
                value: '',
            };
            component.update();
            instance = component.instance() as StyleForm;
            jest.resetAllMocks();
        });
        it('no files associated with change event', async () => {
            await instance.handleUpload({ currentTarget: {} } as any);
            expect(instance.errorMessage).toBe('');

            await instance.handleUpload({
                currentTarget: { files: [] },
            } as any);
            expect(instance.errorMessage).toBe('');
        });
        it('parses a good file', async () => {
            const newStyle: ABT.CitationStyle = {
                kind: 'custom',
                label: 'Test Label',
                value: '<CSL XML HERE>',
            };
            parseCSL.mockReturnValueOnce(Promise.resolve(newStyle));
            await instance.handleUpload({
                currentTarget: { files: ['Assume this is a good file'] },
            } as any);
            expect(instance.errorMessage).toBe('');
            expect(store.style).toEqual(newStyle);
        });
        it('gracefully handles bad files', async () => {
            const errorMessage = 'Invalid file type';
            parseCSL.mockReturnValueOnce(
                Promise.reject(new Error(errorMessage)),
            );
            await instance.handleUpload({
                currentTarget: { files: ['Assume this is a bad file'] },
            } as any);
            expect(instance.errorMessage).toBe(errorMessage);
            expect(store.style.label).toBe('');
            expect(store.style.value).toBe('');
        });
    });
});
