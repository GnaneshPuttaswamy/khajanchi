import React, { useContext } from 'react';
import { Menu, MenuProps, Avatar, Typography, Button, Flex, Space } from 'antd';
import {
  UserOutlined,
  LayoutOutlined,
  TransactionOutlined,
  HistoryOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router';
import { ThemeContext } from '../../context/ThemeContext';
import { IsMobileContext } from '../../context/IsMobileContext';
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

interface SideMenuProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useContext(ThemeContext);
  const { isMobile } = useContext(IsMobileContext);

  const items: MenuItem[] = [
    getItem(
      <Typography.Text>Add Transaction</Typography.Text>,
      '1',
      <TransactionOutlined />
    ),
    getItem(
      <Typography.Text>Transaction History</Typography.Text>,
      '2',
      <HistoryOutlined />
    ),
    getItem(
      <Typography.Text>Settings</Typography.Text>,
      '3',
      <SettingOutlined />
    ),
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === '1') {
      navigate('/add-transaction');
    } else if (key === '2') {
      navigate('/transaction-history');
    } else if (key === '3') {
      navigate('/settings');
    }

    // Close the menu on mobile after navigation
    if (isMobile) {
      setCollapsed(true);
    }
  };

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === '/add-transaction') return ['1'];
    if (path === '/transaction-history') return ['2'];
    if (path === '/settings') return ['3'];
    return ['1']; // Default to Add Transaction
  };

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
        <Flex gap="small" align="center">
          <Avatar
            size={!isMobile ? 'large' : undefined}
            icon={<UserOutlined />}
          />
          <Typography.Text strong>User</Typography.Text>
        </Flex>
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
