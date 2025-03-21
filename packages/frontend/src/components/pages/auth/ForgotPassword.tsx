import React, { useState } from 'react';
import { MailOutlined, LockOutlined, KeyOutlined } from '@ant-design/icons';
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
  Steps,
} from 'antd';
import rupee from '../../../../public/rupee.svg';
import { Link } from 'react-router';

const ForgotPassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState('');
  const [messageApi, messageContextHolder] = message.useMessage();

  // Request password reset
  const requestReset = async (values: { email: string }) => {
    try {
      setIsLoading(true);
      setEmail(values.email);

      // TODO: Implement your password reset request API call here
      // await passwordResetService.requestReset(values.email);

      // Mock API call with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));

      messageApi.success('Reset code has been sent to your email');
      setCurrentStep(1);
    } catch (error) {
      console.error(error);
      messageApi.error('Failed to send reset code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Verify reset code
  const verifyCode = async (values: { code: string }) => {
    try {
      setIsLoading(true);

      // TODO: Implement your code verification API call here
      // await passwordResetService.verifyCode(email, values.code);

      // Mock API call with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setCurrentStep(2);
    } catch (error) {
      console.error(error);
      messageApi.error('Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (values: { password: string }) => {
    try {
      setIsLoading(true);

      // TODO: Implement your password reset API call here
      // await passwordResetService.resetPassword(email, values.password);

      // Mock API call with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));

      messageApi.success('Password reset successful!');

      // Redirect to sign in page after a short delay
      setTimeout(() => {
        window.location.href = '/signin';
      }, 2000);
    } catch (error) {
      console.error(error);
      messageApi.error('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Form
            name="reset-request"
            initialValues={{ remember: true }}
            onFinish={requestReset}
          >
            <Typography.Paragraph>
              Enter your email address, and we'll send you a code to reset your
              password.
            </Typography.Paragraph>

            <Form.Item
              name="email"
              rules={[
                {
                  type: 'email',
                  required: true,
                  message: 'Please input your email address!',
                },
              ]}
            >
              <Input
                size="large"
                prefix={<MailOutlined />}
                placeholder="Email"
              />
            </Form.Item>

            <Form.Item>
              <Button
                loading={isLoading}
                block
                type="primary"
                htmlType="submit"
                size="large"
              >
                Send Reset Code
              </Button>
            </Form.Item>
          </Form>
        );

      case 1:
        return (
          <Form
            name="verify-code"
            initialValues={{ remember: true }}
            onFinish={verifyCode}
          >
            <Typography.Paragraph>
              We've sent a verification code to <strong>{email}</strong>. Please
              enter the code below.
            </Typography.Paragraph>

            <Form.Item
              name="code"
              rules={[
                {
                  required: true,
                  message: 'Please input verification code!',
                },
                {
                  min: 6,
                  max: 6,
                  message: 'Verification code must be 6 digits',
                },
              ]}
            >
              <Input
                size="large"
                prefix={<KeyOutlined />}
                placeholder="Verification Code"
                maxLength={6}
              />
            </Form.Item>

            <Form.Item>
              <Button
                loading={isLoading}
                block
                type="primary"
                htmlType="submit"
                size="large"
              >
                Verify Code
              </Button>
            </Form.Item>

            <Form.Item>
              <Flex justify="center">
                <Button type="link" onClick={() => setCurrentStep(0)}>
                  Send a new code
                </Button>
              </Flex>
            </Form.Item>
          </Form>
        );

      case 2:
        return (
          <Form
            name="reset-password"
            initialValues={{ remember: true }}
            onFinish={resetPassword}
          >
            <Typography.Paragraph>
              Enter your new password.
            </Typography.Paragraph>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input your new password!',
                },
                {
                  min: 6,
                  message: 'Password must be at least 6 characters',
                },
              ]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                placeholder="New Password"
                visibilityToggle={true}
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                {
                  required: true,
                  message: 'Please confirm your new password!',
                },
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
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                placeholder="Confirm New Password"
                visibilityToggle={true}
              />
            </Form.Item>

            <Form.Item>
              <Button
                loading={isLoading}
                block
                type="primary"
                htmlType="submit"
                size="large"
              >
                Reset Password
              </Button>
            </Form.Item>
          </Form>
        );

      default:
        return null;
    }
  };

  return (
    <Layout
      style={{
        height: '100%',
        width: '100%',
        background: '#f5f5f5',
      }}
    >
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
        <Space
          direction="vertical"
          size="large"
          align="center"
          style={{ marginBottom: 24 }}
        >
          <Image
            style={{
              width: 80,
              height: 80,
            }}
            preview={false}
            src={rupee}
          />
          <Typography.Title level={2} style={{ margin: 0 }}>
            Reset Password
          </Typography.Title>
          <Typography.Text type="secondary">
            Follow the steps to reset your password
          </Typography.Text>
        </Space>

        <div
          style={{
            minWidth: 360,
            maxWidth: 360,
            background: 'white',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Steps
            current={currentStep}
            size="small"
            style={{ marginBottom: 24 }}
            items={[
              {
                title: 'Request',
              },
              {
                title: 'Verify',
              },
              {
                title: 'Reset',
              },
            ]}
          />

          {renderStepContent()}

          <Divider plain>Or</Divider>

          <Flex justify="center" align="center">
            <Typography.Text type="secondary">
              Remember your password?
            </Typography.Text>
            <Button type="link" style={{ padding: '0 8px' }}>
              <Link to="/signin">Sign In</Link>
            </Button>
          </Flex>
        </div>
      </Flex>
    </Layout>
  );
};

export default ForgotPassword;
