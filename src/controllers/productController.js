const Product = require('../models/Product');
const Review = require('../models/Review');

// @desc    Fetch all products with search, filter, and pagination
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword ? {
    name: {
      $regex: req.query.keyword,
      $options: 'i',
    },
  } : {};

  const category = req.query.category ? { category: req.query.category } : {};
  const subcategory = req.query.subcategory ? { subcategory: req.query.subcategory } : {};

  let priceRangeFilter = {};
  if (req.query.minPrice || req.query.maxPrice) {
    priceRangeFilter.price = {};
    if (req.query.minPrice) priceRangeFilter.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) priceRangeFilter.price.$lte = Number(req.query.maxPrice);
  }

  let ratingFilter = {};
  if (req.query.minRating) {
    ratingFilter.rating = { $gte: Number(req.query.minRating) };
  }

  const count = await Product.countDocuments({ ...keyword, ...category, ...subcategory, ...priceRangeFilter, ...ratingFilter });
  const products = await Product.find({ ...keyword, ...category, ...subcategory, ...priceRangeFilter, ...ratingFilter })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('reviews');

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  const { name, price, description, image, brand, category, subcategory, countInStock } = req.body;

  const product = new Product({
    name, price, description, image, brand, category, subcategory, countInStock,
    user: req.user._id, // Assuming user is available from auth middleware
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  const { name, price, description, image, brand, category, subcategory, countInStock } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.image = image || product.image;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.subcategory = subcategory || product.subcategory;
    product.countInStock = countInStock || product.countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id }); // Use deleteOne for Mongoose 6+
    res.json({ message: 'Product removed' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};
