import { Button, ToggleControl } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { Component, ComponentType } from '@wordpress/element';

import asDialog, { DialogProps } from 'gutenberg/components/as-dialog';
import DialogToolbar from 'gutenberg/components/dialog-toolbar';
import IdentifierReferenceForm from 'gutenberg/components/reference-form-identifier';
import ManualReferenceForm from 'gutenberg/components/reference-form-manual';

import styles from './style.scss';

interface Props {
    onClose: () => void;
    onSubmit: (data: CSL.Data) => void;
    isOpen: boolean;
}

interface State {
    isAddingManually: boolean;
    isBusy: boolean;
}

const FORM_ID = 'add-reference-form';

class Dialog extends Component<Props & DialogProps, State> {
    state: State = {
        isAddingManually: false,
        isBusy: false,
    };

    render() {
        const { onClose, onSubmit, createErrorNotice } = this.props;
        const { isAddingManually, isBusy } = this.state;
        return (
            <>
                {!isAddingManually && (
                    <IdentifierReferenceForm
                        id={FORM_ID}
                        onSubmit={onSubmit}
                        onClose={onClose}
                        onError={(message: string) =>
                            createErrorNotice(message)
                        }
                        setBusy={(busy: boolean) =>
                            this.setState({ isBusy: busy })
                        }
                    />
                )}
                {isAddingManually && (
                    <ManualReferenceForm
                        withAutocite
                        id={FORM_ID}
                        onSubmit={onSubmit}
                    />
                )}
                <DialogToolbar>
                    <div className={styles.toolbar}>
                        <ToggleControl
                            label="Add manually"
                            checked={isAddingManually}
                            onChange={this.handleToggleManually}
                        />
                        <Button
                            isPrimary
                            isLarge
                            isBusy={isBusy}
                            disabled={isBusy}
                            type="submit"
                            form={FORM_ID}
                        >
                            Add Reference
                        </Button>
                    </div>
                </DialogToolbar>
            </>
        );
    }

    private handleToggleManually = (isAddingManually: boolean) =>
        this.setState(this.state.isBusy ? null : { isAddingManually });
}

export default compose([asDialog])(Dialog) as ComponentType<Props>;
