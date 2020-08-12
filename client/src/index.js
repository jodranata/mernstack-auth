import React from 'react';
import ReactDOM from 'react-dom';
import { SnackbarProvider } from 'notistack';

import App from './App';
import { UserProvider } from './state/store';

ReactDOM.render(
  <UserProvider>
    <SnackbarProvider
      maxSnack={1}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <App />
    </SnackbarProvider>
  </UserProvider>,
  document.getElementById('root'),
);
