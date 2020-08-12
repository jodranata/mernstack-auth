import {
  AUTH_ERROR,
  CLEAR_AUTH_ERROR,
  REGISTER_ERROR,
  CLEAR_REGISTER_ERROR,
  ACTIVATE_FAILED,
  FORGOT_PASSWORD_ERROR,
  CLEAR_FORGOT_PASSWORD_ERROR,
} from './constant';

const handleAuthError = (state, action) => ({
  ...state,
  authError: action.payload,
});

const handleClearAuthError = state => ({
  ...state,
  authError: {},
});

const handleRegisterError = (state, action) => ({
  ...state,
  registerError: action.payload.errors,
});

const handleClearRegisterError = state => ({
  ...state,
  registerError: '',
});

const handleResetPasswordError = (state, action) => ({
  ...state,
  forgotPasswordError: action.payload,
});

const handleClearForgotPassword = state => ({
  ...state,
  forgotPasswordError: '',
});

const errorReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ERROR:
      return handleAuthError(state, action);
    case CLEAR_AUTH_ERROR:
      return handleClearAuthError(state);
    case REGISTER_ERROR:
    case ACTIVATE_FAILED:
      return handleRegisterError(state, action);
    case CLEAR_REGISTER_ERROR:
      return handleClearRegisterError(state);
    case FORGOT_PASSWORD_ERROR:
      return handleResetPasswordError(state, action);
    case CLEAR_FORGOT_PASSWORD_ERROR:
      return handleClearForgotPassword(state);
    default:
  }
};

export default errorReducer;
