/* eslint-disable max-len */
const emailPatt = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
const passwordPatt = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

export const isEmail = string => {
  return !!emailPatt.test(string);
};

export const isPassWordSecured = string => {
  return !!passwordPatt.test(string);
};

export const isMatched = (string, confString) => {
  return string === confString;
};

export const isEmpty = string => {
  const trimmed = string.trim();
  return trimmed === undefined || trimmed == null || trimmed === ''
    ? 'required fields'
    : null;
};
