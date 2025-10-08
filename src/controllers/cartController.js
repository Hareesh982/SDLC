const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private/Customer
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price image');
    if (cart) {
      res.json(cart);
    } else {
      res.status(200).json({ user: req.user._id, items: [] }); // Return an empty cart if not found
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private/Customer
exports.addItemToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.countInStock < quantity) {
        return res.status(400).json({ message: 'Not enough stock for this product' });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      // Cart exists, check if item is already in cart
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

      if (itemIndex > -1) {
        // Item exists in cart, update quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Item not in cart, add new item
        cart.items.push({ product: productId, quantity });
      }
    } else {
      // No cart for user, create new one
      cart = new Cart({
        user: req.user._id,
        items: [{ product: productId, quantity }],
      });
    }

    await cart.save();
    res.status(201).json(cart.populate('items.product', 'name price image'));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update item quantity in cart
// @route   PUT /api/cart/:id (cart item ID)
// @access  Private/Customer
exports.updateCartItemQuantity = async (req, res) => {
  const { quantity } = req.body;
  const { id } = req.params; // id is the _id of the item within the items array

  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item._id.toString() === id);

    if (itemIndex > -1) {
      const product = await Product.findById(cart.items[itemIndex].product);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      if (product.countInStock < quantity) {
          return res.status(400).json({ message: 'Not enough stock for this product' });
      }

      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      res.json(cart.populate('items.product', 'name price image'));
    } else {
      res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id (cart item ID)
// @access  Private/Customer
exports.removeItemFromCart = async (req, res) => {
  const { id } = req.params; // id is the _id of the item within the items array

  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter(item => item._id.toString() !== id);

    if (cart.items.length === initialLength) {
        return res.status(404).json({ message: 'Item not found in cart' });
    }

    await cart.save();
    res.json(cart.populate('items.product', 'name price image'));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
