import { Button } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { Component, ComponentType, FormEvent } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import asDialog from 'gutenberg/components/as-dialog';
import DialogToolbar from 'gutenberg/components/dialog-toolbar';
import TextareaAutosize from 'gutenberg/components/textarea-autosize';

import styles from './style.scss';

// TODO: need to add autofocus here

namespace Dialog {
    export interface State {
        value: string;
    }
    export interface OwnProps extends asDialog.Props {
        onSubmit(value: string): void;
    }
    export type Props = OwnProps;
}
class Dialog extends Component<Dialog.Props, Dialog.State> {
    state = {
        value: '',
    };
    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <TextareaAutosize
                    value={this.state.value}
                    onKeyDown={e => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            this.props.onSubmit(this.state.value);
                        }
                    }}
                    onChange={e =>
                        this.setState({ value: e.currentTarget.value })
                    }
                />
                <DialogToolbar>
                    <div className={styles.toolbar}>
                        <Button isPrimary isLarge type="submit">
                            {__('Add footnote', 'academic-bloggers-toolkit')}
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

export default compose([asDialog])(Dialog) as ComponentType<Dialog.OwnProps>;
