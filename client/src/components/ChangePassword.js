import React from 'react';
import TextField from '@material-ui/core/TextField';

const ChangePassword = ({ classnames, data, handleChange }) => {
  return (
    <form className={classnames}>
      <TextField
        variant="outlined"
        value={data.password}
        id="profile-email"
        type="text"
        label="password"
        fullWidth
        onChange={handleChange}
      />
      <TextField
        variant="outlined"
        value={data.confirmedPassword}
        id="profile-firstName"
        type="text"
        label="confirmed password"
        fullWidth
        onChange={handleChange}
      />
    </form>
  );
};

export default ChangePassword;
