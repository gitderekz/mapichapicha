import React, { useState } from 'react';
import axios from 'axios';
import { FaHeart } from 'react-icons/fa';
import PhotoModal from './PhotoModal';
import CustomAlert from './CustomAlert';

const PhotoGrid = ({ photos }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likes, setLikes] = useState({}); // Track likes count for each photo
  const [likedPhotos, setLikedPhotos] = useState({}); // Track which photos the user has liked
  const [alert, setAlert] = useState({ message: '', type: '' });

  const userId = localStorage.getItem('userId'); // Get logged-in user ID

  const showAlert = (message, type) => {
    setAlert({ message, type });
  };

  const handleLike = async (photoId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/photos/${photoId}/like`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        }
      );

      // Update likes count
      setLikes((prevLikes) => ({
        ...prevLikes,
        [photoId]: response.data.photo.photoLikes,
      }));

      // Update likedPhotos state to reflect that the user has liked this photo
      setLikedPhotos((prevLikedPhotos) => ({
        ...prevLikedPhotos,
        [photoId]: true,
      }));

      showAlert('Photo liked!', 'success');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'You have already liked this photo or need to log in.';
      showAlert(errorMessage, 'error');
    }
  };

  const handleImageClick = (photo) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPhoto(null);
  };

  return (
    <div className="photo-grid">
      {alert.message && (
        <CustomAlert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ message: '', type: '' })}
        />
      )}

      {photos.map((photo) => {
        // Check if the user has liked the photo
        const hasLiked = likedPhotos[photo.id] || photo.likes.some((like) => like.userId === Number(userId));

        return (
          <div key={photo.id} className="photo-item" onClick={() => handleImageClick(photo)}>
            <img
              src={`${process.env.REACT_APP_API_URL.replace('/api', '')}${photo.imageUrl}`}
              alt={photo.name}
              loading="lazy"
              onError={(e) => {
                if (e.target.src !== '/placeholder.jpg') {
                  e.target.src = '/placeholder.jpg';
                }
              }}
            />
            <div className="photo-overlay">
              <div className="photo-name ">{photo.name}</div>
              <div className="photo-likes" onClick={(e) => {
                e.stopPropagation(); // Prevent handleImageClick from triggering
                handleLike(photo.id)}
                }>
                <FaHeart
                  className={`fa-heart ${hasLiked ? 'liked' : ''}`}
                />
                {hasLiked ? "Liked" : "Like"}
                {/* {hasLiked ? "❤️ Liked" : "🤍 Like"} */}
                <span>{likes[photo.id] ?? photo.photoLikes}</span>
              </div>
            </div>
          </div>
        );
      })}

      {isModalOpen && selectedPhoto && (
        <PhotoModal photo={selectedPhoto} onClose={closeModal} />
      )}
    </div>
  );
};

export default PhotoGrid;