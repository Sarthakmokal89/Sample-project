// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/authMiddleware');
const { listClients, updatePlan } = require('../controllers/adminController');

router.get('/clients', requireAuth, requireRole('admin'), listClients);
router.put('/clients/:id/plan', requireAuth, requireRole('admin'), updatePlan);

module.exports = router;
