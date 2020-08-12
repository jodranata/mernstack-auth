import React, { useState, useEffect, useContext } from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import axios from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import SendIcon from '@material-ui/icons/Send';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useSnackbar } from 'notistack';
import { UserContext } from '../state/store';

import { isEmpty, isPassWordSecured, isMatched } from '../helpers/authValidate';

const useStyles = makeStyles(theme => ({
  resetTextField: {
    '& > *': {
      margin: '8px 0',
    },
  },
}));

// const CHECK_ERROR = 'CHECK_ERROR';

// const AUTH_ERROR = {
//   newPassword: '',
//   confirmedNewPassword: '',
// };

// const errorReducer = (state, action) => {
//   switch (action.type) {
//     case CHECK_ERROR:
//       return {
//         newPassword: action.payload.newPassword,
//         confirmedNewPassword: action.payload.confirmedNewPassword,
//       };
//     default:
//   }
// };

const ResetDialog = ({ email, showNotif, history }) => {
  const [resetPassword, setResetPassword] = useState({
    newPassword: '',
    confirmedNewPassword: '',
  });

  const [errors, setErrors] = useState({});

  const classes = useStyles();
  const handleChangeReset = e => {
    const {
      target: { value, id },
    } = e;
    setResetPassword(prevState => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleResetSubmit = e => {
    const resErrors = {};
    Object.keys(resetPassword).forEach(key => {
      resErrors[key] = isEmpty(resetPassword[key]);
    });
    if (
      !resErrors.newPassword &&
      !isPassWordSecured(resetPassword.newPassword)
    ) {
      resErrors.newPassword =
        'Password must have at least 6 characters, an uppercase & lowercase letter, and a number';
    }
    if (
      !resErrors.newPassword &&
      !resErrors.confirmedNewPassword &&
      !isMatched(resetPassword.newPassword, resetPassword.confirmedNewPassword)
    ) {
      resErrors.confirmedNewPassword = 'Password did not match';
    }
    if (Object.values(resErrors).filter(error => error !== null).length > 0)
      return setErrors(resErrors);
    setErrors({});
    axios
      .put('/api/reset', { email, ...resetPassword })
      .then(res => {
        showNotif('success', res.data.message);
        history.push('/register');
      })
      .catch(err => {
        showNotif('error', err.response.data.errors);
      });
  };

  return (
    <Dialog open fullWidth maxWidth="sm">
      <DialogTitle>Reset password</DialogTitle>
      <DialogContent>
        <form onSubmit={handleResetSubmit} className={classes.resetTextField}>
          <TextField
            variant="outlined"
            color="primary"
            type="password"
            value={resetPassword.newPassword}
            id="newPassword"
            onChange={handleChangeReset}
            error={!!errors.newPassword}
            helperText={errors.newPassword}
            fullWidth
            label="New password"
          />
          <TextField
            variant="outlined"
            color="primary"
            value={resetPassword.confirmedNewPassword}
            id="confirmedNewPassword"
            type="password"
            onChange={handleChangeReset}
            fullWidth
            error={!!errors.confirmedNewPassword}
            helperText={errors.confirmedNewPassword}
            label="Confirmed new password"
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={handleResetSubmit}
          startIcon={<SendIcon />}
        >
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ResetExpired = () => {
  return (
    <div>
      <span>Link has Expired. </span>
      <Link href="/register">Resend reset link to email</Link>
    </div>
  );
};

const ResetPassword = ({ match, history }) => {
  const [email, setEmail] = useState('');
  const [isExpired, setisExpired] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const showNotif = (variant, msg) => {
    enqueueSnackbar(msg, {
      variant,
      autoHideDuration: 3000,
    });
  };

  useEffect(() => {
    axios
      .get(`/api/reset/${match.params.token}`)
      .then(res => {
        setEmail(res.data.email);
        setisExpired(false);
      })
      .catch(err => {
        setEmail('');
        setisExpired(true);
      });
  }, [match.params]);

  return (
    <div>
      {isExpired === false ? (
        <ResetDialog email={email} showNotif={showNotif} history={history} />
      ) : isExpired === true ? (
        <ResetExpired />
      ) : (
        <div />
      )}
    </div>
  );
};

export default ResetPassword;
