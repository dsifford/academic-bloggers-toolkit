import { RadioControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import AdminNotice from 'components/admin-notice';
import FileInput from 'components/file-input';
import StyleSearch from 'components/style-search';
import { Style, StyleJSON } from 'stores/data';
import { StyleKind } from 'stores/data/constants';
import { parseCSL } from 'utils/file';

import styles from './style-form.scss';

declare const ABT: {
    options: {
        citation_style: Style;
    };
    styles: StyleJSON;
};

const SAVED_STYLE = ABT.options.citation_style;

export default function StyleForm() {
    const [style, setStyle] = useState(SAVED_STYLE);
    const [errorMessage, setErrorMessage] = useState('');

    return (
        <div className={styles.form}>
            <input
                name="citation_style"
                type="hidden"
                value={JSON.stringify(style)}
            />
            <RadioControl
                className={styles.radioGroup}
                label={__('Citation style type', 'academic-bloggers-toolkit')}
                options={[
                    {
                        // translators: Label for radio group for choosing a "predefined" citation style.
                        label: __('Predefined', 'academic-bloggers-toolkit'),
                        value: StyleKind.PREDEFINED,
                    },
                    {
                        // translators: Label for radio group for choosing a "custom" citation style.
                        label: __('Custom', 'academic-bloggers-toolkit'),
                        value: StyleKind.CUSTOM,
                    },
                ]}
                selected={style.kind}
                onChange={kind =>
                    kind &&
                    setStyle(
                        kind === SAVED_STYLE.kind
                            ? { ...SAVED_STYLE }
                            : { kind, label: '', value: '' },
                    )
                }
            />
            {style.kind === 'predefined' && (
                <StyleSearch
                    styleJSON={ABT.styles}
                    value={style}
                    onChange={setStyle}
                />
            )}
            {style.kind === 'custom' && (
                <>
                    {errorMessage && (
                        <AdminNotice
                            isDismissible
                            kind="error"
                            onDismiss={() => setErrorMessage('')}
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
                        inputProps={{
                            required: true,
                            accept:
                                'application/vnd.citationstyles.style+xml,.csl',
                            async onChange(e) {
                                const input = e.currentTarget;
                                if (!input.files || !input.files[0]) {
                                    return;
                                }
                                try {
                                    const parsedStyle = await parseCSL(
                                        input.files[0],
                                    );
                                    setStyle(parsedStyle);
                                } catch (err) {
                                    setStyle({
                                        ...style,
                                        label: '',
                                        value: '',
                                    });
                                    setErrorMessage(err.message);
                                    input.value = '';
                                }
                            },
                        }}
                        text={style.label}
                    />
                </>
            )}
        </div>
    );
}
