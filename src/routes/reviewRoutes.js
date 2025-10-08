const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  deleteReview
} = require('../controllers/reviewController');

// Note: Creating and getting product reviews are handled under productRoutes/:id/reviews

// Delete review - accessible by the review owner or an admin
router.route('/:id').delete(protect, deleteReview); // id here refers to the review's _id

module.exports = router;
