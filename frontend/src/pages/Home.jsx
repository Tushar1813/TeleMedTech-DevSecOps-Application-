import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full mt-20 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                The Future of <span className="text-sky-500">Telemedicine</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mb-8">
                Connect with world-class healthcare professionals securely and instantly from the comfort of your home.
            </p>
            <div className="flex space-x-4">
                <Link to="/login" className="px-6 py-3 text-base font-medium text-white bg-sky-500 rounded-lg hover:bg-sky-600 transition shadow-md">
                    Get Started
                </Link>
            </div>
        </div>
    );
};

export default Home;
