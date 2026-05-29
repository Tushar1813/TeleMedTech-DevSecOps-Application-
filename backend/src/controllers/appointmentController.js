const Appointment = require('../models/Appointment');

const bookAppointment = async (req, res) => {
    try {
        const { doctorId, appointmentDate, notes } = req.body;
        const patientId = req.user.userId;

        const newAppointment = new Appointment({
            patientId,
            doctorId,
            appointmentDate,
            notes
        });

        await newAppointment.save();
        res.status(201).json({ message: 'Appointment booked successfully.', appointment: newAppointment });
    } catch (error) {
        console.error('Booking Error:', error);
        res.status(500).json({ error: 'Server error during appointment booking.' });
    }
};

const getMyAppointments = async (req, res) => {
    try {
        const userId = req.user.userId;
        const role = req.user.role;
        let appointments = [];

        if (role === 'patient') {
            appointments = await Appointment.find({ patientId: userId })
                .populate('doctorId', 'name email specialization');
        } else if (role === 'doctor') {
            appointments = await Appointment.find({ doctorId: userId })
                .populate('patientId', 'name email');
        }

        res.json(appointments);
    } catch (error) {
        console.error('Fetch Appointments Error:', error);
        res.status(500).json({ error: 'Server error fetching appointments.' });
    }
};

const updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const appointmentId = req.params.id;
        const doctorId = req.user.userId;

        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) return res.status(404).json({ error: 'Appointment not found.' });

        if (appointment.doctorId.toString() !== doctorId) {
            return res.status(403).json({ error: 'Unauthorized to modify this appointment.' });
        }

        appointment.status = status;
        await appointment.save();

        res.json({ message: 'Appointment status updated successfully.', appointment });
    } catch (error) {
        console.error('Update Status Error:', error);
        res.status(500).json({ error: 'Server error updating appointment status.' });
    }
};

const addMedicalNotes = async (req, res) => {
    try {
        const { doctorNotes, prescription } = req.body;
        const appointmentId = req.params.id;
        const doctorId = req.user.userId;

        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) return res.status(404).json({ error: 'Appointment not found.' });

        if (appointment.doctorId.toString() !== doctorId) {
            return res.status(403).json({ error: 'Unauthorized to add notes to this appointment.' });
        }

        appointment.doctorNotes = doctorNotes;
        appointment.prescription = prescription;
        await appointment.save();

        res.json({ message: 'Medical notes added successfully.', appointment });
    } catch (error) {
        console.error('Add Medical Notes Error:', error);
        res.status(500).json({ error: 'Server error adding notes.' });
    }
};

module.exports = {
    bookAppointment,
    getMyAppointments,
    updateAppointmentStatus,
    addMedicalNotes
};
