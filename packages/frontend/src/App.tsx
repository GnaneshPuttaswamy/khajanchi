import React, { useContext, useEffect, useState } from 'react';

import { ConfigProvider, theme } from 'antd';
import './App.css';
import AppLayout from './components/app-layout/AppLayout';
import { ThemeContext } from './context/ThemeContext';
import { CompactModeContext } from './context/CompactModeContext';
import { IsMobileContext, isMobileDevice } from './context/IsMobileContext';
import SignIn from './components/pages/auth/SignIn';
import { Navigate, Route, Routes } from 'react-router';
import { AuthContext } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AddTransactionPage from './components/pages/add-transaction-page/AddTransactionPage';
import AllTransactionsPage from './components/pages/all-transactions-page/AllTransactionsPage';
import AuthRoute from './components/AuthRoute';
import NotFoundPage from './components/NotFoundPage';
import LoadingPage from './components/LoadingPage';
import Dashboard from './components/pages/Dashboard';

const App: React.FC = () => {
  const { isMobile, setIsMobile } = useContext(IsMobileContext);
  const { isDark } = useContext(ThemeContext);
  const { isCompact } = useContext(CompactModeContext);
  const { isLoading } = useContext(AuthContext);

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
      {isLoading ? (
        <LoadingPage />
      ) : (
        <Routes>
          {/* Public routes */}
          <Route>
            <Route
              path="/signin"
              element={
                <AuthRoute>
                  <SignIn />
                </AuthRoute>
              }
            />
          </Route>

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              element={
                <AppLayout collapsed={collapsed} setCollapsed={setCollapsed} />
              }
            >
              {/* Redirect root to add-transaction */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/add-transaction" element={<AddTransactionPage />} />

              <Route
                path="/transaction-history"
                element={<AllTransactionsPage />}
              />
            </Route>
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      )}
    </ConfigProvider>
  );
};

export default App;
