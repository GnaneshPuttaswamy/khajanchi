import React, { useContext } from 'react';
import { Button, Layout, Typography, Space } from 'antd';
import { useNavigate } from 'react-router';
import { HomeOutlined } from '@ant-design/icons';
import { ThemeContext } from '../context/ThemeContext';

const { Content } = Layout;
const { Title, Text } = Typography;

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { isDark } = useContext(ThemeContext);

  return (
    <Layout style={{ height: '100vh', width: '100%' }}>
      <Content
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '24px',
          backgroundColor: isDark ? '#1C1D20' : '#fdffff',
        }}
      >
        <Space
          direction="vertical"
          align="center"
          size="large"
          style={{ textAlign: 'center' }}
        >
          <Title
            level={1}
            style={{
              fontSize: '72px',
              margin: 0,
              color: '#2d5cba',
            }}
          >
            404
          </Title>
          <Title level={3} style={{ marginTop: 0 }}>
            Page Not Found
          </Title>
          <Text
            style={{
              fontSize: '16px',
              color: isDark ? '#D7FFFF' : '#00164e',
              opacity: 0.75,
              maxWidth: '500px',
            }}
          >
            The page you're looking for doesn't exist or has been moved.
          </Text>
          <Button
            type="primary"
            icon={<HomeOutlined />}
            onClick={() => navigate('/add-transaction')}
            style={{ marginTop: '16px' }}
          >
            Back to Home
          </Button>
        </Space>
      </Content>
    </Layout>
  );
};

export default NotFoundPage;
