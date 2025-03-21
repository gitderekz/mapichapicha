const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/register-client', authController.registerClient);
router.post('/register', authController.register);
router.post('/login', authController.login);
// router.post('/refresh-token', authController.refreshToken); // Add this route
// router.post('/logout', authController.logout); // Add this line

module.exports = router;