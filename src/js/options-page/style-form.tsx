import { RadioControl } from '@wordpress/components';
import { Component, FormEvent } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { parseCSL } from 'utils/file';

import AdminNotice from 'components/admin-notice';
import FileInput from 'components/file-input';
import { StyleSearch } from 'components/style-search';
import { Style, StyleJSON } from 'stores/data';
import { StyleKind } from 'stores/data/constants';

import styles from './style-form.scss';

declare const ABT: {
    options: {
        citation_style: Style;
    };
    styles: StyleJSON;
};

const SAVED_STYLE = ABT.options.citation_style;

export namespace StyleForm {
    export interface State {
        style: Style;
        errorMessage: string;
    }
}
export default class StyleForm extends Component<{}, StyleForm.State> {
    state = {
        style: SAVED_STYLE,
        errorMessage: '',
    };

    render(): JSX.Element {
        const { errorMessage, style } = this.state;
        return (
            <div className={styles.form}>
                <input
                    name="citation_style"
                    type="hidden"
                    value={JSON.stringify(style)}
                />
                <RadioControl<StyleKind>
                    className={styles.radioGroup}
                    label={__(
                        'Citation style type',
                        'academic-bloggers-toolkit',
                    )}
                    onChange={kind =>
                        this.setState({
                            style:
                                kind === SAVED_STYLE.kind
                                    ? { ...SAVED_STYLE }
                                    : { kind, label: '', value: '' },
                        })
                    }
                    selected={style.kind}
                    options={[
                        {
                            // translators: Label for radio group for choosing a "predefined" citation style.
                            label: __(
                                'Predefined',
                                'academic-bloggers-toolkit',
                            ),
                            value: StyleKind.PREDEFINED,
                        },
                        {
                            // translators: Label for radio group for choosing a "custom" citation style.
                            label: __('Custom', 'academic-bloggers-toolkit'),
                            value: StyleKind.CUSTOM,
                        },
                    ]}
                />
                {style.kind === 'predefined' && (
                    <StyleSearch
                        styleJSON={ABT.styles}
                        value={style}
                        onChange={s => this.setState({ style: s })}
                    />
                )}
                {style.kind === 'custom' && (
                    <>
                        {errorMessage && (
                            <AdminNotice
                                kind="error"
                                isDismissible
                                onDismiss={() =>
                                    this.setState({ errorMessage: '' })
                                }
                            >
                                <strong>
                                    {__('Error', 'academic-bloggers-toolkit')}:{' '}
                                </strong>
                                {errorMessage}
                            </AdminNotice>
                        )}
                        <FileInput
                            fill
                            large
                            text={style.label}
                            inputProps={{
                                required: true,
                                onChange: this.handleUpload,
                                accept:
                                    'application/vnd.citationstyles.style+xml,.csl',
                            }}
                        />
                    </>
                )}
            </div>
        );
    }

    private handleUpload = async (
        e: FormEvent<HTMLInputElement>,
    ): Promise<void> => {
        const input = e.currentTarget;
        if (!input.files || !input.files[0]) {
            return;
        }
        try {
            const style = await parseCSL(input.files[0]);
            this.setState({ style });
        } catch (err) {
            this.setState(state => ({
                ...state,
                errorMessage: err.message,
                style: { ...state.style, label: '', value: '' },
            }));
            input.value = '';
        }
    };
}
