import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import Dashboardbg from '../assets/dashboardbg.jpg';
import { Form, Input, Button, Typography, message, Divider, Card } from 'antd';

const { Title, Text } = Typography;

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    const { email, password } = values;
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      message.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      message.error('Invalid email or password. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gray-100">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${Dashboardbg})` }}
      ></div>
      <div className="absolute inset-0 bg-black opacity-40"></div>

      {/* Login Card */}
      <div className="relative z-10 max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="rounded-lg shadow-2xl">
          <Title level={2} className="text-center text-gray-800">
            Admin Login
          </Title>
          <Divider className="border-t-2 border-gray-200" />
          <Text
            type="secondary"
            className="block text-center mb-6 text-gray-600"
          >
            Welcome, Admin! Please log in to manage your dashboard .
          </Text>

          <Form layout="vertical" onFinish={handleLogin} className="space-y-4">
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please enter your email!' }]}
            >
              <Input
                placeholder="Enter your email"
                className="p-2 rounded border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please enter your password!' },
              ]}
            >
              <Input.Password
                placeholder="Enter your password"
                className="p-2 rounded border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="none"
                className="w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-500 transition duration-200"
                htmlType="submit"
                loading={loading}
              >
                Login
              </Button>
            </Form.Item>
          </Form>

          {/* Thank You Note */}
          <div className="mt-6 text-center">
            <Text className="text-gray-800 font-semibold">
              Thank you for taking the time to secure and manage the dashboard.
            </Text>
            <Text className="block mt-2 text-gray-600">
              Your role as admin is greatly appreciated!
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
}
