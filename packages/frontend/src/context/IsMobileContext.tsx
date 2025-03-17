import { createContext, useEffect, useState } from 'react';

export const isMobileDevice = () =>
  window.innerWidth <= 768 ||
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export const IsMobileContext = createContext({
  isMobile: false,
  setIsMobile: (isMobile: boolean): void => {
    throw new Error('setIsMobile function not implemented');
  },
});

export const IsMobileProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMobile, setIsMobile] = useState(() => {
    const isMobile = isMobileDevice();
    return isMobile;
  });

  useEffect(() => {
    const isMobile = isMobileDevice();
    setIsMobile(isMobile);
  }, []);

  useEffect(() => {
    const isMobile = isMobileDevice();
    setIsMobile(isMobile);
  }, []);

  return <IsMobileContext.Provider value={{ isMobile, setIsMobile }}>{children}</IsMobileContext.Provider>;
};
