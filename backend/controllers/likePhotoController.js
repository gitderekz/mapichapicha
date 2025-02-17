const db = require('../models');

// controllers/photoController.js
exports.likePhoto = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; // User ID from JWT
  
    try {
      // Check if the user has already liked the photo
      const existingLike = await db.Like.findOne({ where: { userId, photoId: id } });
      if (existingLike) {
        return res.status(400).json({ message: 'You have already liked this photo' });
      }
  
      // Create a new like
      await db.Like.create({ userId, photoId: id });
  
      // Increment the likes count in the Photo table
      const photo = await db.Photo.findByPk(id);
      photo.likes += 1;
      await photo.save();
  
      res.json({ message: 'Photo liked', photo });
    } catch (error) {
      res.status(500).json({ message: 'Error liking photo', error });
    }
  };