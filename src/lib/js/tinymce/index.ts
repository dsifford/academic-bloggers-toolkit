import { EVENTS } from '../utils/Constants';
const { TINYMCE_READY, OPEN_REFERENCE_WINDOW } = EVENTS;

declare const tinyMCE: TinyMCE.MCE;
declare const wpActiveEditor: string;

tinyMCE.PluginManager.add('abt_main_menu', (editor: TinyMCE.Editor) => {

    // Fixes issues created if other plugins spawn separate TinyMCE instances
    if (editor.id !== wpActiveEditor) return;

    // Keyboard shortcuts
    editor.addShortcut(
        'meta+alt+r',
        'Insert Formatted Reference',
        dispatchEvent.bind(null, new CustomEvent(OPEN_REFERENCE_WINDOW))
    );

    // Event Handlers
    editor.on('init', () => {
        dispatchEvent(new CustomEvent(TINYMCE_READY));
    });

});
