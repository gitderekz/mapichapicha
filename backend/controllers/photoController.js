const db = require('../models');

exports.uploadPhotos = async (req, res) => {
  // Check if files were uploaded
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }

  const { name, category, event, displayOnHome, userId } = req.body;

  try {
    // Map uploaded files to their URLs
    const imageUrls = req.files.map((file) => `/uploads/${file.filename}`);

    // Create photo records in the database
    const photos = await db.Photo.bulkCreate(
      imageUrls.map((url) => ({
        name,
        category,
        event,
        displayOnHome: displayOnHome === 'true',
        userId,
        imageUrl: url,
        likes: 0,
      }))
    );

    res.status(201).json({ message: 'Photos uploaded successfully', photos });
  } catch (error) {
    console.error('Error uploading photos:', error);
    res.status(500).json({ message: 'Error uploading photos', error });
  }
};

exports.getPhotos = async (req, res) => {
  const { category, userId } = req.query;
  const where = {};
  if (category) where.category = category;
  if (userId) where.userId = userId;

  try {
    const photos = await db.Photo.findAll({ where });
    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching photos', error });
  }
};

exports.getCategoryPhotos = async (req, res) => {
  const { category, page = 1, limit = 30 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const where = category ? { category } : {};
    const photos = await db.Photo.findAll({
      where,
      limit,
      offset,
    });
    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching photos', error });
  }
};

exports.getSponsorPhotos = async (req, res) => {
  try {
    const sponsorPhotos = await db.Photo.findAll({ where: { category: 'sponsor' } });
    res.json(sponsorPhotos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sponsor photos', error });
  }
};

exports.getHomePhotos = async (req, res) => {
  try {
    const homePhotos = await db.Photo.findAll({ where: { displayOnHome: true } });
    res.json(homePhotos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching home photos', error });
  }
};

exports.likePhoto = async (req, res) => {
  const { id } = req.params; // Photo ID
  const userId = req.user.id; // User ID from the JWT token

  try {
    // Step 1: Find the photo
    const photo = await db.Photo.findByPk(id);
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    // Step 2: Check if the user has already liked the photo
    const existingLike = await db.Like.findOne({
      where: { userId, photoId: id },
    });

    if (existingLike) {
      return res.status(400).json({ message: 'You have already liked this photo' });
    }

    // Step 3: Update the likes count in the photos table
    photo.photoLikes += 1; // Assuming the column is named `photoLikes`
    await photo.save();

    // Step 4: Create a new entry in the likes table
    await db.Like.create({ userId, photoId: id });

    // Step 5: Return the updated photo
    res.json({ message: 'Photo liked', photo });
  } catch (error) {
    console.error('Error liking photo:', error);
    res.status(500).json({ message: 'Error liking photo', error });
  }
};

// controllers/photoController.js
exports.getPhotoLikes = async (req, res) => {
  const { id } = req.params;

  try {
    const likes = await db.Like.findAll({
      where: { photoId: id },
      include: [{ model: db.User, attributes: ['id', 'username'] }],
    });
    res.json(likes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching likes', error });
  }
};