import { Button } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import asDialog from 'components/as-dialog';
import DialogToolbar from 'components/dialog-toolbar';
import StyleSearch from 'gutenberg/components/style-search';
import { Style } from 'stores/data';

import styles from './style.scss';

interface SelectProps {
    style: Style;
}

interface OwnProps extends asDialog.Props {
    onSubmit(style: Style): void;
}

type Props = OwnProps & SelectProps;

function Dialog({ onSubmit, style }: Props) {
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
                    <Button isPrimary isLarge type="submit">
                        {__('Confirm', 'academic-bloggers-toolkit')}
                    </Button>
                </div>
            </DialogToolbar>
        </form>
    );
}

export default compose(
    asDialog,
    withSelect<SelectProps, OwnProps>(select => ({
        style: select('abt/data').getStyle(),
    })),
)(Dialog);
