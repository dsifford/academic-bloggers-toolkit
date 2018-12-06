import { configure } from 'mobx';
import React from 'react';

import domReady from '_legacy/utils/dom-ready';
import { renderMany } from '_legacy/utils/render';

import DisplayOptionsForm from './display-options-form';
import StyleForm from './style-form';

import './_index.scss';

declare global {
    interface Window {
        wp: {
            codeEditor?: {
                initialize(elementId: string, options: object): void;
            };
        };
    }
}

configure({ enforceActions: 'observed' });

// disabling below since this is a false positive
// tslint:disable:jsx-key
renderMany([
    [<StyleForm />, 'style-form-root'],
    [<DisplayOptionsForm />, 'display-options-form-root'],
]);

(async (): Promise<void> => {
    await domReady();
    if (typeof window.ABT.css_editor_settings === 'boolean') {
        return;
    }
    if (!window.wp.codeEditor) {
        throw new Error('wp.codeEditor must be included in this scope');
    }
    window.wp.codeEditor.initialize(
        'custom_css',
        window.ABT.css_editor_settings,
    );
})();
