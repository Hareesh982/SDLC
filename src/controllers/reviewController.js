const Product = require('../models/Product');
const Review = require('../models/Review');

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private/Customer
exports.createProductReview = async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.some(
      (reviewId) => reviewId.toString() === req.user._id.toString()
    ); // Assuming req.user._id represents the review author
    // The above line is problematic as `product.reviews` stores review IDs, not user IDs.
    // A better check is to query the Review collection directly.
    const userAlreadyReviewed = await Review.findOne({ product: product._id, user: req.user._id });

    if (userAlreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed by this user' });
    }

    const review = new Review({
      product: product._id,
      user: req.user._id,
      rating: Number(rating),
      comment,
    });

    const createdReview = await review.save();

    // Add review to product's reviews array
    product.reviews.push(createdReview._id);

    // Update product rating and numReviews
    const reviewsForProduct = await Review.find({ product: product._id });
    product.numReviews = reviewsForProduct.length;
    product.rating = reviewsForProduct.reduce((acc, item) => item.rating + acc, 0) / reviewsForProduct.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

// @desc    Get all reviews for a product
// @route   GET /api/products/:id/reviews
// @access  Public
exports.getProductReviews = async (req, res) => {
  const reviews = await Review.find({ product: req.params.id }).populate('user', 'name');
  res.json(reviews);
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private/Customer (owner) / Admin
exports.deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (review) {
    // Check if user is the review owner or admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    const product = await Product.findById(review.product);
    if (product) {
      product.reviews = product.reviews.filter(rId => rId.toString() !== review._id.toString());

      const reviewsForProduct = await Review.find({ product: product._id });
      product.numReviews = reviewsForProduct.length - 1; // Adjust count before removing current review

      if (product.numReviews === 0) {
        product.rating = 0;
      } else {
        const updatedReviews = reviewsForProduct.filter(r => r._id.toString() !== review._id.toString());
        product.rating = updatedReviews.reduce((acc, item) => item.rating + acc, 0) / product.numReviews;
      }
      await product.save();
    }

    await Review.deleteOne({ _id: review._id });
    res.json({ message: 'Review removed' });
  } else {
    res.status(404).json({ message: 'Review not found' });
  }
};
