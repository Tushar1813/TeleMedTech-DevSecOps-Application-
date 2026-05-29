const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { bookAppointment, getMyAppointments, updateAppointmentStatus, addMedicalNotes } = require('../controllers/appointmentController');

router.use(authMiddleware);

router.post('/book', bookAppointment);
router.get('/my-appointments', getMyAppointments);
router.patch('/update-status/:id', updateAppointmentStatus);
router.patch('/:id/notes', addMedicalNotes);

module.exports = router;
