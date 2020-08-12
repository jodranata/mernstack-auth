import React, { useEffect, useContext, useState, useCallback } from 'react';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

import { UserContext } from '../state/store';

const Activate = ({ match, history }) => {
  const { handleActivate } = useContext(UserContext);
  const [isExpired, setIsExpired] = useState(null);

  const handleExpired = useCallback(status => {
    if (status === 401) {
      return setIsExpired(true);
    }
    return setIsExpired(false);
  }, []);

  useEffect(() => {
    handleActivate(`/api/${match.url}`, handleExpired);
  }, [match.url, handleActivate, handleExpired]);

  useEffect(() => {
    if (isExpired) {
      alert(`Expired activation link, Please register again`);
      history.push('/register');
    }
  }, [isExpired, history]);
  return (
    <div>
      {isExpired === false && (
        <>
          <h3>Account activated, please login</h3>
          <Button component={Link} to="/" variant="contained" color="primary">
            Dashboard
          </Button>
        </>
      )}
    </div>
  );
};

export default Activate;
