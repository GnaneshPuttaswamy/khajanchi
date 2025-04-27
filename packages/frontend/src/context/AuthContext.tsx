import React, { createContext, useState, useEffect } from 'react';
import { AUTH_ERROR_EVENT, axiosInstance } from '../utils/httpUtil';
import { useNavigate } from 'react-router';
import { message } from 'antd';
import { googleLogout } from '@react-oauth/google';

type User = {
  email: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  isLoading: boolean;
  user: User | null;
  signout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  isLoading: true,
  user: null,
  signout: async () => {
    throw new Error('signout not implemented');
  },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('authToken');
  });
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get('/users/profile');
        console.log(
          'AuthContext :: fetchUser() :: response.data.data => ',
          response.data?.data
        );
        setUser(response.data?.data);
      } catch (error) {
        console.error(
          'AuthContext ::  fetchUser() :: Failed to fetch user profile:',
          error
        );
        messageApi.error('Failed to fetch user details');
      }
    };

    if (isAuthenticated) {
      fetchUser();
    } else {
      setUser(null);
    }
  }, [isAuthenticated, messageApi]);

  useEffect(() => {
    const handleAuthError = (
      event: CustomEvent<{ errorCode: string; errorMessage: string }>
    ) => {
      setIsAuthenticated(false);

      const { errorCode, errorMessage } = event.detail;

      switch (errorCode) {
        case 'AUTH_TOKEN_EXPIRED':
          messageApi.error('Your session has expired. Please sign in again.');
          break;
        case 'AUTH_TOKEN_INVALID':
          messageApi.error('Invalid authentication. Please sign in again.');
          break;
        case 'AUTH_USER_NOT_FOUND':
          messageApi.error(
            'User account not found. Please sign in with a valid account.'
          );
          break;
        case 'AUTH_NO_TOKEN':
          messageApi.error('Authentication required. Please sign in.');
          break;
        default:
          messageApi.error(
            errorMessage || 'Authentication failed. Please sign in again.'
          );
      }

      navigate('/signin', { replace: true });
    };

    window.addEventListener(AUTH_ERROR_EVENT, handleAuthError as any);

    setIsLoading(false);

    return () => {
      window.removeEventListener(AUTH_ERROR_EVENT, handleAuthError as any);
    };
  }, [navigate, messageApi]);

  const signout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    googleLogout();

    messageApi.info('You have been signed out.');
  };

  return (
    <>
      {contextHolder}
      <AuthContext.Provider
        value={{
          isAuthenticated,
          setIsAuthenticated,
          isLoading,
          user,
          signout,
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};
