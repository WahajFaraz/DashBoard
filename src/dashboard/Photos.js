import { useState, useEffect } from 'react';
import { Card, Button, Modal, Input, message, Spin } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { db, storage } from '../config/firebaseConfig';
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Photos = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editingPhoto, setEditingPhoto] = useState(null);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const photosCollection = collection(db, 'photos');
      const snapshot = await getDocs(photosCollection);
      const photoList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPhotos(photoList);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleUpload = async () => {
    if (!selectedFile || !name || !email) {
      message.error('Please provide a file, name, and email!');
      return;
    }

    try {
      const fileRef = ref(storage, `photos/${selectedFile.name}`);
      await uploadBytes(fileRef, selectedFile);
      const downloadURL = await getDownloadURL(fileRef);

      await addDoc(collection(db, 'photos'), {
        url: downloadURL,
        name,
        email,
        timestamp: new Date(),
      });

      message.success('Photo added successfully!');
      setIsModalVisible(false);
      setSelectedFile(null);
      setName('');
      setEmail('');
      fetchPhotos();
    } catch (error) {
      message.error(`Upload failed: ${error.message}`);
    }
  };

  const handleDelete = async (photoId) => {
    try {
      await deleteDoc(doc(db, 'photos', photoId));
      message.success('Photo deleted successfully!');
      fetchPhotos();
    } catch (error) {
      message.error(`Error deleting photo: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="md:p-1 pt-10">
      <div className="flex justify-between items-center mb-4 bg-white py-3 px-4 rounded shadow-md">
        <h2 className="text-xl font-semibold text-gray-700">
          Users Photos List
        </h2>
        <Button
          type="none"
          onClick={() => setIsModalVisible(true)}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold"
        >
          Add Photo
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <Card key={photo.id} className="shadow-lg rounded-lg">
            <div className="flex flex-col items-center p-4">
              <img
                src={photo.url}
                alt={photo.name}
                className="w-36 h-36 object-cover rounded-full"
              />
              <h3 className="text-lg font-semibold text-gray-800 mt-4">
                Name: {photo.name}
              </h3>
              <p className="text-gray-500 text-sm mb-4">Email: {photo.email}</p>
              <div className="flex space-x-4">
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Edit
                </Button>
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  danger
                  onClick={() => handleDelete(photo.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        title="Add New Photo"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            onClick={handleUpload}
            className="bg-green-600 text-white"
          >
            Upload Photo
          </Button>,
        ]}
      >
        <Input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          className="mb-4"
        />
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          prefix={<UserOutlined />}
          className="mb-4"
        />
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          prefix={<MailOutlined />}
        />
      </Modal>
    </div>
  );
};

export default Photos;
