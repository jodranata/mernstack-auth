/* eslint-disable max-len */
import React, { useState, useContext, useEffect, useCallback } from 'react';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Fade from '@material-ui/core/Fade';

import makeStyles from '@material-ui/core/styles/makeStyles';
import TextField from '@material-ui/core/TextField';
import { Typography } from '@material-ui/core';

import { useSnackbar } from 'notistack';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

import RegisterImg from '../images/register.png';
import RegisterBg from '../images/eezy_64.svg';
import { CLEAR_AUTH_ERROR } from '../state/constant';
import { UserContext } from '../state/store';
import { isAuth } from '../helpers/auth';

import GoogleIcon from '../images/googleicon.png';
import FacebookIcon from '../images/facebookicon.png';
import ForgotPassword from '../components/ForgotPassword';

const useStyles = makeStyles({
  registerContainer: {
    minWidth: '100vw',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: `url(${RegisterBg})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  },
  registerComp: {
    width: '90%',
    heigth: '700px',
    padding: '12px 20px',
    borderRadius: '3px',
    backgroundColor: '#f7f7f7',
    boxShadow: '1px 2px 7px 3px rgba(14,14,14,0.323)',
    '@media only screen and (max-width: 350px)': {
      width: '100vw',
      minHeight: '100vh',
    },
  },
  registerForm: {
    width: '100%',
    height: '700px',
    padding: '20px',
    position: 'relative',
    backgroundColor: '#f7f7f7',
    overflowY: 'hidden',
  },
  textFields: {
    padding: '10px 12px',
    marginTop: '24px',
    '& .MuiFormControl-root': {
      margin: '10px 0',
      width: '100%',
    },
  },

  registerImg: {
    width: '100%',
    height: '100%',
    background: `url(${RegisterImg})`,

    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
  oauth: {
    marginTop: '10px',
  },
  separator: {
    width: '100%',
    margin: '10px auto',
    position: 'relative',
    '&:before, &::after': {
      width: '45%',
      content: '""',
      height: '2px',
      backgroundColor: '#777',
      position: 'absolute',
      display: 'inline-block',
      top: '50%',
    },
    '&::before': {
      left: '0',
      borderTopLeftRadius: '50%',
      borderBottomLeftRadius: '50%',
    },
    '&::after': {
      right: '0',
      borderTopRightRadius: '50%',
      borderBottomRightRadius: '50%',
    },
  },
  oauthbutton: {
    margin: '8px 0',
    textAlign: 'justify',
    '& .MuiButton-label': {
      color: '#373737',
      fontSize: '1rem',
      fontWeight: '700',
      textTranform: 'capitalize',
    },
    '& .icon': {
      width: '50px',
      height: '50px',
      display: 'inline-block',
      marginLeft: '8px',
      '&.google-icon': {
        background: `url(${GoogleIcon})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
      },
      '&.facebook-icon': {
        background: `url(${FacebookIcon})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
      },
    },
  },
  forgotPassword: {
    margin: '8px 5px',
  },
});

const Register = ({ history }) => {
  const classes = useStyles();
  const [tabVal, setTabVal] = useState('signup');
  const { enqueueSnackbar } = useSnackbar();
  const {
    handleRegister,
    errorDispatch,
    handleGoogleSignIn,
    handleFacebookSignIn,
    errorState: { authError, registerError },
    userState: { regisMessage },
  } = useContext(UserContext);

  const [data, setData] = useState({
    email: '',
    password: '',
    confirmedPassword: '',
    firstName: '',
    lastName: '',
  });

  const handleChangeTab = (e, newTabVal) => {
    if (tabVal === 'signup') {
      setData(prevState => ({
        ...prevState,
        confirmedPassword: '',
        firstName: '',
        lastName: '',
      }));
    }

    if (Object.values(authError).findIndex(item => item !== null) >= 0) {
      errorDispatch({ type: CLEAR_AUTH_ERROR });
    }
    setTabVal(newTabVal);
  };

  const handleChangeInput = e => {
    const {
      target: { id, value },
    } = e;

    setData(prevState => ({
      ...prevState,
      [id]: value,
    }));
  };

  const clearForm = () => {
    setData({
      email: '',
      password: '',
      confirmedPassword: '',
      firstName: '',
      lastName: '',
    });
    document.activeElement.blur();
  };

  const successLogin = firstName => {
    clearForm();
    enqueueSnackbar(`Welcome back ${firstName}`, {
      variant: 'success',
      autoHideDuration: 3000,
    });
    return isAuth() && isAuth().role === 'Admin'
      ? history.push('/au/admin')
      : history.push('/au/user');
  };

  const handleSubmit = e => {
    e.preventDefault();
    const userForm =
      tabVal === 'signup'
        ? data
        : { email: data.email, password: data.password };

    handleRegister(
      tabVal,
      userForm,
      tabVal === 'signup' ? clearForm : successLogin,
    );
  };

  const showSnackBar = useCallback(
    (variant, snackNotif) => {
      return enqueueSnackbar(snackNotif, { variant, autoHideDuration: 3000 });
    },
    [enqueueSnackbar],
  );

  const responseGoogleAuth = res => {
    handleGoogleSignIn(res.tokenId, successLogin);
  };

  const responseFacebookAuth = res => {
    handleFacebookSignIn(
      { userID: res.userID, accessToken: res.accessToken },
      successLogin,
    );
  };

  useEffect(() => {
    if (registerError) showSnackBar('error', registerError);
    if (regisMessage) {
      showSnackBar('success', regisMessage);
    }
  }, [registerError, regisMessage, showSnackBar]);

  return (
    <div className={classes.registerContainer}>
      <Grid
        container
        direction="row"
        className={classes.registerComp}
        justify="center"
      >
        <Grid container item xs={12} sm={8} md={4}>
          <Paper square elevation={0} className={classes.registerForm}>
            <Paper square elevation={3} style={{ backgroundColor: '#f7f7f7' }}>
              <Tabs
                value={tabVal}
                onChange={handleChangeTab}
                indicatorColor="primary"
                variant="fullWidth"
                textColor="primary"
              >
                <Tab label="Sign Up" value="signup" />
                <Tab label="Login" value="signin" />
              </Tabs>
            </Paper>
            <form autoComplete="off" onSubmit={handleSubmit}>
              <Grid
                item
                container
                direction="column"
                className={classes.textFields}
              >
                <TextField
                  variant="outlined"
                  type="email"
                  label="Email"
                  id="email"
                  value={data.email}
                  required
                  onChange={handleChangeInput}
                  error={!!authError.email}
                  helperText={authError.email}
                />
                <TextField
                  variant="outlined"
                  type="password"
                  label="Password"
                  id="password"
                  value={data.password}
                  required
                  onChange={handleChangeInput}
                  error={!!authError.password}
                  helperText={authError.password}
                />
                <Collapse in={tabVal === 'signup'}>
                  <TextField
                    variant="outlined"
                    type="password"
                    label="Confirmed Password"
                    id="confirmedPassword"
                    value={data.confirmedPassword}
                    required={tabVal === 'signup'}
                    onChange={tabVal === 'signup' ? handleChangeInput : null}
                    error={!!authError.confirmedPassword}
                    helperText={authError.confirmedPassword}
                  />
                  <TextField
                    variant="outlined"
                    type="text"
                    label="First name"
                    id="firstName"
                    value={data.firstName}
                    required={tabVal === 'signup'}
                    onChange={tabVal === 'signup' ? handleChangeInput : null}
                    error={!!authError.firstName}
                    helperText={authError.firstName}
                  />
                  <TextField
                    variant="outlined"
                    type="text"
                    id="lastName"
                    value={data.lastName}
                    label="Last name"
                    onChange={tabVal === 'signup' ? handleChangeInput : null}
                  />
                </Collapse>
              </Grid>
              <Button
                type="submit"
                onClick={handleSubmit}
                color="primary"
                variant="contained"
                className={classes.registerButton}
                fullWidth
              >
                {tabVal === 'signup' ? 'Register' : 'Login'}
              </Button>
            </form>
            <ForgotPassword className={classes.forgotPassword} />
            <Fade in={tabVal !== 'signup'}>
              <Grid
                container
                direction="column"
                alignItems="center"
                className={classes.oauth}
                style={{
                  display: tabVal === 'signup' ? 'none' : 'flex',
                }}
              >
                <Typography
                  variant="body2"
                  color="textSecondary"
                  align="center"
                  className={classes.separator}
                >
                  or
                </Typography>
                <GoogleLogin
                  clientId={process.env.REACT_APP_GOOGLE_CLIENT}
                  onSuccess={responseGoogleAuth}
                  onFailure={responseGoogleAuth}
                  cookiePolicy="single_host_origin"
                  render={renderProps => (
                    <Button
                      fullWidth
                      variant="outlined"
                      color="primary"
                      className={classes.oauthbutton}
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >
                      Sign in with Google
                      <span className="icon google-icon" />
                    </Button>
                  )}
                />
                <FacebookLogin
                  appId={process.env.REACT_APP_FACEBOOK_CLIENT}
                  autoLoad={false}
                  callback={responseFacebookAuth}
                  render={renderProps => (
                    <Button
                      fullWidth
                      variant="outlined"
                      color="primary"
                      className={classes.oauthbutton}
                      onClick={renderProps.onClick}
                    >
                      Sign In with Facebook
                      <span className="icon facebook-icon" />
                    </Button>
                  )}
                />
              </Grid>
            </Fade>
            <Typography
              variant="caption"
              color="textSecondary"
              style={{ position: 'absolute', bottom: '3px', left: '7px' }}
            >
              *required
            </Typography>
          </Paper>
        </Grid>
        <Hidden smDown>
          <Grid item xs={false} md={6} lg={8} container justify="center">
            <div className={classes.registerImg} />
          </Grid>
        </Hidden>
      </Grid>
    </div>
  );
};

export default Register;
