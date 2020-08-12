'use strict';

const errorMessage = error => {
  let output;
  try {
    let fieldName = error.message.split('.$')[1];
    field = field.split(' dub key')[0];
    field = field.substring(0, field.lastIndexOf('_'));
    req.flash('errors', [
      { message: `An account with this ${field} already exist` },
    ]);

    output =
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + 'already exist';
  } catch (err) {
    output = 'Already exist';
  }
  return output;
};

const handleError = error => {
  let message = '';
  if (error.code) {
    switch (error.code) {
      case 11000:
      case 11001:
        message = errorMessage(error);
        break;
      default:
        message = 'Something went wrong';
    }
  } else {
    for (let errorName in error.errorors) {
      if (error.errorors[errorName].message) {
        message = error.errorors[errorName].message;
      }
    }
  }
  return message;
};

module.exports = { handleError };
