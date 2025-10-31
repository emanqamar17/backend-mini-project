// controllers/userController.js
const User = require('../models/user'); // make sure models/user.js exists
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Register a new user
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Please provide name, email, and password' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashed });
    await user.save();

    const userResponse = { _id: user._id, name: user.name, email: user.email, createdAt: user.createdAt };
    return res.status(201).json({ message: 'User registered successfully', user: userResponse });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Login user and return JWT
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Please provide email and password' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });

    const userResponse = { _id: user._id, name: user.name, email: user.email };
    return res.status(200).json({ message: 'Login successful', token, user: userResponse });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get full profile from DB for currently authenticated user
 * GET /api/users/profile  (protected)
 */
const getProfile = async (req, res) => {
  try {
    const userId = req.user && (req.user.id || req.user._id);
    if (!userId) return res.status(401).json({ message: 'Not authorized, invalid token' });

    const user = await User.findById(userId).select('-password -__v');
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.status(200).json({ message: 'User profile fetched', user });
  } catch (error) {
    console.error('GetProfile error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Update user profile (name, email, password)
 * PUT /api/users/profile  (protected)
 */
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user && (req.user.id || req.user._id);
    if (!userId) return res.status(401).json({ message: 'Not authorized, invalid token' });

    const { name, email, password } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (email) user.email = email;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();

    return res.status(200).json({
      message: 'User profile updated successfully',
      user: { _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email }
    });
  } catch (error) {
    console.error('UpdateProfile error:', error);
    if (error.code === 11000 && error.keyValue && error.keyValue.email) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Delete user
 * DELETE /api/users/:id  (protected)
 */
const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    // optionally: allow only admin or same user — here we allow any authenticated user for simplicity
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.deleteOne();
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('DeleteProfile error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { registerUser, loginUser, getProfile, updateUserProfile, deleteUser };
