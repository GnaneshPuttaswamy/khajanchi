import React from 'react';
import { Button, Flex, Space } from 'antd';
import { LayoutOutlined } from '@ant-design/icons';
import PageBreadcrumb from './PageBreadcrumb';
import ActionButtons from './ActionButtons';

interface ContentHeaderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  isMobile: boolean;
  currentPath: string;
}

const ContentHeader: React.FC<ContentHeaderProps> = ({ collapsed, setCollapsed, isMobile, currentPath }) => {
  return (
    <Flex
      style={{
        marginBottom: 16,
      }}
      justify="space-between"
    >
      <Space
        style={{
          height: 40,
        }}
      >
        {collapsed && (
          <Button
            size={!isMobile ? 'large' : undefined}
            icon={<LayoutOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              marginRight: 16,
            }}
            type="text"
          />
        )}
        <PageBreadcrumb path={currentPath} />
      </Space>

      <ActionButtons />
    </Flex>
  );
};

export default ContentHeader;
