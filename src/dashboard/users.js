import React, { useEffect, useState } from 'react';
import { db } from '../config/firebaseConfig';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from 'firebase/firestore';
import { Table, Button, Modal, Input, message, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      setUsers(
        snapshot.docs.map((doc, index) => ({
          id: doc.id,
          number: index + 1,
          ...doc.data(),
        }))
      );
    });
    return unsubscribe;
  }, []);

  const addUser = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      message.warning('Please enter name, email, and password');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'users'), { name, email, password });
      message.success('User added successfully');
      setName('');
      setEmail('');
      setPassword('');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding user:', error);
      message.error('Failed to add user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (user) => {
    setEditingUserId(user.id);
    setName(user.name);
    setEmail(user.email);
    setPassword(user.password);
    setIsEditModalOpen(true);
  };

  const editUser = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      message.warning('Please enter name, email, and password');
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, 'users', editingUserId);
      await updateDoc(userRef, { name, email, password });
      message.success('User updated successfully');
      setName('');
      setEmail('');
      setPassword('');
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error editing user:', error);
      message.error('Failed to edit user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      message.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Failed to delete user. Please try again.');
    }
  };

  const columns = [
    { title: 'No.', dataIndex: 'number', key: 'number' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, user) => (
        <div className="flex space-x-2">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openEditModal(user)}
            className="text-blue-500 hover:text-blue-700"
          >
            Edit
          </Button>
          <Button
            type="link"
            icon={<DeleteOutlined />}
            danger
            onClick={() => deleteUser(user.id)}
            className="text-red-500 hover:text-red-700"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-10 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center bg-white shadow-md rounded-lg p-5">
        <h2 className="text-2xl font-bold text-gray-700">Users List</h2>
        <Button
          type="default"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 text-white hover:bg-green-600 font-medium px-4 py-2 rounded"
        >
          Add User
        </Button>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <Table
          dataSource={users}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          className="w-full"
          locale={{ emptyText: 'No users found' }}
          style={{
            header: {
              backgroundColor: '#f3f4f6',
              color: '#374151',
              fontWeight: 'bold',
            },
          }}
        />
      </div>

      <Modal
        title="Add New User"
        visible={isModalOpen}
        onOk={addUser}
        onCancel={() => setIsModalOpen(false)}
        okText={loading ? <Spin /> : 'Add'}
        cancelText="Cancel"
        okButtonProps={{ disabled: loading }}
        bodyStyle={{ padding: '10px' }}
      >
        <div className="space-y-5">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter user name"
            className="bg-gray-50 p-2 rounded border border-gray-300"
          />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter user email"
            className="bg-gray-50 p-2 rounded border border-gray-300"
          />
          <Input.Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter user password"
            className="bg-gray-50 p-2 rounded border border-gray-300"
          />
        </div>
      </Modal>

      <Modal
        title="Edit User"
        visible={isEditModalOpen}
        onOk={editUser}
        onCancel={() => setIsEditModalOpen(false)}
        okText={loading ? <Spin /> : 'Update'}
        cancelText="Cancel"
        okButtonProps={{ disabled: loading }}
        bodyStyle={{ padding: '10px' }}
      >
        <div className="space-y-5">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter user name"
            className="bg-gray-50 p-2 rounded border border-gray-300"
          />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter user email"
            className="bg-gray-50 p-2 rounded border border-gray-300"
          />
          <Input.Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter user password"
            className="bg-gray-50 p-2 rounded border border-gray-300"
          />
        </div>
      </Modal>
    </div>
  );
};

export default Users;
