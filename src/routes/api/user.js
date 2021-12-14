const express = require('express');
const UserController = require('../../controllers/UserController');
const Validator = require('../../middlewares/validator');
const upload = require('../../middlewares/uploadProfile');

const router = express.Router();

router.get('/', UserController.getAllUser);
router.get('/:id', UserController.getUser);
router.get('/post', UserController.getAllUserPost);
router.post('/', UserController.createUser);
router.post(
  '/update-profile/:id',
  upload.single('profile'),
  UserController.updateUserProfile
);
router.post('/update-info/:id', UserController.updateUserInfo);
router.post(
  '/update-pwd/:id',
  Validator.updatePassword(),
  UserController.updatePassword
);
router.get('/delete/:id', UserController.deleteUser);

module.exports = router;
