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
  Card,
} from 'antd';
import { AuthContext } from '../../../context/AuthContext';
import rupee from '../../../../public/rupee.svg';
import { Link, useLocation, useNavigate } from 'react-router';

const SignIn: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [messageApi, messageContextHolder] = message.useMessage();
  const navigate = useNavigate();
  const location = useLocation();

  const { signin } = useContext(AuthContext);

  // Get the redirect path from location state, or default to '/add-transaction'
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
      await signin(email, password);

      navigate(from, { replace: true });
    } catch (error) {
      console.log(error);
      setErr('Unable to Sign In!!');
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
            Welcome Back
          </Typography.Title>
          <Typography.Text type="secondary">
            Please sign in to your account
          </Typography.Text>
        </Space>

        <Card style={{ minWidth: 360, maxWidth: 360 }}>
          <Form
            name="signin"
            initialValues={{ remember: true }}
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
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your Password!' },
              ]}
            >
              <Input.Password
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
        </Card>
      </Flex>
    </Layout>
  );
};

export default SignIn;
