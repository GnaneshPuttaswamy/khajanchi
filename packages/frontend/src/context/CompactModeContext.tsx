import { createContext, useEffect, useState } from 'react';

export const CompactModeContext = createContext({
  isCompact: false,
  setIsCompact: (isCompact: boolean): void => {
    throw new Error('setIsCompact function not implemented');
  },
});

export const CompactModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isCompact, setIsCompact] = useState(() => {
    const isCompact = localStorage.getItem('isCompact');
    return isCompact ? isCompact === 'true' : false;
  });

  useEffect(() => {
    const isCompact = localStorage.getItem('isCompact');
    if (isCompact) {
      setIsCompact(isCompact === 'true');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('isCompact', isCompact.toString());
  }, [isCompact]);

  return <CompactModeContext.Provider value={{ isCompact, setIsCompact }}>{children}</CompactModeContext.Provider>;
};
