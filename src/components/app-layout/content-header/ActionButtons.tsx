import React from 'react';
import { Button, Space, Tooltip } from 'antd';
import { CompressOutlined, ExpandOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons';

interface ActionButtonsProps {
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
  isCompact: boolean;
  setIsCompact: (isCompact: boolean) => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ isDark, setIsDark, isCompact, setIsCompact }) => {
  return (
    <Space>
      <Tooltip title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
        <Button
          shape="circle"
          type="text"
          icon={isDark ? <SunOutlined /> : <MoonOutlined />}
          onClick={() => setIsDark(!isDark)}
          aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        />
      </Tooltip>

      <Tooltip title={isCompact ? 'Switch to Comfortable Layout' : 'Switch to Compact Layout'}>
        <Button
          shape="circle"
          type="text"
          icon={isCompact ? <ExpandOutlined /> : <CompressOutlined />}
          onClick={() => setIsCompact(!isCompact)}
          aria-label={isCompact ? 'Switch to Comfortable Layout' : 'Switch to Compact Layout'}
        />
      </Tooltip>
    </Space>
  );
};

export default ActionButtons;
