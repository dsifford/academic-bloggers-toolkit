import 'babel-polyfill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { PubmedWindow } from './PubmedWindow';

import { useStrict } from 'mobx';

useStrict(true);

ReactDOM.render(
  <PubmedWindow />,
  document.getElementById('abt-root')
);
