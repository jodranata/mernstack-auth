import React, { useEffect, useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

import ReplyIcon from '@material-ui/icons/Reply';

import MuiTooltipButton from '../components/MuiTooltipButton';
import UpdateDialog from '../components/UpdateDialog';
import { UserContext } from '../state/store';
import { isAuth, signOut } from '../helpers/auth';
import { USER_LOGIN, USER_SIGNOUT } from '../state/constant';

const useStyles = makeStyles({
  homeContainer: {
    width: '100vw',
    height: '100vh',
  },
  userDetail: {
    width: '380px',
    display: 'flex',
    flexDirection: 'column',
    padding: '12px 10px',
    backgroundColor: '#f0f0f0',
  },
  detail: {},
  action: {
    marginTop: '15px',
  },
});

const Home = ({ history }) => {
  const classes = useStyles();
  const {
    userDispatch,
    userState: { userData },
  } = useContext(UserContext);

  const handleSignOut = () => {
    signOut(() => {
      userDispatch({ type: USER_SIGNOUT });
      history.push('/register');
    });
  };

  useEffect(() => {
    if (!isAuth() && !userData._id) return history.push('/register');
    if (isAuth() && !userData._id) {
      return userDispatch({ type: USER_LOGIN, payload: isAuth() });
    }
  }, [history, userData, userDispatch]);

  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      className={classes.homeContainer}
    >
      <Paper className={classes.userDetail} elevation={8}>
        <Grid
          item
          container
          direction="column"
          alignItems="center"
          xs={12}
          className={classes.detail}
        >
          <Typography variant="h5">
            {`${userData.firstName}${
              userData.lastName ? ` ${userData.lastName}` : ''
            }`}
          </Typography>
          <Typography variant="body2">{userData.email}</Typography>
        </Grid>
        <Grid
          item
          xs={12}
          container
          direction="row"
          justify="space-around"
          className={classes.action}
        >
          <UpdateDialog updateType="profile" />
          <UpdateDialog updateType="password" />
          <MuiTooltipButton
            title="Sign Out"
            placement="bottom"
            onClick={handleSignOut}
          >
            <ReplyIcon color="error" />
          </MuiTooltipButton>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default Home;
