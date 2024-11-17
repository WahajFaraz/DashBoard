import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, storage } from '../config/firebaseConfig';
import { deleteObject, ref } from 'firebase/storage';
import AlbumModal from './AlbumModal';

function AlbumList() {
  const [albums, setAlbums] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const albumCollection = collection(db, 'albums');
        const albumSnapshot = await getDocs(albumCollection);
        const albumList = albumSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAlbums(albumList);
      } catch (error) {
        console.error('Error fetching albums:', error);
      }
    };
    fetchAlbums();
  }, []);

  const handleDelete = async (album) => {
    try {
      const albumRef = doc(db, 'albums', album.id);

      // Delete the album from Firestore
      await deleteDoc(albumRef);

      // Delete the image from Firebase Storage
      if (album.coverImage) {
        const imageRef = ref(storage, album.coverImage);
        await deleteObject(imageRef);
      }

      setAlbums((prevAlbums) =>
        prevAlbums.filter((item) => item.id !== album.id)
      );
    } catch (error) {
      console.error('Error deleting album:', error);
    }
  };

  const handleEdit = (album) => {
    setSelectedAlbum(album);
    setIsEditModalOpen(true);
  };

  const handleAddAlbum = (newAlbum) => {
    setAlbums((prevAlbums) => [newAlbum, ...prevAlbums]);
  };

  const handleEditSave = (updatedAlbum) => {
    setAlbums((prevAlbums) =>
      prevAlbums.map((album) =>
        album.id === updatedAlbum.id ? { ...album, ...updatedAlbum } : album
      )
    );
    setIsEditModalOpen(false);
    setSelectedAlbum(null);
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Album
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {albums.map((album) => (
          <div
            key={album.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="relative">
              <img
                src={album.coverImage || 'https://via.placeholder.com/150'}
                alt={album.title || 'Album Cover'}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold">{album.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{album.description}</p>
              <div className="flex justify-between">
                <button
                  onClick={() => handleEdit(album)}
                  className="text-blue-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(album)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <AlbumModal
          onClose={() => setIsModalOpen(false)}
          onAddAlbum={handleAddAlbum}
        />
      )}

      {isEditModalOpen && selectedAlbum && (
        <AlbumModal
          album={selectedAlbum}
          onClose={() => setIsEditModalOpen(false)}
          onAddAlbum={handleEditSave}
        />
      )}
    </div>
  );
}

export default AlbumList;
