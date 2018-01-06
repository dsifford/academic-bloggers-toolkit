import * as classNames from 'classnames';
import * as React from 'react';

import * as styles from './file-input.scss';

export interface Props extends React.AllHTMLAttributes<HTMLLabelElement> {
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

export default class FileInput extends React.Component<Props, {}> {
    static defaultProps: Props = {
        inputProps: {},
        text: 'Choose file...',
    };

    render(): JSX.Element {
        const {
            className,
            disabled,
            fill,
            inputProps,
            large,
            text,
            ...htmlProps
        } = this.props;

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
                <input
                    {...inputProps}
                    onChange={this.handleInputChange}
                    type="file"
                    disabled={disabled}
                />
                <span className={styles.fileUploadInput}>{text}</span>
            </label>
        );
    }

    private handleInputChange = (
        e: React.FormEvent<HTMLInputElement>,
    ): void => {
        if (this.props.inputProps && this.props.inputProps.onChange) {
            this.props.inputProps.onChange(e);
        }
    };
}
