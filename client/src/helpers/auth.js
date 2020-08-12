import cookie from 'js-cookie';

const isReady = window !== undefined;

// set cookie
export const setCookie = (key, value) => {
  if (isReady) return cookie.set(key, value, { expires: 1 });
};

export const removeCookie = key => {
  if (isReady) return cookie.remove(key, { expires: 1 });
};

// get cookie like token
export const getCookie = key => {
  if (isReady) return cookie.get(key);
};

export const setLocalStorage = (key, value) => {
  if (isReady) return localStorage.setItem(key, JSON.stringify(value));
};

export const removeLocalStorage = key => {
  if (isReady) return localStorage.removeItem(key);
};

export const authenticate = response => {
  setCookie('token', response.data.token);
  setLocalStorage('user', response.data.user);
};

export const signOut = next => {
  removeCookie('token');
  removeLocalStorage('user');
  next();
};

export const isAuth = () => {
  if (isReady) {
    const cookieChecked = getCookie('token');
    if (cookieChecked) {
      if (localStorage.getItem('user'))
        return JSON.parse(localStorage.getItem('user'));
      return false;
    }
  }
};

export const updateUserData = (response, next) => {
  if (isReady) {
    let auth = JSON.parse(localStorage.getItem('user'));
    auth = response.data;
    localStorage.setItem('user', JSON.stringify(auth));
  }
  next();
};
