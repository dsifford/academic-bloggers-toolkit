import 'babel-polyfill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useStrict } from 'mobx';
import { EditReferenceWindow } from './EditReferenceWindow';

useStrict(true);

ReactDOM.render(
  <EditReferenceWindow />,
  document.getElementById('abt-root')
);
