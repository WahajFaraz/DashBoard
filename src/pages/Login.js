// pages/Login.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig'; // Adjusted path for firebaseConfig
import { Form, Input, Button, Typography, message, Card } from 'antd';

const { Title, Text } = Typography;

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    const { email, password } = values;
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      message.success('Login successful!');
      navigate('/dashboard'); // Navigate to Dashboard
    } catch (error) {
      message.error('Invalid email or password. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="max-w-md w-full mx-auto p-6 rounded-lg shadow-lg">
        <Title level={2} className="text-center">
          Login
        </Title>
        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please enter your email!' }]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password!' }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Login
            </Button>
          </Form.Item>
        </Form>
        <Text>
          Don't have an account?{' '}
          <a onClick={() => navigate('/signUp')}>Sign Up</a>
        </Text>
      </Card>
    </div>
  );
}
