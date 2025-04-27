import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  if (!isAuthenticated) {
    // Don't include login-related paths in the redirect state
    if (['/signin'].includes(location.pathname)) {
      return <Navigate to="/signin" replace />;
    }

    // Pass the current location in state so we can redirect back after login
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
