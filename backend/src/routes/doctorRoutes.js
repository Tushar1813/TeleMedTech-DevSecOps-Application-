const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const authMiddleware = require('../middleware/authMiddleware');

// Protected route to fetch all doctors with query filtering
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { search, specialization } = req.query;
        let query = {};

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        if (specialization) {
            query.specialization = { $regex: specialization, $options: 'i' };
        }

        const doctors = await Doctor.find(query, '-password');
        res.json(doctors);
    } catch (error) {
        console.error('Fetch Doctors Error:', error);
        res.status(500).json({ error: 'Server error fetching doctors list.' });
    }
});

module.exports = router;
