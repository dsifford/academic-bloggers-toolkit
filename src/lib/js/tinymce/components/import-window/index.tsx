import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ImportWindow } from './ImportWindow';

import { useStrict } from 'mobx';

useStrict(true);

ReactDOM.render(
    <ImportWindow wm={top.window.tinyMCE.activeEditor.windowManager} />,
    document.getElementById('main-container')
);
