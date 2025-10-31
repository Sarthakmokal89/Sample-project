// backend/routes/users.js
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  getUserSettings,
  updateUserSettings,
} = require('../controllers/userController');

router.get('/settings', requireAuth, getUserSettings);
router.put('/settings', requireAuth, updateUserSettings);

module.exports = router;
