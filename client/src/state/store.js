import React, { createContext, useReducer, useCallback } from 'react';
import axios from 'axios';
import userReducer from './userReducer';
import errorReducer from './errorReducer';

import {
  USER_SIGNUP,
  AUTH_ERROR,
  UI_LOADING,
  CLEAR_LOADING,
  CLEAR_AUTH_ERROR,
  CLEAR_REGISTER_ERROR,
  REGISTER_ERROR,
  CLEAR_SIGNUP_MESSAGE,
  USER_LOGIN,
  FORGOT_PASSWORD_ERROR,
  CLEAR_FORGOT_PASSWORD_ERROR,
  UPDATE_FAILED,
} from './constant';
import {
  isEmail,
  isEmpty,
  isMatched,
  isPassWordSecured,
} from '../helpers/authValidate';

import { authenticate, setLocalStorage } from '../helpers/auth';

const INIT_USER = {
  userData: {},
  regisMessage: '',
  UILoading: false,
  loginMessage: '',
};

const INIT_ERROR = {
  authError: {},
  registerError: '',
  forgotPasswordError: '',
};

const checkAuthError = data => {
  const errors = {};
  Object.keys(data)
    .filter(key => key !== 'lastName')
    .forEach(key => {
      errors[key] = isEmpty(data[key]);
    });
  if (Object.prototype.hasOwnProperty.call(data, 'email')) {
    if (!errors.email && !isEmail(data.email))
      errors.email = 'Invalid Email Address';
  }
  if (Object.prototype.hasOwnProperty.call(data, 'password')) {
    if (!errors.password && !isPassWordSecured(data.password))
      errors.password =
        // eslint-disable-next-line max-len
        'Password must have at least 6 characters, an uppercase & lowercase letter, and a number';
  }

  if (Object.prototype.hasOwnProperty.call(data, 'confirmedPassword')) {
    if (
      !errors.password &&
      !errors.confirmedPassword &&
      !isMatched(data.password, data.confirmedPassword)
    )
      errors.confirmedPassword = 'Password must match';
  }
  return errors;
};

export const UserContext = createContext(INIT_USER);

export const UserProvider = ({ children }) => {
  const [userState, userDispatch] = useReducer(userReducer, INIT_USER);
  const [errorState, errorDispatch] = useReducer(errorReducer, INIT_ERROR);

  const resetState = useCallback(() => {
    errorDispatch({ type: CLEAR_AUTH_ERROR });
    errorDispatch({ type: CLEAR_REGISTER_ERROR });
    userDispatch({ type: CLEAR_SIGNUP_MESSAGE });
  }, []);

  const handleRegister = useCallback(
    (registerType, userData, cb) => {
      resetState();
      userDispatch({ type: UI_LOADING });

      const errors = checkAuthError(userData);
      const hasError =
        Object.values(errors).filter(error => error !== null).length > 0;
      if (hasError) {
        errorDispatch({ type: AUTH_ERROR, payload: errors });
        return userDispatch({ type: CLEAR_LOADING });
      }

      errorDispatch({ type: CLEAR_AUTH_ERROR });
      axios
        .post(`/api/${registerType}`, userData)
        .then(res => {
          errorDispatch({ type: CLEAR_REGISTER_ERROR });

          if (registerType === 'signin') {
            authenticate(res);
            userDispatch({ type: USER_LOGIN, payload: res.data.user });
            return cb(res.data.user.firstName);
          }
          userDispatch({
            type: USER_SIGNUP,
            payload: res.data,
          });
          cb();
        })
        .catch(err =>
          errorDispatch({
            type: REGISTER_ERROR,
            payload: err.response.data,
          }),
        );
    },
    [resetState],
  );

  const handleActivate = useCallback((url, cb) => {
    axios
      .post(url)
      .then(res => {
        cb(res.status);
      })
      .catch(err => {
        cb(err.response.status);
      });
  }, []);

  const handleUpdate = useCallback((data, token, cb) => {
    const errors = checkAuthError(data);
    const hasError =
      Object.values(errors).filter(error => error !== null).length > 0;
    if (hasError) return errorDispatch({ type: AUTH_ERROR, payload: errors });
    axios
      .put(`/api/au/user/update`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        setLocalStorage('user', res.data);
        userDispatch({ type: USER_LOGIN, payload: res.data });
      })
      .catch(() => {
        errorDispatch({ type: UPDATE_FAILED });
      });
    cb();
  }, []);

  const handleForgotPassword = useCallback((email, cb) => {
    const error = isEmail(email) ? null : 'invalid email address';
    if (error !== null)
      return errorDispatch({ type: FORGOT_PASSWORD_ERROR, payload: error });

    errorDispatch({ type: CLEAR_FORGOT_PASSWORD_ERROR });
    axios
      .post('/api/forgotpassword', { email })
      .then(res => {
        cb('success', res.data.message);
      })
      .catch(err => {
        cb('error', err.response.data.errors);
      });
  }, []);

  const handleGoogleSignIn = useCallback((idToken, cb) => {
    axios
      .post('/api/googlelogin', { idToken })
      .then(res => {
        authenticate(res);
        userDispatch({ type: USER_LOGIN, payload: res.data.user });
        cb(res.data.user.firstName);
      })
      .catch(err => {
        errorDispatch({ type: REGISTER_ERROR, payload: err.response.data });
      });
  }, []);

  const handleFacebookSignIn = useCallback(({ userID, accessToken }, cb) => {
    axios
      .post(`/api/facebooklogin`, { userID, accessToken })
      .then(res => {
        authenticate(res);
        userDispatch({ type: USER_LOGIN, payload: res.data.user });
        cb(res.data.user.firstName);
      })
      .catch(err => {
        errorDispatch({ type: REGISTER_ERROR, payload: err.response.data });
      });
  }, []);

  return (
    <UserContext.Provider
      value={{
        userState,
        errorState,
        userDispatch,
        errorDispatch,
        handleRegister,
        handleActivate,
        handleUpdate,
        resetState,
        handleForgotPassword,
        handleGoogleSignIn,
        handleFacebookSignIn,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
