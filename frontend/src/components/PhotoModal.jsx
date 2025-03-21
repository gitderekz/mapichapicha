import React, { useState } from 'react';
import axios from 'axios';
import { FaHeart, FaTimes } from 'react-icons/fa'; // Import close icon

const PhotoModal = ({ photo, onClose }) => {
  const [likes, setLikes] = useState(photo.photoLikes);
  const [hasLiked, setHasLiked] = useState(photo.likes.some((like) => like.userId === Number(localStorage.getItem('userId'))));

  const handleLike = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/photos/${photo.id}/like`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        }
      );

      // Update the likes count and like status
      setLikes(response.data.photo.photoLikes);
      setHasLiked(true);
    } catch (error) {
      console.error('Error liking photo:', error.response?.data?.message || error.message);
      alert('You have already liked this photo or need to log in.');
    }
  };

  return (
    <div className="photo-modal" onClick={onClose}> {/* Close modal when clicking outside */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}> {/* Prevent closing when clicking inside modal */}
        <FaTimes className="close-icon" onClick={onClose} /> {/* Close icon */}
        <img src={`${process.env.REACT_APP_API_URL.replace('/api', '')}${photo.imageUrl}`} alt={photo.name} />
        <div className="details">
          <h2>{photo.name}</h2>
          <p>Category: {photo.category}</p>
          <div className="like-section" onClick={handleLike}>
            <p>{hasLiked ? "Liked" : "Like"} {likes}</p>
            <FaHeart
              className={`fa-heart modal ${hasLiked ? 'liked' : ''} `}
            /> {/* Heart icon */}
          </div>
          <div className="buttons">
            <p className="publisher"><i>By {photo.user.username}</i> </p>
            <a href={`${process.env.REACT_APP_API_URL.replace('/api', '')}${photo.imageUrl}`} download>
              Download
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;