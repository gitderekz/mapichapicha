const db = require('../models');

exports.getUsers = async (req, res) => {
  try {
    const users = await db.user.findAll({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user photos', error });
  }
};

exports.getUserPhotos = async (req, res) => {
  const { userId } = req.params;
  try {
    const photos = await db.photo.findAll({ where: { userId } });
    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user photos', error });
  }
};
