const { User } = require('../models');
const { generateToken } = require('../middleware/auth.middleware');
const { sendUserEvent } = require('../services/kafka.producer');
const { sendWelcomeEmail } = require('../services/email.service');

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      name,
      role: 'member' // Default role
    });

    // Generate JWT token
    const token = generateToken(user.id);

    // Update last login
    user.last_login = new Date();
    await user.save();

    // Send Kafka event
    await sendUserEvent('USER_REGISTERED', user);

    // Send welcome email (optional)
    // await sendWelcomeEmail(user.email, user.name);

    res.status(201).json({
      message: 'User registered successfully',
      user: user.toJSON(),
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({ error: 'Account is inactive' });
    }

    // Verify password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    user.last_login = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user.id);

    // Send Kafka event
    await sendUserEvent('USER_LOGGED_IN', user);

    res.json({
      message: 'Login successful',
      user: user.toJSON(),
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    res.json({
      message: 'Profile retrieved successfully',
      user: req.user.toJSON()
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};