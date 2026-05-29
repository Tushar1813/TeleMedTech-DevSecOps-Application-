import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import useAuthStore from '../store/useAuthStore';

const Login = () => {
    // Mode Toggle
    const [isRegistering, setIsRegistering] = useState(false);
    
    // Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('patient');
    const [specialization, setSpecialization] = useState('');
    
    // UI State
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);
        
        try {
            if (isRegistering) {
                // Registration Flow
                const payload = { name, email, password, role };
                if (role === 'doctor') {
                    payload.specialization = specialization || 'General Practice';
                }
                
                await api.post('/auth/register', payload);
                setSuccessMessage('Account created successfully! Please log in.');
                setIsRegistering(false); // Switch to login mode
                // Reset registration specific fields
                setName('');
                setSpecialization('');
            } else {
                // Login Flow
                const response = await api.post('/auth/login', {
                    email,
                    password
                });
                
                const { token, role: userRole, name: userName } = response.data;
                login({ name: userName, email }, token, userRole);
                
                if (userRole === 'patient') {
                    navigate('/patient-dashboard');
                } else if (userRole === 'doctor') {
                    navigate('/doctor-dashboard');
                } else {
                    navigate('/');
                }
            }
        } catch (err) {
            console.error('Auth error:', err);
            setError(err.response?.data?.error || (isRegistering ? 'Registration failed.' : 'Invalid email or password.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">
                {isRegistering ? 'Create an Account' : 'Welcome Back'}
            </h2>
            
            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm border border-red-200 rounded-lg">
                    {error}
                </div>
            )}
            
            {successMessage && (
                <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm border border-green-200 rounded-lg">
                    {successMessage}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
                {isRegistering && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                                required
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">I am a...</label>
                            <select 
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow bg-white"
                            >
                                <option value="patient">Patient</option>
                                <option value="doctor">Doctor</option>
                            </select>
                        </div>
                        
                        {role === 'doctor' && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Specialization</label>
                                <input 
                                    type="text" 
                                    value={specialization}
                                    onChange={(e) => setSpecialization(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                                    placeholder="e.g. Cardiology"
                                    required={role === 'doctor'}
                                />
                            </div>
                        )}
                    </>
                )}

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                        required
                        placeholder="you@example.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                        required
                        placeholder="••••••••"
                    />
                </div>
                
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-medium rounded-lg shadow-sm transition-colors flex justify-center items-center"
                >
                    {loading ? 'Processing...' : (isRegistering ? 'Sign Up' : 'Sign In')}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500">
                {isRegistering ? (
                    <p>
                        Already have an account?{' '}
                        <button 
                            onClick={() => { setIsRegistering(false); setError(''); setSuccessMessage(''); }}
                            className="text-sky-500 font-semibold hover:underline"
                        >
                            Sign In
                        </button>
                    </p>
                ) : (
                    <p>
                        Don't have an account?{' '}
                        <button 
                            onClick={() => { setIsRegistering(true); setError(''); setSuccessMessage(''); }}
                            className="text-sky-500 font-semibold hover:underline"
                        >
                            Create one
                        </button>
                    </p>
                )}
            </div>
        </div>
    );
};

export default Login;
