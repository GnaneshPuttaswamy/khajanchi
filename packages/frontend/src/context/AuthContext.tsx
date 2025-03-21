import axios from 'axios';
import React, { createContext, useState, useEffect } from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  signin: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  signout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('authToken')) {
      setIsAuthenticated(true);
    }
  }, []);

  const signin = async (email: string, password: string) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/users/login`,
      {
        email,
        password,
      }
    );

    localStorage.setItem('authToken', response.data?.data?.token);
    setIsAuthenticated(true);
  };

  const signup = async (email: string, password: string) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/users/register`,
      {
        email,
        password,
      }
    );

    localStorage.setItem('authToken', response.data?.data?.token);
    setIsAuthenticated(true);
  };

  const signout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, signin, signup, signout }}>
      {children}
    </AuthContext.Provider>
  );
};
