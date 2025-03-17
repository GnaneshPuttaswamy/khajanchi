import React from 'react';
import { Breadcrumb, Flex, Typography } from 'antd';
import { HistoryOutlined, SettingOutlined, TransactionOutlined } from '@ant-design/icons';

interface PageBreadcrumbProps {
  path: string;
}

const PageBreadcrumb: React.FC<PageBreadcrumbProps> = ({ path }) => {
  const getBreadcrumbTitle = () => {
    if (path === '/add-transaction') {
      return (
        <Flex vertical={false} gap="middle" align="center">
          <TransactionOutlined />
          <Typography.Text>Add Transaction</Typography.Text>
        </Flex>
      );
    }
    if (path === '/transaction-history') {
      return (
        <Flex vertical={false} gap="middle" align="center">
          <HistoryOutlined />
          <Typography.Text>Transaction History</Typography.Text>
        </Flex>
      );
    }
    if (path === '/settings') {
      return (
        <Flex vertical={false} gap="middle" align="center">
          <SettingOutlined />
          <Typography.Text>Settings</Typography.Text>
        </Flex>
      );
    }
    return (
      <Flex vertical={false} gap="middle" align="center">
        <TransactionOutlined />
        <Typography.Text>Add Transaction</Typography.Text>
      </Flex>
    );
  };

  return (
    <Breadcrumb
      items={[
        {
          title: getBreadcrumbTitle(),
        },
      ]}
    />
  );
};

export default PageBreadcrumb;
