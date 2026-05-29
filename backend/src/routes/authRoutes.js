const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /register
router.post('/register', register);

// POST /login
router.post('/login', login);

// GET /profile (Protected test route)
router.get('/profile', authMiddleware, (req, res) => {
    res.json({ message: 'You have accessed a protected route!', user: req.user });
});

module.exports = router;
