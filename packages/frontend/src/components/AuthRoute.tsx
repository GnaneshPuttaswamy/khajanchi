import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  if (isAuthenticated) {
    return (
      <Navigate
        to={location.state?.from?.pathname || '/add-transaction'}
        replace
      />
    );
  }

  return <>{children}</>;
};

export default AuthRoute;
