// ─── authRoutes.js ───────────────────────────────────────────────────────────
const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);
router.get('/me', authenticate, authCtrl.getMe);
router.post('/forgot-password', authCtrl.forgotPassword);
router.patch('/reset-password/:token', authCtrl.resetPassword);
router.patch('/update-profile', authenticate, authCtrl.updateProfile);
router.patch('/change-password', authenticate, authCtrl.changePassword);

module.exports = router;
