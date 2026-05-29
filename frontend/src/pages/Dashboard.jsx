import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/doctors/available');
      setDoctors(response.data);
    } catch (err) {
      console.error("Failed to fetch doctors:", err);
      setError("Could not load available doctors.");
    }
  };

  const handleBook = async (doctorId, date, timeSlot) => {
    setMessage('');
    setError('');
    try {
      // Hardcoded patientId for demonstration as requested
      const simulatedPatientId = "6a1954846aeae93ea708a499"; 
      const response = await axios.post('http://localhost:5000/api/appointments/book', {
        patientId: simulatedPatientId,
        doctorId,
        appointmentDate: date,
        timeSlot
      });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.error || "Booking failed.");
    }
  };

  return (
    <div className="page-container dashboard-page">
      <h2>Patient Dashboard</h2>
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      
      <div className="doctor-grid">
        {doctors.length === 0 ? (
          <p>No doctors currently available.</p>
        ) : (
          doctors.map(doc => (
            <DoctorCard key={doc._id} doctor={doc} onBook={handleBook} />
          ))
        )}
      </div>
    </div>
  );
};

const DoctorCard = ({ doctor, onBook }) => {
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');

  const submitBooking = (e) => {
    e.preventDefault();
    if (!date || !timeSlot) return;
    onBook(doctor._id, date, timeSlot);
  };

  return (
    <div className="doctor-card">
      <h3>{doctor.name}</h3>
      <p className="specialty">{doctor.specialty}</p>
      <p>Experience: {doctor.experienceYears} years</p>
      
      <form onSubmit={submitBooking} className="booking-form">
        <input 
          type="date" 
          required 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          className="date-input"
        />
        <select 
          required 
          value={timeSlot} 
          onChange={(e) => setTimeSlot(e.target.value)}
          className="time-select"
        >
          <option value="">Select Time</option>
          <option value="09:00 AM">09:00 AM</option>
          <option value="10:00 AM">10:00 AM</option>
          <option value="11:00 AM">11:00 AM</option>
          <option value="02:00 PM">02:00 PM</option>
          <option value="03:00 PM">03:00 PM</option>
        </select>
        <button type="submit" className="primary-btn book-btn">Book Appointment</button>
      </form>
    </div>
  );
};

export default Dashboard;
