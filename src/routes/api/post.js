const express = require('express');
const upload = require('../../middlewares/uploadPost');
const PostController = require('../../controllers/PostController');

const router = express.Router();

// Upload Post
router.post('/', upload.single('post'), PostController.uploadPost);

// Get all image
router.get('/', PostController.getAllPost);

// Get file
router.get('/:postId', PostController.getPost);

// Update file
router.post('/:postId', PostController.updatePost);

// Delete file
router.get('/:postId', PostController.deletePost);

module.exports = router;
