import { Button } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import asDialog, { DialogProps } from 'components/as-dialog';
import DialogToolbar from 'components/dialog-toolbar';
import StyleSearch from 'gutenberg/components/style-search';
import { Style } from 'stores/data';

import styles from './style.scss';

interface Props extends DialogProps {
    onSubmit(style: Style): void;
}

function Dialog({ onSubmit }: Props) {
    const style = useSelect(select => select('abt/data').getStyle());
    const [value, setValue] = useState(style);
    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                onSubmit(value);
            }}
        >
            <StyleSearch
                autofocus
                value={value}
                onChange={selected => setValue(selected)}
            />
            <DialogToolbar>
                <div className={styles.toolbar}>
                    <Button isLarge isPrimary type="submit">
                        {__('Confirm', 'academic-bloggers-toolkit')}
                    </Button>
                </div>
            </DialogToolbar>
        </form>
    );
}

export default asDialog(Dialog);
