import { EVENTS } from './utils/Constants';
const { TINYMCE_READY, OPEN_REFERENCE_WINDOW } = EVENTS;

declare var tinyMCE: TinyMCE.MCE;
declare const ABT_meta: ABT.AdminMeta;
declare const wpActiveEditor: string;

tinyMCE.PluginManager.add('abt_main_menu', (editor: TinyMCE.Editor, url: string) => {

    // Fixes issues created if other plugins spawn separate TinyMCE instances
    if (editor.id !== wpActiveEditor) return;

    editor.addShortcut(
        'meta+alt+r',
        'Insert Formatted Reference',
        dispatchEvent.bind(null, new CustomEvent(OPEN_REFERENCE_WINDOW))
    );

    // TinyMCE Menu Items
    const separator: TinyMCE.MenuItem = { text: '-', };

    const requestTools: TinyMCE.MenuItem = {
        text: 'Request More Tools',
        onclick: () => {
            editor.windowManager.open({
                title: 'Request More Tools',
                body: [{
                    type: 'container',
                    html:
                    `<div style="text-align: center;">` +
                    `Have a feature or tool in mind that isn't available?<br>` +
                    `<a ` +
                    `href="https://github.com/dsifford/academic-bloggers-toolkit/issues" ` +
                    `style="color: #00a0d2;" ` +
                    `target="_blank">Open an issue</a> on the GitHub repository and let me know!` +
                    `</div>`,
                }, ],
                buttons: [],
            });
        },
    };

    const keyboardShortcuts: TinyMCE.MenuItem = {
        text: 'Keyboard Shortcuts',
        onclick: () => {
            editor.windowManager.open({
                title: 'Keyboard Shortcuts',
                url: ABT_meta.tinymceViewsURL + 'keyboard-shortcuts.html',
                width: 400,
                height: 70,
            });
        },
    };

    // Event Handlers
    editor.on('init', () => {
        dispatchEvent(new CustomEvent(TINYMCE_READY));
    });

    // // Register Button
    // const ABT_Button = {
    //     id: 'abt_menubutton',
    //     type: 'menubutton',
    //     icon: 'abt_menu dashicons-welcome-learn-more',
    //     title: 'Academic Blogger\'s Toolkit',
    //     menu: [
    //         keyboardShortcuts,
    //         requestTools,
    //     ],
    // };
    // editor.addButton('abt_main_menu', ABT_Button);

});
