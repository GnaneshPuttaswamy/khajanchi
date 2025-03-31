import React, { useState } from 'react';
import { MailOutlined } from '@ant-design/icons';
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
import { Link } from 'react-router';
import { axiosInstance } from '../../../utils/httpUtil';

const ForgotPassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [messageApi, messageContextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const requestPasswordReset = async (values: { email: string }) => {
    try {
      setIsLoading(true);
      setEmail(values.email);

      await axiosInstance.post('/users/request-password-reset', {
        email: values.email,
      });

      // Always show success even if email doesn't exist (security best practice)
      setIsSubmitted(true);
    } catch (error) {
      console.error(
        'ForgotPassword :: requestPasswordReset() :: Error while requesting password reset =>',
        error
      );
      messageApi.error(
        'Error while requesting password reset. Please try again.'
      );
    } finally {
      setIsLoading(false);
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
            We'll send you a reset link via email
          </Typography.Text>
        </Space>

        <Card style={{ minWidth: 360, maxWidth: 360 }}>
          {!isSubmitted ? (
            <Form
              form={form}
              name="resetRequest"
              initialValues={{ remember: true }}
              onFinish={requestPasswordReset}
            >
              <Typography.Paragraph>
                Enter your email address, and we'll send you a link to reset
                your password.
              </Typography.Paragraph>

              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: 'Please input your email address!',
                  },
                ]}
                validateTrigger="onSubmit"
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Email"
                  onChange={() =>
                    form.setFields([{ name: 'email', errors: [] }])
                  }
                />
              </Form.Item>

              <Form.Item>
                <Button
                  loading={isLoading}
                  block
                  type="primary"
                  htmlType="submit"
                >
                  Send Reset Link
                </Button>
              </Form.Item>
            </Form>
          ) : (
            <Result
              status="success"
              title="Email Sent!"
              subTitle={`We've sent a password reset link to ${email}. Please check your inbox and follow the instructions to reset your password.`}
              extra={[
                <Button type="primary" key="console">
                  <Link to="/signin">Back to Sign In</Link>
                </Button>,
              ]}
            />
          )}

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

export default ForgotPassword;
