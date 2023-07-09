const express = require('express');
const userController = require('../controllers/users');
const { validateUpdateProfile } = require('../middlewares/validation');

const router = express.Router();

router.get('/me', userController.getCurrentUser);
router.patch('/me', validateUpdateProfile, userController.updateProfile);

module.exports = router;
