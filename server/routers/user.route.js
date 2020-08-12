const express = require('express');
const router = express.Router();

const {
  requireSignin,
  adminMiddleware,
} = require('../controllers/auth.controller');
const { updateController } = require('../controllers/user.controller');

router.put('/au/user/update', requireSignin, updateController);
router.put('au/admin/update', requireSignin, adminMiddleware, updateController);

module.exports = router;
