const express = require('express');
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:userId/photos', authenticate, userController.getUserPhotos);

module.exports = router;
