import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const Navbar = () => {
    const { user, role, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-sm border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-2xl font-bold text-sky-500 hover:text-sky-600 transition-colors">
                            TeleMedTech
                        </Link>
                    </div>
                    <div className="flex items-center space-x-6">
                        {!user ? (
                            <Link to="/login" className="text-slate-600 hover:text-sky-500 font-medium transition-colors">
                                Login / Register
                            </Link>
                        ) : (
                            <>
                                {role === 'patient' && (
                                    <>
                                        <Link to="/patient-dashboard" className="text-slate-600 hover:text-sky-500 font-medium transition-colors">
                                            Dashboard
                                        </Link>
                                        <Link to="/explore" className="text-slate-600 hover:text-sky-500 font-medium transition-colors">
                                            Explore Doctors
                                        </Link>
                                    </>
                                )}
                                {role === 'doctor' && (
                                    <Link to="/doctor-dashboard" className="text-slate-600 hover:text-sky-500 font-medium transition-colors">
                                        Dashboard
                                    </Link>
                                )}
                                <div className="hidden sm:flex items-center space-x-4 border-l border-slate-200 pl-4 ml-2">
                                    <span className="text-sm text-slate-500">
                                        Welcome, <span className="font-semibold text-slate-800">{user.name || 'User'}</span>
                                    </span>
                                </div>
                                <button 
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-md hover:bg-slate-900 transition-colors shadow-sm"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
