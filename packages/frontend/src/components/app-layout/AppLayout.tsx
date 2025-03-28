import { Flex } from 'antd';
import { Layout, theme } from 'antd';
import React, { useContext, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import SideMenu from './SideMenu';
import ContentHeader from './content-header/ContentHeader';
import { ThemeContext } from '../../context/ThemeContext';
import { IsMobileContext } from '../../context/IsMobileContext';
const { Content, Sider } = Layout;

function AppLayout({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}) {
  const { isMobile } = useContext(IsMobileContext);
  const location = useLocation();
  const { isDark } = useContext(ThemeContext);
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    if (isMobile && !collapsed) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobile, collapsed]);

  useEffect(() => {
    // Update the HTML element's data-theme attribute
    document.documentElement.setAttribute(
      'data-theme',
      isDark ? 'dark' : 'light'
    );

    // Update the background color CSS variable
    document.documentElement.style.setProperty(
      '--background-color',
      isDark ? '#1C1D20' : '#f4f4f4'
    );
  }, [isDark]);

  return (
    <Layout style={{ height: '100%' }}>
      {/* Blur overlay for mobile */}
      {isMobile && !collapsed && (
        <div
          onClick={() => setCollapsed(true)}
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 998,
            transition: 'all 0.3s ease-in-out',
          }}
        />
      )}

      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        trigger={null}
        collapsedWidth={0}
        width={!isMobile ? 280 : undefined}
        theme={isDark ? 'dark' : 'light'}
        style={{
          position: isMobile ? 'fixed' : 'relative',
          height: '100%',
          zIndex: 999,
          left: 0,
          top: 0,
        }}
      >
        <SideMenu collapsed={collapsed} setCollapsed={setCollapsed} />
      </Sider>
      <Layout
        style={{
          height: '100%',
          marginLeft: isMobile ? 0 : undefined,
        }}
      >
        <Content
          style={{
            margin: '0 auto',
            marginTop: 16,
            marginBottom: 16,
            display: 'flex',
            flexDirection: 'column',
          }}
          className="content-container"
        >
          <ContentHeader
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            currentPath={location.pathname}
          />
          <Flex
            flex={1}
            style={{
              borderRadius: borderRadiusLG,
            }}
            vertical
            gap="middle"
          >
            <Outlet />
          </Flex>
        </Content>
      </Layout>
    </Layout>
  );
}

export default AppLayout;
