const express = require('express');
const router = express.Router();

const {
  registerController,
  verificationController,
  signInController,
  forgotPasswordController,
  resetPasswordController,
  getResetToken,
  googleLogin,
  facebookLogin,
} = require('../controllers/auth.controller');

router.post('/signup', registerController);
router.post('/signin', signInController);
router.post('/users/activate/:token', verificationController);
router.post('/forgotpassword', forgotPasswordController);
router.get('/reset/:token', getResetToken);
router.put('/reset', resetPasswordController);

router.post('/googlelogin', googleLogin);
router.post('/facebooklogin', facebookLogin);

module.exports = router;
