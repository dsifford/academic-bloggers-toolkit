import { EVENTS } from 'utils/Constants';
const {
    TINYMCE_HIDDEN,
    TINYMCE_VISIBLE,
    // TOGGLE_PINNED_STATE,
} = EVENTS;

declare const tinyMCE: TinyMCE.MCE;
declare const wpActiveEditor: string;

tinyMCE.PluginManager.add('academic_bloggers_toolkit', (editor: TinyMCE.Editor) => {
    // Fixes issues created if other plugins spawn separate TinyMCE instances
    if (!wpActiveEditor || editor.id !== wpActiveEditor || !tinyMCE.editors.content) return;

    // Keyboard shortcuts
    // FIXME:
    // editor.addShortcut(
    //     'meta+alt+r',
    //     'Add Reference',
    //     dispatchEvent.bind(null, new CustomEvent(OPEN_REFERENCE_WINDOW))
    // );

    // FIXME:
    // editor.addShortcut(
    //     'meta+alt+p',
    //     'Pin Reference List',
    //     dispatchEvent.bind(null, new CustomEvent(TOGGLE_PINNED_STATE))
    // );

    editor.on('show', () => {
        dispatchEvent(new CustomEvent(TINYMCE_VISIBLE));
    });

    editor.on('hide', () => {
        dispatchEvent(new CustomEvent(TINYMCE_HIDDEN));
    });
});
