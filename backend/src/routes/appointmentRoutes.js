const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// POST Route: Book an appointment
router.post('/book', async (req, res) => {
    try {
        const { patientId, doctorId, appointmentDate, timeSlot } = req.body;

        // Verify doctor exists and is available
        const doctor = await Doctor.findById(doctorId);
        if (!doctor || !doctor.isAvailable) {
            return res.status(400).json({ error: "Doctor is not available." });
        }

        // Create the new appointment
        const newAppointment = new Appointment({
            patientId,
            doctorId,
            appointmentDate,
            timeSlot
        });

        // Save to MongoDB
        await newAppointment.save();

        res.status(201).json({ 
            status: "success",
            message: "Appointment booked successfully!",
            appointmentId: newAppointment._id 
        });

    } catch (error) {
        console.error("Booking error:", error);
        res.status(500).json({ error: "Failed to book appointment in the database." });
    }
});

module.exports = router;
