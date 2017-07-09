import { useStrict } from 'mobx';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ReferenceWindow } from './components/ReferenceWindow';

useStrict(true);

ReactDOM.render(<ReferenceWindow />, document.getElementById('abt-root'));
