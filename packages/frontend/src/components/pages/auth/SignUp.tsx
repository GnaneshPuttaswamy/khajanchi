import React, { useContext, useEffect, useState } from 'react';
import { LockOutlined, MailOutlined, UserAddOutlined } from '@ant-design/icons';
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

const SignUp: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [messageApi, messageContextHolder] = message.useMessage();

  const { signup } = useContext(AuthContext);

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
      setIsLoading(true);
      const { email, password } = values;
      await signup(email, password);
    } catch (error) {
      console.log(error);
      setErr('Unable to Sign Up!');
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
            Create Account
          </Typography.Title>
          <Typography.Text type="secondary">
            Sign up to get started
          </Typography.Text>
        </Space>

        <Form
          name="signup"
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
          {/* <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: 'Please input your full name!',
              },
            ]}
          >
            <Input
              size="large"
              prefix={<UserOutlined />}
              placeholder="Full Name"
            />
          </Form.Item> */}

          <Form.Item
            name="email"
            rules={[
              {
                type: 'email',
                required: true,
                message: 'Please input a valid email address!',
              },
            ]}
          >
            <Input size="large" prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
              placeholder="Password"
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
              icon={<UserAddOutlined />}
            >
              Create Account
            </Button>
          </Form.Item>

          <Divider plain>Or</Divider>

          <Flex justify="center" align="center">
            <Typography.Text type="secondary">
              Already have an account?
            </Typography.Text>
            <Button type="link" style={{ padding: '0 8px' }}>
              <Link to="/signin">Sign In</Link>
            </Button>
          </Flex>
        </Form>
      </Flex>
    </Layout>
  );
};

export default SignUp;
