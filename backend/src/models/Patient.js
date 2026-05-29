const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // We will encrypt this later!
    phone: { type: String, required: true },
    bloodGroup: { type: String },
    medicalHistory: [{ type: String }], // Array of past conditions
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Patient', patientSchema);