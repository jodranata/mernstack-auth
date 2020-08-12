import {
  USER_SIGNUP,
  UI_LOADING,
  AUTH_ERROR,
  CLEAR_AUTH_ERROR,
  CLEAR_LOADING,
  CLEAR_SIGNUP_MESSAGE,
  USER_LOGIN,
  USER_SIGNOUT,
  ACTIVATE_SUCCESS,
} from './constant';

const handleUserSignUp = (state, action) => ({
  ...state,
  regisMessage: action.payload.message,
  UILoading: false,
});

const handleClearSignUpMessage = state => ({
  ...state,
  regisMessage: '',
});

const handleAuthError = (state, action) => ({
  ...state,
  authError: action.payload,
  UILoading: false,
});

const handleClearAuthError = state => ({
  ...state,
  authError: {},
});

const handleUiLoading = state => ({
  ...state,
  UILoading: true,
});

const handleClearLoading = state => ({
  ...state,
  UILoading: false,
});

const handleUserLogin = (state, action) => ({
  ...state,
  userData: action.payload,
});

const handleUserSignOut = state => ({
  ...state,
  userData: {},
});

const userReducer = (state, action) => {
  switch (action.type) {
    case UI_LOADING:
      return handleUiLoading(state);
    case USER_SIGNUP:
    case ACTIVATE_SUCCESS:
      return handleUserSignUp(state, action);
    case USER_LOGIN:
      return handleUserLogin(state, action);
    case USER_SIGNOUT:
      return handleUserSignOut(state);
    case AUTH_ERROR:
      return handleAuthError(state, action);
    case CLEAR_AUTH_ERROR:
      return handleClearAuthError(state);
    case CLEAR_LOADING:
      return handleClearLoading(state);
    case CLEAR_SIGNUP_MESSAGE:
      return handleClearSignUpMessage(state);
    default:
  }
};

export default userReducer;
