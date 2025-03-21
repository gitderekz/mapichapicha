const express = require('express');
const photoController = require('../controllers/photoController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/upload', authenticate, authorize(['publisher']), uploadMiddleware, photoController.uploadPhotos);
router.get('/client', photoController.getClientPhotos);
router.get('/', photoController.getCategoryPhotos);
router.get('/sponsor', photoController.getSponsorPhotos);
router.get('/home', photoController.getHomePhotos);
router.post('/:id/like', authenticate, photoController.likePhoto);
// routes/photoRoutes.js
router.get('/:id/likes', photoController.getPhotoLikes);
module.exports = router;
