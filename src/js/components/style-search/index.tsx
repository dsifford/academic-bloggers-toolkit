import { Dashicon, Spinner } from '@wordpress/components';
import { useEffect, useMemo, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import Fuse from 'fuse.js';
import { debounce } from 'lodash';
import AutoSuggest from 'react-autosuggest';

import { Style, StyleJSON } from 'stores/data';

import styles from './style.scss';

export interface SelectProps {
    styleJSON: StyleJSON;
}

export interface OwnProps {
    autofocus?: boolean;
    value: Style;
    onChange(style: Style): void;
}

type Props = OwnProps & SelectProps;

export default function StyleSearch(props: Props) {
    const [inputValue, setInputValue] = useState(props.value.label);
    const [suggestions, setSuggestions] = useState<Style[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fuse = useMemo(
        () =>
            new Fuse(props.styleJSON.styles, {
                shouldSort: true,
                threshold: 0.3,
                location: 0,
                distance: 50,
                maxPatternLength: 32,
                minMatchCharLength: 2,
                keys: [
                    {
                        name: 'label',
                        weight: 0.4,
                    },
                    {
                        name: 'value',
                        weight: 0.2,
                    },
                    {
                        name: 'shortTitle',
                        weight: 0.4,
                    },
                ],
            }),
        [props.styleJSON.styles],
    );

    const search = useMemo(
        () =>
            debounce((value: string) => {
                setSuggestions(fuse.search(value, { limit: 25 }));
                setIsLoading(false);
            }, 500),
        [props.styleJSON.styles],
    );

    const ref = useRef<{ input: HTMLInputElement }>(null);

    useEffect(() => {
        if (props.autofocus && ref.current) {
            ref.current.input.focus();
        }
    }, []);

    const setValidity = (isValid: boolean) => {
        if (ref.current) {
            ref.current.input.setCustomValidity(
                isValid
                    ? ''
                    : __('Invalid citation style', 'academic-bloggers-toolkit'),
            );
        }
    };

    return (
        <div>
            <AutoSuggest
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ref={ref as any}
                getSuggestionValue={({ label }) => label}
                inputProps={{
                    placeholder: __(
                        'Search for a citation style...',
                        'academic-bloggers-toolkit',
                    ),
                    required: true,
                    type: 'search',
                    value: inputValue,
                    onChange(_e, { newValue }) {
                        setInputValue(newValue);
                    },
                    onKeyDown(e) {
                        e.key === 'Enter' && e.preventDefault();
                    },
                }}
                renderInputComponent={
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (inputProps: any) => (
                        <div className={styles.inputContainer}>
                            <input {...inputProps} />
                            <div className={styles.inputIcon}>
                                {isLoading ? (
                                    <Spinner />
                                ) : (
                                    <Dashicon icon="search" />
                                )}
                            </div>
                        </div>
                    )
                }
                renderSuggestion={({ label }) => label}
                suggestions={suggestions}
                theme={styles}
                onSuggestionsClearRequested={() => setSuggestions([])}
                onSuggestionSelected={(_e, { suggestion }) => {
                    setValidity(true);
                    props.onChange(suggestion);
                }}
                onSuggestionsFetchRequested={({ reason, value }) => {
                    if (reason === 'input-changed') {
                        setIsLoading(true);
                        setValidity(false);
                        search(value);
                    }
                }}
            />
        </div>
    );
}
