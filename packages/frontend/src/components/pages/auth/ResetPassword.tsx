import React, { useState, useEffect } from 'react';
import { LockOutlined } from '@ant-design/icons';
import {
  Button,
  Form,
  Input,
  Flex,
  message,
  Layout,
  Image,
  Divider,
  Typography,
  Space,
  Card,
  Result,
} from 'antd';
import { Link, useParams, useNavigate } from 'react-router';
import { axiosInstance } from '../../../utils/httpUtil';

const InvalidTokenView: React.FC = () => (
  <Result
    status="error"
    title="Invalid or Expired Link"
    subTitle="This password reset link is invalid or has expired."
    extra={[
      <Button type="primary" key="console">
        <Link to="/forgot-password">Request New Link</Link>
      </Button>,
    ]}
  />
);

type PasswordResetFormProps = {
  isLoading: boolean;
  onSubmit: (values: { password: string }) => void;
};

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({
  isLoading,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      name="reset-password"
      initialValues={{ remember: true }}
      onFinish={onSubmit}
    >
      <Typography.Paragraph>Enter your new password.</Typography.Paragraph>

      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your new password!',
          },
        ]}
        validateTrigger="onSubmit"
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="New Password"
          visibilityToggle={true}
          onChange={() => form.setFields([{ name: 'password', errors: [] }])}
        />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        dependencies={['password']}
        rules={[
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error('The two passwords do not match!')
              );
            },
          }),
        ]}
        validateTrigger="onSubmit"
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Confirm New Password"
          visibilityToggle={true}
          onChange={() =>
            form.setFields([{ name: 'confirmPassword', errors: [] }])
          }
        />
      </Form.Item>

      <Form.Item>
        <Button loading={isLoading} block type="primary" htmlType="submit">
          Reset Password
        </Button>
      </Form.Item>
    </Form>
  );
};

// Success View Component
const SuccessView: React.FC = () => (
  <Result
    status="success"
    title="Password Reset Successful!"
    subTitle="Your password has been successfully reset."
    extra={[
      <Button type="primary" key="console">
        <Link to="/signin">Sign In</Link>
      </Button>,
    ]}
  />
);

// Main Component
const ResetPassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true); // Assume token is valid until proven otherwise
  const [messageApi, messageContextHolder] = message.useMessage();
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  // Verify token on component mount
  useEffect(() => {
    if (!token) {
      setIsTokenValid(false);
      messageApi.error('Invalid or expired reset link');
    }
  }, [token, messageApi]);

  const resetPassword = async (values: { password: string }) => {
    try {
      setIsLoading(true);

      await axiosInstance.post('/users/reset-password', {
        token,
        password: values.password,
      });

      messageApi.success('Password reset successful!');
      setIsSubmitted(true);

      setTimeout(() => {
        navigate('/signin');
      }, 5000);
    } catch (error) {
      console.error('ResetPassword :: resetPassword() :: error => ', error);
      messageApi.error('Failed to reset password. The link may have expired.');
      setIsTokenValid(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Render the appropriate content based on state
  const renderContent = () => {
    if (!isTokenValid) {
      return <InvalidTokenView />;
    } else if (isSubmitted) {
      return <SuccessView />;
    } else {
      return (
        <PasswordResetForm isLoading={isLoading} onSubmit={resetPassword} />
      );
    }
  };

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
            Reset Password
          </Typography.Title>
          <Typography.Text type="secondary">
            Create a new password for your account
          </Typography.Text>
        </Space>

        <Card style={{ minWidth: 360, maxWidth: 360 }}>
          {renderContent()}

          <Divider plain>Or</Divider>

          <Flex justify="center" align="center">
            <Typography.Text type="secondary">
              Remember your password?
            </Typography.Text>
            <Button type="link" style={{ padding: '0 8px' }}>
              <Link to="/signin">Sign In</Link>
            </Button>
          </Flex>
        </Card>
      </Flex>
    </Layout>
  );
};

export default ResetPassword;
