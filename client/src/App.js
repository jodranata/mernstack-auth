import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import {
  MuiThemeProvider as ThemeProvider,
  unstable_createMuiStrictModeTheme as createMuiTheme,
} from '@material-ui/core/styles';

import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Activate from './pages/Activate';
import Home from './pages/Home';
import ResetPassword from './pages/ResetPassword';

import './App.css';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: 'rgb(75, 135, 247)',
    },
    secondary: {
      main: 'rgb(55, 194, 102)',
    },
    error: {
      main: 'rgb(245, 118, 92)',
    },
    disabled: {
      main: 'rgb(177, 177, 177)',
    },
  },
  overrides: {
    MuiButton: {
      root: {
        minWidth: '200px',
      },
      label: {
        color: '#f0f0f0',
        fontWeight: 700,
        textTransform: 'capitalize',
      },
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route path="/" exact component={Dashboard} />
          <Route path="/au/user" component={Home} />
          <Route path="/register" component={Register} />
          <Route path="/users/activate/:token" exact component={Activate} />
          <Route path="/users/reset/:token" exact component={ResetPassword} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

export default App;
