const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

// GET Route: Fetch all available doctors
router.get('/available', async (req, res) => {
    try {
        const availableDoctors = await Doctor.find({ isAvailable: true }).select('-password');
        res.json(availableDoctors);
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({ error: "Failed to fetch available doctors." });
    }
});

module.exports = router;
