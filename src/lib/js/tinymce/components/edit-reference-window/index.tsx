import 'babel-polyfill';
import { useStrict } from 'mobx';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { EditReferenceWindow } from './EditReferenceWindow';

useStrict(true);

ReactDOM.render(
  <EditReferenceWindow />,
  document.getElementById('abt-root')
);
