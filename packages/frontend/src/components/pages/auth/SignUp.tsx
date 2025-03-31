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
  Card,
} from 'antd';
import { AuthContext } from '../../../context/AuthContext';
import rupee from '../../../../public/rupee.svg';
import { Link, useLocation, useNavigate } from 'react-router';

const SignUp: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [messageApi, messageContextHolder] = message.useMessage();

  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

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

  const onFinish = async (values: any) => {
    try {
      setIsLoading(true);

      const { email, password } = values;
      await signup(email, password);

      navigate(from, { replace: true });
    } catch (error) {
      console.error('SignUp :: onFinish() :: Error while signing up', error);
      setErr('Unable to Sign Up!!');
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
            src={rupee}
          />
          <Typography.Title level={2} style={{ margin: 0 }}>
            Create Account
          </Typography.Title>
          <Typography.Text type="secondary">
            Sign up to get started
          </Typography.Text>
        </Space>

        <Card style={{ minWidth: 360, maxWidth: 360 }}>
          <Form
            name="signup"
            initialValues={{ remember: true }}
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
              <Input prefix={<MailOutlined />} placeholder="Email" />
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
        </Card>
      </Flex>
    </Layout>
  );
};

export default SignUp;
