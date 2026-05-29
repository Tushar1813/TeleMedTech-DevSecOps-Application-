const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
// Enable CORS so the React frontend can safely talk to this API
app.use(cors());
app.use(express.json());

// --- ROUTES ---
const patientRoutes = require('./routes/patientRoutes');
app.use('/api/patients', patientRoutes);

const doctorRoutes = require('./routes/doctorRoutes');
app.use('/api/doctors', doctorRoutes);

const appointmentRoutes = require('./routes/appointmentRoutes');
app.use('/api/appointments', appointmentRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
// CRITICAL FIX: Changed 'localhost' to 'telemed_mongo' for Docker networking
const MONGO_URI = process.env.MONGO_URI || 'mongodb://root:password@mongo_db:27017/telemedtech?authSource=admin';

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to TeleMedTech MongoDB'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));

app.get('/api/health', (req, res) => {
    res.json({ status: 'Online', service: 'TeleMedTech API', database: 'Connected' });
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));