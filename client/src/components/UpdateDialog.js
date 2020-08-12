import React, { useState, useContext } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import EditIcon from '@material-ui/icons/Edit';
import LockIcon from '@material-ui/icons/Lock';
import PropTypes from 'prop-types';

import MuiTooltipButton from './MuiTooltipButton';
import { UserContext } from '../state/store';
import { CLEAR_AUTH_ERROR } from '../state/constant';
import { getCookie } from '../helpers/auth';

const textFieldObj = {
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

const useStyles = makeStyles({
  updateForm: {
    '& .MuiTextField-root': {
      margin: '5px auto',
    },
  },
  dialogactions: {
    '& .MuiButton-colorInherit': {
      backgroundColor: 'rgb(245, 118, 92)',
      '&:hover': {
        backgroundColor: 'rgb(196, 81, 58)',
      },
    },
  },
});

const UpdateDialog = ({ updateType }) => {
  const [open, setOpen] = useState(false);
  const {
    userState: { userData },
    errorState: { authError },
    handleUpdate,
    errorDispatch,
  } = useContext(UserContext);

  const isProfile = updateType === 'profile';
  const classes = useStyles();
  const [profile, setProfile] = useState({
    email: '',
    firstName: '',
    lastName: '',
  });
  const [password, setPassword] = useState({
    password: '',
    confirmedPassword: '',
  });

  const handleDialogOpen = () => {
    if (isProfile) {
      setProfile({
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
      });
    }
    setOpen(true);
  };

  const handleDialogClose = () => {
    setProfile({
      email: '',
      firstName: '',
      lastName: '',
    });
    setPassword({
      password: '',
      confirmedPassword: '',
    });
    errorDispatch({ type: CLEAR_AUTH_ERROR });
    setOpen(false);
  };

  const handleChange = e => {
    const {
      target: { value, id },
    } = e;
    const [prefix, type] = id.split('-');
    if (isProfile) {
      setProfile(prev => ({
        ...prev,
        [type]: value,
      }));
    } else {
      setPassword(prev => ({
        ...prev,
        [type]: value,
      }));
    }
  };

  const handleProfileUpdate = () => {
    const updateData = updateType === 'profile' ? profile : password;
    const token = getCookie('token');
    handleUpdate(updateData, token, handleDialogClose);
  };

  const textFieldOpt = textFieldObj[updateType].map(({ type, label }) => (
    <TextField
      key={type}
      variant="outlined"
      value={isProfile ? profile[type] : password[type]}
      id={`${updateType}-${type}`}
      type={
        type === 'password' || type === 'confirmedPassword'
          ? 'password'
          : 'text'
      }
      label={label}
      fullWidth
      onChange={handleChange}
      error={!!authError[type]}
      helperText={authError[type]}
    />
  ));

  return (
    <>
      <MuiTooltipButton
        title={isProfile ? 'Edit Profile' : 'Change Password'}
        placement="bottom"
        onClick={handleDialogOpen}
      >
        {isProfile ? (
          <EditIcon color="primary" />
        ) : (
          <LockIcon color="secondary" />
        )}
      </MuiTooltipButton>
      <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {isProfile ? 'Edit Profile' : 'Change password'}
        </DialogTitle>
        <DialogContent className={classes.updateForm}>
          <form>{textFieldOpt}</form>
        </DialogContent>
        <DialogActions className={classes.dialogactions}>
          <Button
            onClick={handleDialogClose}
            variant="contained"
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            onClick={handleProfileUpdate}
            variant="contained"
            color="secondary"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

UpdateDialog.defaultProps = {
  updateType: 'profile',
};

UpdateDialog.propTypes = {
  updateType: PropTypes.oneOf(['profile', 'password']),
};

export default UpdateDialog;
