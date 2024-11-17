import { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { db, storage } from '../config/firebaseConfig';
import { doc, setDoc, updateDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Modal } from 'antd';

function AlbumModal({ onClose, onAddAlbum, album }) {
  const [form] = Form.useForm();
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (album) {
      form.setFieldsValue(album);
    }
  }, [album, form]);

  const handleFileUpload = async (file) => {
    try {
      const storageRef = ref(storage, `albums/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      console.error('Error uploading file:', error);
      message.error('Failed to upload file.');
    }
  };

  const handleSubmit = async (values) => {
    try {
      setIsUploading(true);
      let coverImageUrl = album?.coverImage || '';

      if (values.coverImage?.file) {
        coverImageUrl = await handleFileUpload(values.coverImage.file);
      }

      if (album) {
        const albumRef = doc(db, 'albums', album.id);
        await updateDoc(albumRef, {
          ...values,
          coverImage: coverImageUrl,
        });
        onAddAlbum({ ...album, ...values, coverImage: coverImageUrl });
      } else {
        const newAlbumRef = doc(collection(db, 'albums')); // Create unique ID
        await setDoc(newAlbumRef, {
          ...values,
          coverImage: coverImageUrl,
        });
        onAddAlbum({
          id: newAlbumRef.id,
          ...values,
          coverImage: coverImageUrl,
        });
      }

      form.resetFields();
      onClose();
    } catch (error) {
      console.error('Error saving album:', error);
      message.error('Failed to save album.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal
      title={album ? 'Edit Album' : 'Add Album'}
      open
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="title"
          label="Album Title"
          rules={[{ required: true, message: 'Please enter the album title' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter a description' }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item
          name="coverImage"
          label="Cover Image"
          valuePropName="file"
          getValueFromEvent={(e) => (Array.isArray(e) ? e[0] : e)}
        >
          <Upload
            listType="picture"
            maxCount={1}
            beforeUpload={() => false} // Disable automatic upload
          >
            <Button icon={<UploadOutlined />}>Choose File</Button>
          </Upload>
        </Form.Item>
        <div className="flex justify-end space-x-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={isUploading}>
            {album ? 'Save Changes' : 'Add Album'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

export default AlbumModal;
