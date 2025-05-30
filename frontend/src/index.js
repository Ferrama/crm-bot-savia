import CssBaseline from '@material-ui/core/CssBaseline';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
//import './i18n';
import './index.css';

ReactDOM.render(
  <CssBaseline>
    <App />
  </CssBaseline>,
  document.getElementById('root'),
  () => {
    window.finishProgress();
  }
);
