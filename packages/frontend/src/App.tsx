import React, { useContext, useEffect, useState } from 'react';

import { ConfigProvider, theme } from 'antd';
import './App.css';
import AppLayout from './components/app-layout/AppLayout';
import { ThemeContext } from './context/ThemeContext';
import { CompactModeContext } from './context/CompactModeContext';
import { IsMobileContext, isMobileDevice } from './context/IsMobileContext';

const App: React.FC = () => {
  const { isMobile, setIsMobile } = useContext(IsMobileContext);
  const { isDark } = useContext(ThemeContext);
  const { isCompact } = useContext(CompactModeContext);

  const [collapsed, setCollapsed] = useState(isMobile);

  useEffect(() => {
    const checkMobile = () => {
      const mobileCheck = isMobileDevice();
      setIsMobile(mobileCheck);
      setCollapsed(mobileCheck);
    };

    // Add debounced resize handler
    let resizeTimer: any;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkMobile, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [setIsMobile, setCollapsed]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#2d5cba',
          colorInfo: '#2d5cba',
          colorTextBase: isDark ? '#D7FFFF' : '#00164e',
          colorBgBase: isDark ? '#1C1D20' : '#fdffff',
        },
        components: {
          Menu: {
            darkItemBg: isDark ? '#2d2f39' : '#fdffff',
          },
          Breadcrumb: {
            iconFontSize: 20,
          },
          Layout: {
            siderBg: isDark ? '#2d2f39' : '#fdffff',
          },
          Segmented: {
            itemSelectedColor: '#2d5cba',
            trackPadding: 1,
          },
        },
        algorithm: [
          isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
          isCompact ? theme.compactAlgorithm : null,
        ].filter(Boolean) as any,
      }}
    >
      <AppLayout collapsed={collapsed} setCollapsed={setCollapsed} />
    </ConfigProvider>
  );
};

export default App;
