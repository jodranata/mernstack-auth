/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useContext } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import SendIcon from '@material-ui/icons/Send';
import Link from '@material-ui/core/Link';
import { useSnackbar } from 'notistack';

import { UserContext } from '../state/store';
import { CLEAR_FORGOT_PASSWORD_ERROR } from '../state/constant';

const ForgotPassword = ({ className }) => {
  const {
    handleForgotPassword,
    errorDispatch,
    errorState: { forgotPasswordError },
  } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const handleChange = e => {
    const {
      target: { type, value },
    } = e;
    if (type === 'email') setEmail(value);
  };
  const handleOpen = e => {
    e.preventDefault();
    return setOpen(true);
  };
  const handleClose = () => {
    setEmail('');
    errorDispatch({ type: CLEAR_FORGOT_PASSWORD_ERROR });
    return setOpen(false);
  };

  const handleSubmit = () => {
    handleForgotPassword(email, (variant, msg) => {
      enqueueSnackbar(msg, {
        variant,
        autoHideDuration: 3000,
      });
      if (variant === 'success') return handleClose();
    });
  };
  return (
    <>
      <Link
        color="primary"
        component="button"
        onClick={handleOpen}
        className={className}
      >
        Forgot Password?
      </Link>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Enter your email to reset your password</DialogTitle>
        <DialogContent>
          <TextField
            variant="outlined"
            color="primary"
            value={email}
            type="email"
            id="reset-password"
            label="Email"
            onChange={handleChange}
            fullWidth
            error={!!forgotPasswordError}
            helperText={forgotPasswordError}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            startIcon={<SendIcon />}
            size="small"
            disabled={!email}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ForgotPassword;
