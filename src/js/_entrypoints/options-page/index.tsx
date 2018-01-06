import { useStrict } from 'mobx';
import * as React from 'react';
import domReady from 'utils/dom-ready';
import { renderMany } from 'utils/render';

import DisplayOptionsForm from './display-options-form';
import StyleForm from './style-form';

import './_index.scss';

useStrict(true);

renderMany([
    [<StyleForm />, 'style-form-root'],
    [<DisplayOptionsForm />, 'display-options-form-root'],
]);

(async (): Promise<void> => {
    await domReady();
    if (typeof window.ABT.css_editor_settings === 'boolean') {
        return;
    }
    wp.codeEditor.initialize('custom_css', window.ABT.css_editor_settings);
})();
