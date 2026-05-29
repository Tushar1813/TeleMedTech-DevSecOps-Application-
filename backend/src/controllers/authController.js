const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

const register = async (req, res) => {
    try {
        const { name, email, password, role, specialization } = req.body;

        // Check if email exists in either collection
        const existingPatient = await Patient.findOne({ email });
        const existingDoctor = await Doctor.findOne({ email });
        if (existingPatient || existingDoctor) {
            return res.status(400).json({ error: 'Email already exists.' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Conditional Save
        if (role === 'doctor') {
            const newDoctor = new Doctor({
                name,
                email,
                password: hashedPassword,
                role: 'doctor',
                specialization: specialization || 'General Practice'
            });
            await newDoctor.save();
        } else {
            const newPatient = new Patient({
                name,
                email,
                password: hashedPassword,
                role: 'patient'
            });
            await newPatient.save();
        }

        res.status(201).json({ message: 'Account registered successfully.' });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ error: 'Server error during registration.' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Dual-Search: Find user by email
        let user = await Patient.findOne({ email });
        if (!user) {
            user = await Doctor.findOne({ email });
        }

        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials.' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials.' });
        }

        // Generate JWT
        const payload = {
            userId: user._id,
            role: user.role
        };
        const secret = process.env.JWT_SECRET || 'fallback_secret_key';
        const token = jwt.sign(payload, secret, { expiresIn: '1h' });

        res.json({
            token,
            role: user.role,
            name: user.name
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Server error during login.' });
    }
};

module.exports = {
    register,
    login
};
