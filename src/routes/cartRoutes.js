const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getCart,
  addItemToCart,
  updateCartItemQuantity,
  removeItemFromCart
} = require('../controllers/cartController');

router.route('/')
  .get(protect, authorize(['customer']), getCart)
  .post(protect, authorize(['customer']), addItemToCart);

router.route('/:id') // id here refers to the cart item's _id
  .put(protect, authorize(['customer']), updateCartItemQuantity)
  .delete(protect, authorize(['customer']), removeItemFromCart);

module.exports = router;
