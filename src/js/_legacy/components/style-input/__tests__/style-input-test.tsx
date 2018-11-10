import React from 'react';
import { shallow } from 'enzyme';

import StyleInput from '..';

const styles: ABT.CitationStyle[] = [
    {
        kind: 'predefined',
        label: 'Style One',
        value: 'style-one',
    },
    {
        kind: 'predefined',
        label: 'Style Two',
        value: 'style-two',
    },
];

const setup = (currentStyleIdx: number = 0) => {
    const onSelected = jest.fn();
    const component = shallow<StyleInput>(
        <StyleInput
            currentStyle={styles[currentStyleIdx]}
            styles={styles}
            onSelected={onSelected}
        />,
    );
    return {
        component,
        instance: component.instance() as StyleInput,
        onSelected,
    };
};

describe('<StyleInput />', () => {
    it('should mount', () => {
        const { component } = setup();
        const state = {
            value: 'Style One',
            suggestions: [],
        };
        expect(component.state()).toEqual(state);
    });
    it('should fetch suggestions', () => {
        const { component } = setup();
        const Autosuggest = component.find('Autosuggest');
        Autosuggest.simulate('suggestionsFetchRequested', { value: 'Style T' });
        const suggestions = [
            {
                kind: 'predefined',
                label: 'Style Two',
                value: 'style-two',
            },
        ];
        expect(component.state().suggestions).toEqual(suggestions);

        Autosuggest.simulate('suggestionsFetchRequested', { value: '' });
        expect(component.state().suggestions).toEqual([]);
    });
    it('should clear suggestions', () => {
        const { component } = setup();
        component.setState({ suggestions: [...styles] });
        const Autosuggest = component.find('Autosuggest');
        Autosuggest.simulate('suggestionsClearRequested');
        expect(component.state().suggestions).toEqual([]);
    });
    it('should handle enter key', () => {
        const { instance } = setup();
        const preventDefault = jest.fn();
        instance.handleEnterKey({ key: 'Space', preventDefault } as any);
        instance.handleEnterKey({ key: 'Enter', preventDefault } as any);
        expect(preventDefault).toHaveBeenCalledTimes(1);
    });
    it('should handle change', () => {
        const { component, instance } = setup();
        const mock = jest.fn();
        const input = {
            setCustomValidity: mock,
        };
        instance.input = input as any;
        instance.handleChange(null, { newValue: 'Style One' });
        expect(mock).toHaveBeenLastCalledWith('');
        expect(component.state().value).toBe('Style One');
        jest.resetAllMocks();
        instance.handleChange(null, { newValue: 'Style O' });
        expect(mock).toHaveBeenLastCalledWith('Invalid predefined style type');
        expect(component.state().value).toBe('Style O');
        jest.resetAllMocks();
        instance.handleChange(null, {});
        expect(mock).toHaveBeenLastCalledWith('Invalid predefined style type');
        expect(component.state().value).toBe('');
    });
    it('should get suggestion value', () => {
        const style: ABT.CitationStyle = {
            kind: 'predefined',
            label: 'Foo Bar',
            value: 'foobar',
        };
        expect(StyleInput.getSuggestionValue(style)).toEqual('Foo Bar');
    });
    it('should bind refs', () => {
        const { instance } = setup();
        expect(instance.input).toBeUndefined();
        instance.bindRefs(null);
        expect(instance.input).toBeUndefined();
        instance.bindRefs({ foo: 'bar' });
        expect(instance.input).toBeUndefined();
        instance.bindRefs({ input: 'BINGO' });
        expect(instance.input).toBe('BINGO');
    });
});
