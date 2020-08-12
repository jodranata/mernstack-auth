import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Typography } from '@material-ui/core';
import ExitIcon from '@material-ui/icons/ExitToApp';
import jwt from 'jsonwebtoken';

import { getCookie, signOut } from '../helpers/auth';
import { UserContext } from '../state/store';
import { USER_SIGNOUT } from '../state/constant';

const bgColor = {
  blue: '#1f8bbd',
  blueContrast: '#3dabdf',
  red: '#c73030',
  redContrast: '#db5252',
  green: '#2fb462',
  greenContrast: '#56e28c',
  yellow: '#cab331',
  yellowContrast: '#eed752',
};

const useStyles = makeStyles(theme => ({
  dashboard: {
    maxWidth: '100vw',
    height: '100vh',
  },
  dashboardContainer: {
    maxWidth: '450px',
    height: '65%',
    backgroundColor: '#f8f8f8',
    boxShadow: '0 3px 1px 1px rgba(59,59,59,0.323)',
    borderRadius: '14px',
    '& > *': {
      margin: '8px auto',
      padding: '15px 0',
    },
  },
  register: {
    '&.MuiButton-root': {
      backgroundColor: bgColor.blue,
      '&:hover': {
        backgroundColor: bgColor.blueContrast,
      },
    },
  },
  delete: {
    '&.MuiButton-root': {
      backgroundColor: bgColor.red,
      '&:hover': {
        backgroundColor: bgColor.redContrast,
      },
    },
  },
  update: {
    '&.MuiButton-root': {
      backgroundColor: bgColor.green,
      '&:hover': {
        backgroundColor: bgColor.greenContrast,
      },
    },
  },
  get: {
    '&.MuiButton-root': {
      backgroundColor: bgColor.yellow,
      '&:hover': {
        backgroundColor: bgColor.yellowContrast,
      },
    },
  },
}));

const token = getCookie('token');

const Dashboard = ({ history }) => {
  const classes = useStyles();
  const { resetState, userDispatch } = useContext(UserContext);

  const handleSignOut = () => {
    signOut(() => {
      userDispatch({ type: USER_SIGNOUT });
      history.push('/register');
    });
  };

  useEffect(() => {
    if (token) {
      jwt.verify(token, process.env.REACT_APP_JWT_SECRET, (err, user) => {
        if (err || Date.now() >= user.exp * 1000) {
          return signOut(resetState);
        }
        history.push('/au/user');
      });
    } else {
      return signOut(resetState);
    }
  }, [history, resetState]);

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justify="space-evenly"
      className={classes.dashboard}
    >
      <Typography color="textPrimary" variant="h5">
        MERN Stack: Auth with Email, Google, Facebook.
      </Typography>
      <Grid
        item
        container
        direction="column"
        justify="center"
        alignItems="center"
        className={classes.dashboardContainer}
      >
        <Button
          type="button"
          component={Link}
          to="/register"
          variant="contained"
          className={classes.register}
          startIcon={<ExitIcon />}
        >
          Register
        </Button>

        <Button
          type="button"
          component={Link}
          to="/get"
          variant="contained"
          className={classes.get}
        >
          Signout
        </Button>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
