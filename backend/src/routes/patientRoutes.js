const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient'); // Import the Blueprint!

// POST Route: Registering a new patient into MongoDB
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone, bloodGroup, medicalHistory } = req.body;

        // 1. Check if the patient already exists
        const existingPatient = await Patient.findOne({ email });
        if (existingPatient) {
            return res.status(400).json({ error: "A patient with this email already exists." });
        }

        // 2. Create the new patient using our Mongoose Blueprint
        const newPatient = new Patient({
            name,
            email,
            password, // Note: We will encrypt this later for security!
            phone,
            bloodGroup,
            medicalHistory
        });

        // 3. Save to MongoDB
        await newPatient.save();

        res.status(201).json({ 
            status: "success",
            message: "Patient registered successfully!",
            patientId: newPatient._id 
        });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Failed to register patient in the database." });
    }
});

// GET Route: Fetch all registered patients
router.get('/', async (req, res) => {
    try {
        const patients = await Patient.find().select('-password'); // Don't send passwords back!
        res.json(patients);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch patients." });
    }
});

module.exports = router;