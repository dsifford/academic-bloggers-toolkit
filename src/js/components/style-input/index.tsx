import * as React from 'react';
import * as AutoSuggest from 'react-autosuggest';

import * as styles from './style-input.scss';

interface Props {
    currentStyle: ABT.CitationStyle;
    styles: ABT.CitationStyle[];
    onSelected: AutoSuggest.OnSuggestionSelected<ABT.CitationStyle>;
}

interface State {
    suggestions: ABT.CitationStyle[];
    value: string;
}

export default class StyleInput extends React.Component<Props, State> {
    static readonly INVALID_MESSAGE = top.ABT.i18n.errors
        .invalid_predefined_style;

    static getSuggestionValue = ({ label }: ABT.CitationStyle): string => label;

    readonly styleMap: Map<string, ABT.CitationStyle>;

    input: HTMLInputElement;

    constructor(props: Props) {
        super(props);
        this.styleMap = new Map([
            ...props.styles.map(
                style => [style.label, style] as [string, ABT.CitationStyle],
            ),
        ]);
        this.state = {
            value: props.currentStyle.label,
            suggestions: [],
        };
    }

    handleSuggestionsClear = (): void => {
        this.setState(prevState => ({ ...prevState, suggestions: [] }));
    };

    handleSuggestionsFetch = ({ value }: any): void => {
        this.setState(prevState => ({
            ...prevState,
            suggestions: this.getSuggestions(value),
        }));
    };

    handleChange = (_e: any, { newValue }: any): void => {
        this.input.setCustomValidity(
            this.styleMap.has(newValue) ? '' : StyleInput.INVALID_MESSAGE,
        );
        this.setState(state => ({
            ...state,
            value: newValue || '',
        }));
    };

    handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    bindRefs = (autosuggest?: any): void => {
        if (autosuggest && autosuggest.input) {
            this.input = autosuggest.input;
        }
    };

    render(): JSX.Element {
        const inputProps: AutoSuggest.InputProps<string> = {
            required: true,
            id: 'citation-style-input',
            type: 'search',
            value: this.state.value,
            onChange: this.handleChange,
            onKeyDown: this.handleEnterKey,
            className: `${styles.input} ${styles.large} ${styles.fill}`,
        };
        return (
            <AutoSuggest
                ref={this.bindRefs}
                theme={styles}
                suggestions={this.state.suggestions as any}
                onSuggestionsFetchRequested={this.handleSuggestionsFetch}
                onSuggestionsClearRequested={this.handleSuggestionsClear}
                onSuggestionSelected={this.props.onSelected as any}
                getSuggestionValue={StyleInput.getSuggestionValue as any}
                renderSuggestion={StyleInput.getSuggestionValue as any}
                inputProps={inputProps}
            />
        );
    }

    private getSuggestions = (value: string): ABT.CitationStyle[] => {
        const inputValue = value.trim().toLowerCase();
        return inputValue.length === 0
            ? []
            : this.props.styles.filter(style =>
                  style.label.toLowerCase().startsWith(inputValue),
              );
    };
}
