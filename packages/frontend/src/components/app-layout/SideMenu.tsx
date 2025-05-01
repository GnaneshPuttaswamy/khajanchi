import React, { useContext } from 'react';
import {
  Menu,
  MenuProps,
  Avatar,
  Typography,
  Button,
  Flex,
  Space,
  Dropdown,
} from 'antd';
import {
  UserOutlined,
  LayoutOutlined,
  TransactionOutlined,
  HistoryOutlined,
  DownOutlined,
  LogoutOutlined,
  LineChartOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router';
import { ThemeContext } from '../../context/ThemeContext';
import { IsMobileContext } from '../../context/IsMobileContext';
import { AuthContext } from '../../context/AuthContext';
type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const truncateText = (text: string, maxLength: number) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

interface SideMenuProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useContext(ThemeContext);
  const { isMobile } = useContext(IsMobileContext);
  const { signout, user } = useContext(AuthContext);

  const items: MenuItem[] = [
    getItem(
      <Typography.Text>Dashboard</Typography.Text>,
      '1',
      <LineChartOutlined />
    ),
    getItem(
      <Typography.Text>Add Transaction</Typography.Text>,
      '2',
      <TransactionOutlined />
    ),
    getItem(
      <Typography.Text>Transaction History</Typography.Text>,
      '3',
      <HistoryOutlined />
    ),
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    const currentSearchParams = new URLSearchParams(location.search);

    if (key === '1') {
      navigate('/dashboard');
    } else if (key === '2') {
      navigate({
        pathname: '/add-transaction',
        search: currentSearchParams.toString(),
      });
    } else if (key === '3') {
      navigate({
        pathname: '/transaction-history',
        search: currentSearchParams.toString(),
      });
    }

    // Close the menu on mobile after navigation
    if (isMobile) {
      setCollapsed(true);
    }
  };

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === '/dashboard') return ['1'];
    if (path === '/add-transaction') return ['2'];
    if (path === '/transaction-history') return ['3'];
    return ['1']; // Default to Add Transaction
  };

  const handleSignOut = () => {
    signout();
  };

  const userMenuItems = [
    {
      key: 'signout',
      icon: <LogoutOutlined />,
      label: 'Sign Out',
      onClick: handleSignOut,
    },
  ];

  return (
    <>
      <Space
        style={{
          padding: 16,
          paddingLeft: 24,
          display: 'flex',
          justifyContent: 'space-between',
          opacity: collapsed ? 0 : 1,
          visibility: collapsed ? 'hidden' : 'visible',
          transition: 'opacity 0.3s ease-in-out',
          pointerEvents: collapsed ? 'none' : 'auto',
        }}
      >
        <Dropdown menu={{ items: userMenuItems }}>
          <Flex gap="small" align="center">
            <Avatar
              size={!isMobile ? 'large' : undefined}
              icon={<UserOutlined />}
              src={user?.avatarUrl}
            />
            <Typography.Text ellipsis={{ tooltip: true }} strong>
              {truncateText(user?.firstName || '---', 15)}
            </Typography.Text>
            <Button
              type="text"
              size="small"
              icon={
                <DownOutlined
                  size={8}
                  style={{
                    top: 1,
                    position: 'relative',
                  }}
                />
              }
            ></Button>
          </Flex>
        </Dropdown>
        <Button
          hidden={collapsed}
          size={!isMobile ? 'large' : undefined}
          icon={<LayoutOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          type="text"
        />
      </Space>

      <Menu
        theme={isDark ? 'dark' : 'light'}
        selectedKeys={getSelectedKey()}
        mode="inline"
        items={items}
        onClick={handleMenuClick}
      />
    </>
  );
};

export default SideMenu;
