import React from 'react';
import TextField from '@material-ui/core/TextField';

const obj = {
  profile: [
    { type: 'email', label: 'Email' },
    { type: 'firstName', label: 'First name' },
    { type: 'lastName', label: 'Last name' },
  ],
  password: [
    { type: 'password', label: 'Password' },
    { type: 'confirmedPassword', label: 'Confirmed password' },
  ],
};

const ChangeProfile = ({ classnames, data, handleChange }) => {
  return (
    <form className={classnames}>
      <TextField
        variant="outlined"
        value={data.email}
        id="profile-email"
        type="email"
        label="email"
        fullWidth
        onChange={handleChange}
      />
      <TextField
        variant="outlined"
        value={data.firstName}
        id="profile-firstName"
        type="text"
        label="first name"
        fullWidth
        onChange={handleChange}
      />
      <TextField
        variant="outlined"
        value={data.lastName}
        id="profile-lastName"
        type="text"
        label="last name"
        fullWidth
        onChange={handleChange}
      />
    </form>
  );
};

export default ChangeProfile;
