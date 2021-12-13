const express = require('express');
const userRouter = require('./api/user');
const postRouter = require('./api/post');

const router = express.Router();

router.use('/user', userRouter);
router.use('/post', postRouter);

module.exports = router;
