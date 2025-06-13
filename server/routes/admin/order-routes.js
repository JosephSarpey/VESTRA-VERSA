const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../../middleware/auth');
const { 
    getAllOrdersOfAllUser,
    getOrderDetailsForAdmin,
    updateOrderStatus
} = require('../../controllers/admin/order-controller');

// Get all orders with filtering, sorting, and pagination
// Query params: 
// - page: Page number (default: 1)
// - limit: Items per page (default: 10)
// - status: Filter by order status
// - search: Search by order ID, customer name, or phone
// - startDate/endDate: Filter by date range (YYYY-MM-DD)
// - sortBy: Field to sort by (default: orderDate)
// - sortOrder: Sort order (asc/desc, default: desc)
router.get('/', verifyAdmin, getAllOrdersOfAllUser);

// Get order details by ID
router.get('/:id', verifyAdmin, getOrderDetailsForAdmin);

// Update order status
router.patch('/:id/status', verifyAdmin, updateOrderStatus);

module.exports = router;
