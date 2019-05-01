import { IconButton, KeyboardShortcuts } from '@wordpress/components';
import { withDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { displayShortcut } from '@wordpress/keycodes';

import Dialog from './dialog';

interface DispatchProps {
    addReference(data: CSL.Data): void;
}

type Props = DispatchProps;

function AddReferenceDialog({ addReference }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDialog = () => setIsOpen(!isOpen);
    return (
        <>
            <KeyboardShortcuts
                bindGlobal
                shortcuts={{ 'ctrl+alt+r': toggleDialog }}
            />
            <IconButton
                shortcut={displayShortcut.primaryAlt('r')}
                icon="insert"
                label={__('Add reference', 'academic-bloggers-toolkit')}
                onClick={toggleDialog}
            />
            <Dialog
                title={__('Add Reference', 'academic-bloggers-toolkit')}
                isOpen={isOpen}
                onClose={toggleDialog}
                onSubmit={data => {
                    addReference(data);
                    setIsOpen(false);
                }}
            />
        </>
    );
}

export default withDispatch<DispatchProps>(dispatch => ({
    addReference(data) {
        dispatch('abt/data').addReference(data);
    },
}))(AddReferenceDialog);
