import { Button } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import { Component, ComponentType, FormEvent } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import asDialog from 'components/as-dialog';
import DialogToolbar from 'components/dialog-toolbar';
import StyleSearch from 'gutenberg/components/style-search';
import { Style } from 'stores/data';

import styles from './style.scss';

namespace Dialog {
    export interface State {
        value: Style;
    }
    export interface SelectProps {
        style: Style;
    }
    export interface OwnProps extends asDialog.Props {
        onSubmit(style: Style): void;
    }
    export type Props = OwnProps & SelectProps;
}
class Dialog extends Component<Dialog.Props, Dialog.State> {
    state = {
        value: this.props.style,
    };
    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <StyleSearch
                    autofocus
                    value={this.state.value}
                    onChange={value => this.setState({ value })}
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

    private handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        this.props.onSubmit(this.state.value);
    };
}

export default compose([
    asDialog,
    withSelect<Dialog.SelectProps>(select => ({
        style: select('abt/data').getStyle(),
    })),
])(Dialog) as ComponentType<Dialog.OwnProps>;
