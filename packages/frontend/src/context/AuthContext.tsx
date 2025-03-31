import React, { createContext, useState, useEffect } from 'react';
import { AUTH_ERROR_EVENT, axiosInstance } from '../utils/httpUtil';
import { useNavigate } from 'react-router';
import { message } from 'antd';

type User = {
  email: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  signin: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  signout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  signin: async () => {
    throw new Error('signin not implemented');
  },
  signup: async () => {
    throw new Error('signup not implemented');
  },
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

  const signin = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post('/users/login', {
        email,
        password,
      });

      localStorage.setItem('authToken', response.data?.data?.token);
      setIsAuthenticated(true);

      messageApi.success('Successfully signed in!');
    } catch (error) {
      messageApi.error('Failed to sign in. Please check your credentials.');
      throw error;
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post('/users/register', {
        email,
        password,
      });

      localStorage.setItem('authToken', response.data?.data?.token);
      setIsAuthenticated(true);

      messageApi.success('Successfully signed up!');
    } catch (error) {
      messageApi.error('Failed to sign up. Please try again.');
      throw error;
    }
  };

  const signout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);

    messageApi.info('You have been signed out.');
  };

  return (
    <>
      {contextHolder}
      <AuthContext.Provider
        value={{ isAuthenticated, isLoading, user, signin, signup, signout }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};
