import { useEffect, useState } from 'react';
import { db } from '../config/firebaseConfig';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { Button, Input, Modal } from 'antd';

function AlbumList() {
  const [albums, setAlbums] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // To track if we are editing an album
  const [editingAlbum, setEditingAlbum] = useState(null); // Store the album being edited
  const [editedTitle, setEditedTitle] = useState(''); // Store the edited title
  const [editedDescription, setEditedDescription] = useState(''); // Store the edited description
  const [editedCoverImage, setEditedCoverImage] = useState(''); // Store the edited cover image

  useEffect(() => {
    const fetchAlbums = async () => {
      const albumCollection = collection(db, 'albums');
      const albumSnapshot = await getDocs(albumCollection);
      const albumList = albumSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAlbums(albumList);
    };
    fetchAlbums();
  }, []);

  const handleEditClick = (album) => {
    setIsEditing(true); // Show the edit form
    setEditingAlbum(album); // Set the album being edited
    setEditedTitle(album.title); // Pre-fill the form with current album data
    setEditedDescription(album.description);
    setEditedCoverImage(album.coverImage);
  };

  const handleDeleteClick = async (albumId) => {
    try {
      await deleteDoc(doc(db, 'albums', albumId)); // Delete the album from Firestore
      setAlbums(albums.filter((album) => album.id !== albumId)); // Remove the album from the state
    } catch (error) {
      console.error('Error deleting album: ', error);
    }
  };

  const handleUpdateClick = async () => {
    try {
      // Update the album in Firestore with the new values
      await updateDoc(doc(db, 'albums', editingAlbum.id), {
        title: editedTitle,
        description: editedDescription,
        coverImage: editedCoverImage,
      });
      // Update the album list in the state with the new data
      setAlbums(
        albums.map((album) =>
          album.id === editingAlbum.id
            ? {
                ...album,
                title: editedTitle,
                description: editedDescription,
                coverImage: editedCoverImage,
              }
            : album
        )
      );
      setIsEditing(false); // Close the edit form
      setEditingAlbum(null); // Reset the editing album
    } catch (error) {
      console.error('Error updating album: ', error);
    }
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {albums.map((album) => (
          <div
            key={album.id}
            className="bg-white rounded-lg shadow-xl hover:shadow-2xl transition-shadow transform hover:scale-105 duration-300 ease-in-out"
          >
            <div className="relative">
              <img
                src={album.coverImage}
                alt={album.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <p className="text-white text-2xl font-semibold">
                  {album.title}
                </p>
              </div>
            </div>
            <div className="p-4 bg-white">
              <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">
                {album.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {album.description}
              </p>
              <div className="flex justify-between items-center">
                <Button
                  onClick={() => handleEditClick(album)}
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDeleteClick(album.id)}
                  className="text-red-500 hover:text-red-700 font-medium transition-colors"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <Modal
          title="Edit Album"
          visible={isEditing}
          onCancel={() => setIsEditing(false)}
          footer={null}
          centered
          className="w-full max-w-lg"
        >
          <div className="space-y-4">
            <Input
              placeholder="Title"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
            <Input.TextArea
              placeholder="Description"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              rows={3}
            />
            <Input
              placeholder="Cover Image URL"
              value={editedCoverImage}
              onChange={(e) => setEditedCoverImage(e.target.value)}
            />
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                onClick={() => setIsEditing(false)}
                className="bg-gray-600 text-white hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateClick}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                Update
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default AlbumList;
