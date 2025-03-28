import React, { createContext, useState, useEffect } from 'react';
import { axiosInstance } from '../utils/httpUtil';

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  signin: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  signout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
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

  // useEffect(() => {
  //   if (localStorage.getItem('authToken')) {
  //     setIsAuthenticated(true);
  //   }
  // }, []);

  useEffect(() => {
    // Any additional auth validation could go here
    // For example, checking if the token is valid/expired
    setIsLoading(false);
  }, []);

  const signin = async (email: string, password: string) => {
    const response = await axiosInstance.post('/users/login', {
      email,
      password,
    });

    localStorage.setItem('authToken', response.data?.data?.token);
    setIsAuthenticated(true);
  };

  const signup = async (email: string, password: string) => {
    const response = await axiosInstance.post('/users/register', {
      email,
      password,
    });

    localStorage.setItem('authToken', response.data?.data?.token);
    setIsAuthenticated(true);
  };

  const signout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, signin, signup, signout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
