const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrderStatus,
  getAllOrders
} = require('../controllers/orderController');

// Customer Routes
router.route('/')
  .post(protect, authorize(['customer']), addOrderItems) // Checkout process
  .get(protect, authorize(['admin', 'sales']), getAllOrders); // Admin/Sales can view all orders

router.route('/myorders').get(protect, authorize(['customer']), getMyOrders);

// Shared route for viewing a specific order, with authorization for owner/admin/sales
router.route('/:id').get(protect, getOrderById);

// Admin/Sales Routes
router.route('/:id/pay').put(protect, updateOrderToPaid); // Can be done by customer (with payment gateway integration) or admin/sales (manual)
router.route('/:id/deliver').put(protect, authorize(['admin', 'sales']), updateOrderToDelivered);
router.route('/:id/status').put(protect, updateOrderStatus); // Flexible status update for customer (cancel/return) or admin/sales (all)

module.exports = router;
