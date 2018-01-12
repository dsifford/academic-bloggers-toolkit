import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import * as AutoSuggest from 'react-autosuggest';

import Store from 'stores/data/style-store';
import DevTools from 'utils/devtools';
import readFile from 'utils/read-file';

import Callout from 'components/callout';
import FileInput from 'components/file-input';
import RadioGroup from 'components/radio-group';
import StyleInput from 'components/style-input';

type InputEvent = React.FormEvent<HTMLInputElement>;
type Suggestion = AutoSuggest.SuggestionSelectedEventData<ABT.CitationStyle>;

@observer
export default class StyleForm extends React.Component {
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
        const savedStyle = top.ABT.options.citation_style;
        const kind = e.currentTarget.value as ABT.StyleKind;
        const isCustom = kind === 'custom';
        let label: string;
        let value: string;
        if (isCustom) {
            label = savedStyle.kind === 'custom' ? savedStyle.label : '';
            value = savedStyle.kind === 'custom' ? savedStyle.value : '';
        } else {
            label = savedStyle.kind === 'predefined' ? savedStyle.label : '';
            value = savedStyle.kind === 'predefined' ? savedStyle.value : '';
        }
        this.store.style = {
            kind,
            label,
            value,
        };
    };

    handlePredefinedStyleChange = (_e: any, data: Suggestion): void => {
        this.store.style = {
            ...data.suggestion,
            kind: 'predefined',
        };
    };

    handleUpload = async (e: InputEvent): Promise<void> => {
        const input = e.currentTarget;
        if (!input.files || !input.files[0]) {
            return;
        }
        try {
            const content = await readFile(input.files[0], 'Text');
            const xml = new DOMParser().parseFromString(
                content,
                'application/xml',
            );
            const error = xml.querySelector('parsererror');
            const label = xml.querySelector('info title');
            if (error || !label || !label.textContent) {
                throw new Error(top.ABT.i18n.errors.filetype_error);
            }
            this.store.style = {
                ...this.store.style,
                value: content,
                label: label.textContent,
            };
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
