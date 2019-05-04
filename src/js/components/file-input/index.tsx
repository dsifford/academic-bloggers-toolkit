import { HTMLProps } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';

import styles from './style.scss';

interface Props extends HTMLProps<HTMLLabelElement> {
    /**
     * Whether the file input is non-interactive.
     * Setting this to `true` will automatically disable the child input too.
     */
    disabled?: boolean;

    /**
     * Whether the file input should take up the full width of its container.
     */
    fill?: boolean;

    /**
     * Whether the file input should be size large.
     */
    large?: boolean;

    /**
     * The props to pass to the child input.
     * `disabled` will be ignored in favor of the top-level prop.
     * `type` will be ignored, because the input _must_ be `type="file"`.
     * Pass `onChange` here to be notified when the user selects a file.
     */
    inputProps?: React.HTMLProps<HTMLInputElement>;

    /**
     * The text to display.
     * @default "Choose file..."
     */
    text?: string;
}

export default function FileInput({
    className,
    disabled,
    fill,
    large,
    inputProps,
    text = __('Choose file...', 'academic-bloggers-toolkit'),
    ...htmlProps
}: Props) {
    const rootClasses = classNames(
        styles.fileInput,
        {
            [styles.disabled]: disabled,
            [styles.fill]: fill,
            [styles.large]: large,
        },
        className,
    );
    return (
        <label {...htmlProps} className={rootClasses}>
            <input {...inputProps} disabled={disabled} type="file" />
            <span className={styles.fileUploadInput}>{text}</span>
        </label>
    );
}
