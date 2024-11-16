import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig'; // Adjusted path for firebaseConfig
import { db } from '../config/firebaseConfig'; // Firestore configuration (import this if using Firestore)
import { Form, Input, Button, Typography, message, Card } from 'antd';
import { doc, setDoc } from 'firebase/firestore'; // Firestore functions

const { Title, Text } = Typography;

export default function SignUp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (values) => {
    const { email, password } = values;
    setLoading(true);
    try {
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // After creating user, save their information in Firestore (or Realtime Database)
      const user = userCredential.user;

      // Create a user document in Firestore
      await setDoc(doc(db, 'signUpUsers', user.uid), {
        email: user.email,
        createdAt: new Date(),
        // Add more fields if necessary
      });

      message.success('Account created successfully!');
      navigate('/login'); // Navigate to Login page
    } catch (error) {
      message.error('Error signing up. Please try again.');
      console.error(error); // Log the error to debug
    }
    setLoading(false);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="max-w-md w-full mx-auto p-6 rounded-lg shadow-lg">
        <Title level={2} className="text-center">
          Sign Up
        </Title>
        <Form layout="vertical" onFinish={handleSignUp}>
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
              Sign Up
            </Button>
          </Form.Item>
        </Form>
        <Text>
          Already have an account?{' '}
          <a onClick={() => navigate('/login')}>Login</a>
        </Text>
      </Card>
    </div>
  );
}
