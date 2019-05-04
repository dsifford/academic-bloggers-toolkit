import { Button } from '@wordpress/components';
import { useEffect, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import asDialog, { DialogProps } from 'components/as-dialog';
import DialogToolbar from 'components/dialog-toolbar';
import TextareaAutosize from 'components/textarea-autosize';

import styles from './style.scss';

interface Props extends DialogProps {
    onSubmit(value: string): void;
}

function AddFootnoteDialog({ onSubmit }: Props) {
    const [value, setValue] = useState('');

    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                onSubmit(value);
            }}
        >
            <TextareaAutosize
                inputRef={inputRef}
                value={value}
                onChange={e => setValue(e.currentTarget.value)}
                onKeyDown={e => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        onSubmit(value);
                    }
                }}
            />
            <DialogToolbar>
                <div className={styles.toolbar}>
                    <Button isLarge isPrimary type="submit">
                        {__('Add footnote', 'academic-bloggers-toolkit')}
                    </Button>
                </div>
            </DialogToolbar>
        </form>
    );
}

export default asDialog(AddFootnoteDialog);
