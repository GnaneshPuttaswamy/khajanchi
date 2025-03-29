import React from 'react';
import { Layout, Spin, Typography, Space, Flex } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const LoadingPage: React.FC = () => {
  return (
    <Layout
      style={{
        height: '100%',
        width: '100%',
      }}
    >
      <Flex
        justify="center"
        align="center"
        style={{
          height: '100%',
          width: '100%',
        }}
      >
        <Space direction="vertical" align="center">
          <Spin indicator={<LoadingOutlined spin />} size="large" />
          <Typography.Text
            style={{
              fontSize: 16,
              marginTop: 16,
            }}
          >
            {'Loading...'}
          </Typography.Text>
        </Space>
      </Flex>
    </Layout>
  );
};

export default LoadingPage;
