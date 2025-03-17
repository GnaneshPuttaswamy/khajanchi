import { createContext, useEffect, useState } from 'react';

export const ThemeContext = createContext({
  isDark: false,
  setIsDark: (isDark: boolean): void => {
    throw new Error('setIsDark function not implemented');
  },
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(() => {
    const theme = localStorage.getItem('theme');
    return theme ? theme === 'dark' : false;
  });

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme) {
      setIsDark(theme === 'dark');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return <ThemeContext.Provider value={{ isDark, setIsDark }}>{children}</ThemeContext.Provider>;
};
