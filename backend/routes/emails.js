// backend/routes/emails.js
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const { getEmails, markResolved } = require('../controllers/emailController');

router.get('/', requireAuth, getEmails);
router.put('/:id/resolve', requireAuth, markResolved);

module.exports = router;
