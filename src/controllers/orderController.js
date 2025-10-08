const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const { sendOrderConfirmationEmail } = require('../utils/email');

// @desc    Create new order (checkout)
// @route   POST /api/orders
// @access  Private/Customer
exports.addOrderItems = async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;

  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: 'No items in cart' });
  }

  const orderItems = cart.items.map(item => ({
    product: item.product._id,
    name: item.product.name,
    quantity: item.quantity,
    image: item.product.image,
    price: item.product.price,
  }));

  const itemsPrice = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Calculate tax and shipping (simplified for boilerplate)
  const taxPrice = itemsPrice * 0.15; // 15% tax
  const shippingPrice = itemsPrice > 100 ? 0 : 10; // Free shipping over $100
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  const createdOrder = await order.save();

  // Clear the cart after order creation
  await Cart.deleteOne({ user: req.user._id });

  // Send confirmation email (placeholder)
  const userEmail = req.user.email; // Assuming email is available on req.user
  const orderId = createdOrder._id;
  const orderTotal = createdOrder.totalPrice;
  sendOrderConfirmationEmail(userEmail, orderId, orderTotal);

  res.status(201).json(createdOrder);
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private/Customer
exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate('user', 'name email');
  res.json(orders);
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private/Customer/Sales/Admin
exports.getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    if (order.user._id.toString() !== req.user._id.toString() && !['admin', 'sales'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    res.json(order);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
exports.updateOrderToPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin/Sales
exports.updateOrderToDelivered = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.status = 'delivered';

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

// @desc    Update order status (e.g., cancel, return)
// @route   PUT /api/orders/:id/status
// @access  Private/Customer (for cancel/return) / Admin/Sales (for all)
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (order) {
    // Basic authorization for status changes
    if (req.user.role === 'customer') {
      if (!['cancelled', 'returned'].includes(status)) {
        return res.status(403).json({ message: 'Customers can only cancel or return orders.' });
      }
      // Further logic to prevent canceling/returning already processed/shipped orders
      if (order.status !== 'pending' && order.status !== 'processing') {
        return res.status(400).json({ message: `Cannot ${status} an order that is already ${order.status}.` });
      }
    } else if (!['admin', 'sales'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized to update order status' });
    }

    order.status = status;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin/Sales
exports.getAllOrders = async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
};
