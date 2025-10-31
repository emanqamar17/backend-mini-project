// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getProfile,
  updateUserProfile,
  deleteUser
} = require('../controllers/userController');
const protect = require('../middleware/authMiddleware'); // existing middleware

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateUserProfile);

// Delete by id (protected)
router.delete('/:id', protect, deleteUser);

// Optional test route
router.get('/test', (req, res) => res.send('User route is working fine.'));

module.exports = router;
