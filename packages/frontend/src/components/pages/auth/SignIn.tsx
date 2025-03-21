import React, { useContext, useEffect, useState } from 'react';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
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
} from 'antd';
import { AuthContext } from '../../../context/AuthContext';
import rupee from '../../../../public/rupee.svg';
import { Link } from 'react-router';

const SignIn: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [messageApi, messageContextHolder] = message.useMessage();

  const { signin } = useContext(AuthContext);

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

  const onFinish = async (values: any) => {
    try {
      const { email, password } = values;
      await signin(email, password);
    } catch (error) {
      console.log(error);
      setErr('Unable to Sign In!!');
    } finally {
      setIsLoading(false);
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
            Welcome Back
          </Typography.Title>
          <Typography.Text type="secondary">
            Please sign in to your account
          </Typography.Text>
        </Space>

        <Form
          name="signin"
          initialValues={{ remember: true }}
          style={{
            minWidth: 360,
            maxWidth: 360,
            background: 'white',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
          onFinish={onFinish}
          validateTrigger="onSubmit"
        >
          <Form.Item
            name="email"
            rules={[
              {
                type: 'email',
                required: true,
                message: 'Please input your Email!',
              },
            ]}
          >
            <Input size="large" prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
              placeholder="Password"
              visibilityToggle={true}
            />
          </Form.Item>
          <Form.Item>
            <Flex justify="flex-end" align="center">
              <Button type="link" style={{ padding: 0 }}>
                <Link to="/forgot-password">Forgot password</Link>
              </Button>
            </Flex>
          </Form.Item>

          <Form.Item>
            <Button
              loading={isLoading}
              block
              type="primary"
              htmlType="submit"
              size="large"
            >
              Sign In
            </Button>
          </Form.Item>

          <Divider plain>Or</Divider>

          <Flex justify="center" align="center">
            <Typography.Text type="secondary">
              Don't have an account?
            </Typography.Text>
            <Button type="link" style={{ padding: '0 8px' }}>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </Flex>
        </Form>
      </Flex>
    </Layout>
  );
};

export default SignIn;
