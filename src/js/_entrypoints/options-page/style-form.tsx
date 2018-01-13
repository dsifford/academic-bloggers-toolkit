import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import * as AutoSuggest from 'react-autosuggest';

import Store from 'stores/data/style-store';
import DevTools from 'utils/devtools';
import parseCSL from 'utils/parse-csl';

import Callout from 'components/callout';
import FileInput from 'components/file-input';
import RadioGroup from 'components/radio-group';
import StyleInput from 'components/style-input';

type InputEvent = React.FormEvent<HTMLInputElement>;
type Suggestion = AutoSuggest.SuggestionSelectedEventData<ABT.CitationStyle>;

@observer
export default class StyleForm extends React.Component {
    readonly savedStyle: ABT.CitationStyle = top.ABT.options.citation_style;

    @observable errorMessage = '';

    store: Store;

    constructor(props: {}) {
        super(props);
        this.store = new Store(top.ABT.options.citation_style);
        this.store.rehydrate();
    }

    @action
    setErrorMessage = (message?: any): void => {
        this.errorMessage =
            message && typeof message === 'string' ? message : '';
    };

    handleTypeChange = (e: InputEvent): void => {
        const kind = e.currentTarget.value as ABT.StyleKind;
        this.store.style =
            kind === this.savedStyle.kind
                ? {
                      ...this.savedStyle,
                  }
                : {
                      kind,
                      label: '',
                      value: '',
                  };
    };

    handlePredefinedStyleChange = (_e: any, data: Suggestion): void => {
        this.store.style = {
            ...data.suggestion,
        };
    };

    handleUpload = async (e: InputEvent): Promise<void> => {
        const input = e.currentTarget;
        if (!input.files || !input.files[0]) {
            return;
        }
        try {
            this.store.style = await parseCSL(input.files[0]);
        } catch (err) {
            this.store.style = {
                ...this.store.style,
                value: '',
                label: '',
            };
            this.setErrorMessage(err.message);
            input.value = '';
        }
    };

    render(): JSX.Element {
        const labels = top.ABT.i18n.options_page;
        return (
            <>
                <DevTools position={{ left: 50, top: 40 }} />
                <RadioGroup
                    style={{
                        margin: '10px 0',
                    }}
                    value={this.store.kind}
                    label={labels.citation_style_type}
                    name="style_kind"
                    items={[
                        {
                            label: labels.predefined,
                            value: 'predefined',
                        },
                        {
                            label: labels.custom,
                            value: 'custom',
                        },
                    ]}
                    onChange={this.handleTypeChange}
                />
                <input
                    type="hidden"
                    name="style_value"
                    value={this.store.value}
                />
                <input
                    type="hidden"
                    name="style_label"
                    value={this.store.label}
                />
                {this.store.kind === 'predefined' && (
                    <StyleInput
                        currentStyle={this.store}
                        onSelected={this.handlePredefinedStyleChange}
                        styles={top.ABT.styles.styles}
                    />
                )}
                {this.store.kind === 'custom' && (
                    <>
                        <Callout onDismiss={this.setErrorMessage}>
                            {this.errorMessage}
                        </Callout>
                        <FileInput
                            fill
                            large
                            text={this.store.label || undefined}
                            inputProps={{
                                required: true,
                                onChange: this.handleUpload,
                                accept: '.csl',
                            }}
                        />
                    </>
                )}
            </>
        );
    }
}
