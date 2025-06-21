const express = require('express');
const router = express.Router();
const analyticsController = require('../../controllers/admin/analytics-controller');

// GET /admin/analytics/users-over-time?groupBy=week|month
router.get('/users-over-time', analyticsController.getUsersOverTime);

// GET /admin/analytics/sales-over-time?groupBy=week|month
router.get('/sales-over-time', analyticsController.getSalesOverTime);

module.exports = router;