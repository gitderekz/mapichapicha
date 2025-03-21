// const db = require('../models');

// exports.getUsers = async (req, res) => {
//   try {
//     const users = await db.user.findAll({});
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching user photos', error });
//   }
// };

// exports.getUserPhotos = async (req, res) => {
//   const { userId } = req.params;
//   try {
//     const photos = await db.photo.findAll({ where: { userId } });
//     res.json(photos);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching user photos', error });
//   }
// };

const db = require('../models');  // Assuming you're using Sequelize for ORM

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await db.user.findAll({
      include: [
        {
          model: db.photo, // Assuming 'photo' is the associated model
          attributes: [],  // No need to return all photo attributes
          where: { clientId: db.sequelize.col('user.id') }, // Filter by clientId matching user.id
          required: false, // Left join, so users without photos will still be included
        },
      ],
      attributes: {
        include: [
          [
            db.sequelize.fn('COUNT', db.sequelize.col('photos.id')), // Counting the photos
            'photoCount',
          ],
        ],
      },
      group: ['user.id'], // Grouping by user id so that the count corresponds to each user
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

// Get a specific user by their userId
exports.getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await db.user.findByPk(userId); // Assuming `findByPk` is used for primary key lookup
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
};

// Get all photos by userId
exports.getUserPhotos = async (req, res) => {
  const { userId } = req.params;
  try {
    const photos = await db.photo.findAll({ where: { userId } });
    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user photos', error });
  }
};

// Delete a user by userId
exports.deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await db.user.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the user
    await user.destroy();  // Assuming Sequelize ORM
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};

// Update user role (only 'publisher' or 'visitor')
exports.updateUserRole = async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;  // Assuming the new role is passed in the request body

  try {
    // Ensure only 'publisher' or 'visitor' roles are valid
    if (!role || !['publisher', 'visitor'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Only "publisher" or "visitor" are allowed.' });
    }

    const user = await db.user.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the role
    user.role = role;
    await user.save();  // Save the updated role to the database

    res.status(200).json({ message: 'User role updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user role', error });
  }
};

// (Optional) Create a new user
exports.createUser = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    // Ensure the role is either 'publisher' or 'visitor'
    if (role && !['publisher', 'visitor'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Only "publisher" or "visitor" are allowed.' });
    }

    // Create new user with data from the request body
    const user = await db.user.create({
      username,
      password, // You should hash the password before storing in the database
      role: role || 'visitor', // Default to 'visitor' if no role is provided
    });
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};
