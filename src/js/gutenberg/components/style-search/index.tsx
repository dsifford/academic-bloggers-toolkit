import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import { Component, ComponentType, createRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import Fuse from 'fuse.js';
import _ from 'lodash';
import AutoSuggest, {
    InputProps,
    OnSuggestionSelected as OSS,
    SuggestionsFetchRequested as SFR,
} from 'react-autosuggest';

import { Style, StyleJSON } from 'stores/data';

import styles from './style.scss';

namespace StyleSearch {
    export interface State {
        inputValue: string;
        suggestions: Style[];
    }
    export interface SelectProps {
        styleJSON: StyleJSON;
    }
    export interface OwnProps {
        value: Style;
        onChange(style: Style): void;
    }
    export type Props = OwnProps & SelectProps;
}
class StyleSearch extends Component<StyleSearch.Props, StyleSearch.State> {
    state: StyleSearch.State = {
        inputValue: this.props.value.label,
        suggestions: [],
    };

    private search: SFR = _.debounce(
        ({ value }) => {
            this.setState({
                suggestions: this.fuse.search(value).slice(0, 10),
            });
        },
        500,
        {
            leading: true,
            trailing: true,
        },
    );

    private inputProps: InputProps<Style> = {
        placeholder: __(
            'Search for a citation style...',
            'academic-bloggers-toolkit',
        ),
        required: true,
        type: 'search',
        value: '',
        onChange: (_e, { method, newValue }) => {
            switch (method) {
                case 'escape':
                    return this.setState({ inputValue: '' });
                default:
                    return this.setState({ inputValue: newValue });
            }
        },
        onKeyDown: e => {
            if (e.key === 'Enter') {
                e.preventDefault();
            }
        },
    };

    private ref = createRef<{ input: HTMLInputElement }>();

    render() {
        return (
            <AutoSuggest<Style>
                ref={this.ref as any}
                suggestions={this.state.suggestions}
                getSuggestionValue={this.getSuggestionValue}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                onSuggestionSelected={this.onSuggestionSelected}
                renderSuggestion={this.getSuggestionValue}
                inputProps={{
                    ...this.inputProps,
                    value: this.state.inputValue,
                }}
                theme={styles}
            />
        );
    }

    private get fuse() {
        return new Fuse(this.props.styleJSON.styles, {
            shouldSort: true,
            threshold: 0.3,
            location: 0,
            distance: 50,
            maxPatternLength: 32,
            minMatchCharLength: 2,
            keys: [
                {
                    name: 'label',
                    weight: 0.7,
                },
                {
                    name: 'value',
                    weight: 0.3,
                },
            ],
        });
    }

    private getSuggestionValue = (suggestion: Style) => suggestion.label;

    private onSuggestionSelected: OSS<Style> = (_e, { suggestion }) => {
        this.setValidity();
        this.props.onChange(suggestion);
    };

    private onSuggestionsClearRequested = () => {
        this.setState({ suggestions: [] as Style[] });
    };

    private onSuggestionsFetchRequested: SFR = params => {
        if (params.reason === 'input-changed') {
            this.setValidity(false);
        }
        this.search(params);
    };

    private setValidity = (valid = true) => {
        if (this.ref.current) {
            this.ref.current.input.setCustomValidity(
                valid
                    ? ''
                    : __('Invalid citation style', 'academic-bloggers-toolkit'),
            );
        }
    };
}

export default compose([
    withSelect<StyleSearch.SelectProps>(select => ({
        styleJSON: select('abt/data').getCitationStyles(),
    })),
])(StyleSearch) as ComponentType<StyleSearch.OwnProps>;
