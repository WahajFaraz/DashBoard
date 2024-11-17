import { useState } from 'react';
import { Button, Upload, message, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import { storage, db } from '../config/firebaseConfig';

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Handle file selection
  const handleFileChange = (info) => {
    if (info.file.status === 'done') {
      setSelectedFile(info.file.originFileObj);
    } else {
      setSelectedFile(null);
    }
  };

  // Handle upload to Firebase
  const handleUpload = async () => {
    if (!selectedFile) {
      message.error('Please select a file to upload!');
      return;
    }

    const name = 'User Name'; // Replace or make dynamic
    const email = 'user@example.com'; // Replace or make dynamic

    try {
      const fileRef = ref(storage, `photos/${selectedFile.name}`);
      await uploadBytes(fileRef, selectedFile);

      const downloadURL = await getDownloadURL(fileRef);

      // Save downloadURL and metadata to Firestore
      await addDoc(collection(db, 'photos'), {
        url: downloadURL,
        name,
        email,
        timestamp: new Date(),
      });

      message.success('Photo uploaded successfully!');
      setIsModalVisible(false);
      setSelectedFile(null); // Reset file input
    } catch (error) {
      message.error(`Upload failed: ${error.message}`);
    }
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={() => setIsModalVisible(true)}
        icon={<UploadOutlined />}
      >
        Upload Image
      </Button>

      <Modal
        title="Upload Image"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleUpload}>
            Upload
          </Button>,
        ]}
      >
        <Upload
          beforeUpload={() => false} // Prevent auto-upload
          onChange={handleFileChange}
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>Select Image</Button>
        </Upload>
        {selectedFile && <p>{selectedFile.name}</p>}
      </Modal>
    </div>
  );
};

export default ImageUpload;
