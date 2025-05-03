import React, { useContext, useEffect, useState } from 'react';
import { GoogleOutlined } from '@ant-design/icons';
import { Button, Flex, message, Layout, Image, Typography, Space } from 'antd';
import { AuthContext } from '../../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router';
import { useGoogleLogin } from '@react-oauth/google';
import { axiosInstance } from '../../../utils/httpUtil';

const SignIn: React.FC = () => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [messageApi, messageContextHolder] = message.useMessage();
  const navigate = useNavigate();
  const location = useLocation();

  const { setIsAuthenticated } = useContext(AuthContext);

  // Get the redirect path from location state, or default to '/'
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (err) {
      messageApi.error({
        content: err,
        onClose: () => {
          setErr(null);
        },
      });
    }
  }, [err, messageApi]);

  const googleSignin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await axiosInstance.post('/users/google/login', {
          ...tokenResponse,
        });

        const token = response?.data?.data?.token;

        if (token) {
          localStorage.setItem('authToken', token);
          setIsAuthenticated(true);
          messageApi.success('Successfully signed in with Google!');
          navigate(from, { replace: true });
        } else {
          throw new Error('Authentication token not found in response');
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.error?.message ||
          'Google Sign-In failed. Please try again.';

        setErr(errorMessage);
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: (error) => {
      messageApi.error(
        error?.error_description || 'Google Sign-In process failed.'
      );
      setIsGoogleLoading(false);
    },
    onNonOAuthError: (error) => {
      setIsGoogleLoading(false);
    },
    flow: 'auth-code',
  });

  return (
    <Layout style={{ height: '100%', width: '100%' }}>
      <Flex
        style={{
          height: '100%',
          width: '100%',
          padding: '20px',
        }}
        justify="center"
        align="center"
        vertical
      >
        {messageContextHolder}
        <Space direction="vertical" align="center" style={{ marginBottom: 24 }}>
          <Image
            style={{
              width: 80,
              height: 80,
            }}
            preview={false}
            src="/rupee.svg"
          />
          <Typography.Title level={2} style={{ margin: 0 }}>
            Welcome to Khajanchi
          </Typography.Title>
          <Typography.Text type="secondary">
            Please sign in with Google to continue
          </Typography.Text>
        </Space>

        <Button
          style={{ maxWidth: 300, marginTop: 24 }}
          loading={isGoogleLoading}
          disabled={isGoogleLoading}
          block
          type="primary"
          size="large"
          icon={<GoogleOutlined />}
          onClick={() => {
            setIsGoogleLoading(true);
            googleSignin();
          }}
        >
          Sign In with Google
        </Button>
      </Flex>
    </Layout>
  );
};

export default SignIn;
