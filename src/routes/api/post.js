const express = require('express');
const router = express.Router();
const upload = require('../../middlewares/upload');
const PostController = require('../../controllers/PostController');
const { setDestination } = require('../../helpers/uploadDest');

setDestination('./public/uploads');
// Upload Post
router.post('/', upload.single('image'), PostController.uploadPost);

// Get all image
router.get('/all', PostController.getAllPost);

// Get file
router.get('/:postId', PostController.getPost);

// Delete file
router.delete('/:postId', PostController.deletePost);

module.exports = router;
