const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  configureSystemSettings, // Placeholder admin function
  monitorSystemPerformance // Placeholder admin function
} = require('../controllers/userController');

// Admin-specific routes for user management
router.route('/')
  .get(protect, authorize(['admin']), getUsers); // Get all users

router.route('/:id')
  .get(protect, authorize(['admin']), getUserById) // Get user by ID
  .put(protect, authorize(['admin']), updateUser) // Update user by ID
  .delete(protect, authorize(['admin']), deleteUser); // Delete user by ID

// Admin routes for system management (placeholders)
router.route('/admin/settings').put(protect, authorize(['admin']), configureSystemSettings);
router.route('/admin/monitor').get(protect, authorize(['admin']), monitorSystemPerformance);

module.exports = router;
