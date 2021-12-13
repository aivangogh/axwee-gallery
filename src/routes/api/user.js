const express = require('express');
const UserController = require('../../controllers/UserController');
const upload = require('../../middlewares/upload');
const Validator = require('../../middlewares/validator');
const { setDestination } = require('../../helpers/uploadDest');

const router = express.Router();

router.get('/', UserController.getAllUser);
router.get('/:id', UserController.getUser);
router.post('/', UserController.createUser);
setDestination('./public/uploads/user/profile');
router.post(
  '/update-profile/:id',
  upload.single('image'),
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
