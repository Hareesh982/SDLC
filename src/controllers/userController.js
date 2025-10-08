const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Update user (Admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role; // Admin can change roles

    // Admin can also reset password for users, but usually a separate flow
    // if (req.body.password) { user.password = req.body.password; }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await User.deleteOne({ _id: user._id }); // Use deleteOne for Mongoose 6+
    res.json({ message: 'User removed' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// Placeholder for system settings and monitoring. This would typically involve
// dedicated services or configuration models, or integrate with existing monitoring tools.
// For now, these are conceptual admin functions.
// @desc    Configure system settings (placeholder)
// @route   PUT /api/admin/settings
// @access  Private/Admin
exports.configureSystemSettings = (req, res) => {
  // Logic to update system-wide configurations (e.g., shipping rates, tax rates)
  res.status(200).json({ message: 'System settings configured (placeholder).' });
};

// @desc    Monitor system performance (placeholder)
// @route   GET /api/admin/monitor
// @access  Private/Admin
exports.monitorSystemPerformance = (req, res) => {
  // Logic to retrieve system metrics, logs, etc.
  res.status(200).json({ message: 'System performance monitored (placeholder).' });
};
