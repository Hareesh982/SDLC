const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { createProductReview, getProductReviews } = require('../controllers/reviewController');

// Public routes
router.route('/').get(getProducts);
router.route('/:id').get(getProductById);
router.route('/:id/reviews').get(getProductReviews);

// Admin routes
router.route('/').post(protect, authorize(['admin']), createProduct);
router.route('/:id')
  .put(protect, authorize(['admin']), updateProduct)
  .delete(protect, authorize(['admin']), deleteProduct);

// Customer routes
router.route('/:id/reviews').post(protect, authorize(['customer']), createProductReview);

module.exports = router;
