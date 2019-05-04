import { createRef, HTMLProps, RefObject, useEffect } from '@wordpress/element';
import classNames from 'classnames';

import styles from './style.scss';

interface Props extends HTMLProps<HTMLTextAreaElement> {
    inputRef?: RefObject<HTMLTextAreaElement>;
}

function TextareaAutosize({ inputRef, className, ...props }: Props) {
    const ref = inputRef || createRef<HTMLTextAreaElement>();

    useEffect(() => {
        const { current: textarea } = ref;
        if (textarea) {
            const offset = textarea.offsetHeight - textarea.clientHeight;
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight + offset}px`;
        }
    });

    return (
        <textarea
            {...props}
            ref={ref}
            className={classNames(styles.textarea, className)}
            rows={1}
        />
    );
}

export default TextareaAutosize;
