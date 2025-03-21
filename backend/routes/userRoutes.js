const express = require('express');
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');  // Assuming authentication middleware

const router = express.Router();

// Get all users
router.get('/', authenticate, userController.getUsers);

// Get a specific user by userId
router.get('/:userId', authenticate, userController.getUserById);

// Get all photos of a specific user
router.get('/:userId/photos', authenticate, userController.getUserPhotos);

// Delete a specific user
router.delete('/:userId', authenticate, userController.deleteUser);

// Update the role of a specific user
router.put('/:userId', authenticate, userController.updateUserRole);

// (Optional) Create a new user - uncomment if needed
// router.post('/', authenticate, userController.createUser);

module.exports = router;
