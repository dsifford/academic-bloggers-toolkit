import { IconButton, KeyboardShortcuts } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { displayShortcut } from '@wordpress/keycodes';

import Dialog from './dialog';

export default function AddReferenceDialog() {
    const { addReference } = useDispatch('abt/data');
    const [isOpen, setIsOpen] = useState(false);
    const toggleDialog = () => setIsOpen(!isOpen);
    return (
        <>
            <KeyboardShortcuts
                bindGlobal
                shortcuts={{ 'ctrl+alt+r': toggleDialog }}
            />
            <IconButton
                icon="insert"
                label={__('Add reference', 'academic-bloggers-toolkit')}
                shortcut={displayShortcut.primaryAlt('r')}
                onClick={toggleDialog}
            />
            <Dialog
                isOpen={isOpen}
                title={__('Add Reference', 'academic-bloggers-toolkit')}
                onClose={toggleDialog}
                onSubmit={data => {
                    addReference(data);
                    setIsOpen(false);
                }}
            />
        </>
    );
}
