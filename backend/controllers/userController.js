const db = require('../models');

exports.getUserPhotos = async (req, res) => {
  const { userId } = req.params;
  try {
    const photos = await db.Photo.findAll({ where: { userId } });
    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user photos', error });
  }
};
