import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const Explore = () => {
    const [doctors, setDoctors] = useState([]);
    const [search, setSearch] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Booking Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [appointmentDate, setAppointmentDate] = useState('');
    const [notes, setNotes] = useState('');
    const [bookingProcessing, setBookingProcessing] = useState(false);

    const allSpecializations = ['General Practice', 'Cardiology', 'Pediatrics', 'Neurology', 'Dermatology', 'Psychiatry', 'Orthopedics'];

    useEffect(() => {
        const fetchDoctors = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (search) params.append('search', search);
                if (specialization) params.append('specialization', specialization);

                const response = await api.get(`/doctors?${params.toString()}`);
                setDoctors(response.data);
                setError('');
            } catch (err) {
                console.error('Error fetching doctors:', err);
                setError('Failed to fetch doctors directory.');
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchDoctors();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [search, specialization]);

    const openBookingModal = (doctor) => {
        setSelectedDoctor(doctor);
        setAppointmentDate('');
        setNotes('');
        setIsModalOpen(true);
    };

    const handleConfirmBooking = async (e) => {
        e.preventDefault();
        setBookingProcessing(true);
        try {
            await api.post('/appointments/book', {
                doctorId: selectedDoctor._id,
                appointmentDate,
                notes
            });
            setIsModalOpen(false);
            navigate('/patient-dashboard');
        } catch (err) {
            console.error('Booking error:', err);
            alert('Failed to book appointment. Please try again.');
        } finally {
            setBookingProcessing(false);
        }
    };

    return (
        <div className="space-y-8 relative">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">Explore Specialists</h2>
                    <p className="text-slate-600 max-w-xl">
                        Find the perfect healthcare provider. Browse by name or filter by medical specialty to start your consultation.
                    </p>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <input 
                        type="text" 
                        placeholder="Search doctors by name..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                    />
                </div>
                <div className="sm:w-64">
                    <select 
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition bg-white"
                    >
                        <option value="">All Specialties</option>
                        {allSpecializations.map((spec) => (
                            <option key={spec} value={spec}>{spec}</option>
                        ))}
                    </select>
                </div>
            </div>

            {error && <p className="text-red-500 text-center bg-red-50 p-4 rounded-lg border border-red-200">{error}</p>}

            {/* Doctor Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-slate-100 h-48 rounded-xl border border-slate-200"></div>
                    ))}
                </div>
            ) : doctors.length === 0 ? (
                <div className="bg-white p-12 text-center border-2 border-dashed border-slate-200 rounded-xl">
                    <p className="text-lg text-slate-500 font-medium">No doctors found matching your criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {doctors.map((doctor) => (
                        <div key={doctor._id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all flex flex-col group">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="h-14 w-14 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-xl group-hover:bg-sky-500 group-hover:text-white transition-colors">
                                    {doctor.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg line-clamp-1" title={`Dr. ${doctor.name}`}>
                                        Dr. {doctor.name}
                                    </h3>
                                    <p className="text-sky-600 font-medium text-sm line-clamp-1">{doctor.specialization || 'General'}</p>
                                </div>
                            </div>
                            
                            <div className="mt-auto pt-5 border-t border-slate-100">
                                <button 
                                    onClick={() => openBookingModal(doctor)}
                                    className="w-full py-2.5 bg-slate-800 hover:bg-sky-600 text-white font-medium rounded-lg transition-colors shadow-sm"
                                >
                                    Book Consultation
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Booking Modal */}
            {isModalOpen && selectedDoctor && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-800">
                                Book Appointment
                            </h3>
                            <button 
                                onClick={() => setIsModalOpen(false)} 
                                className="text-slate-400 hover:text-slate-700 transition text-2xl leading-none font-bold"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="mb-6 p-4 bg-sky-50 rounded-xl border border-sky-100 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-sky-600 font-bold text-lg shadow-sm border border-sky-100">
                                    {selectedDoctor.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Consulting With</p>
                                    <p className="font-bold text-slate-800">Dr. {selectedDoctor.name}</p>
                                    <p className="text-sm text-sky-700 font-medium">{selectedDoctor.specialization}</p>
                                </div>
                            </div>
                            
                            <form onSubmit={handleConfirmBooking} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Date &amp; Time</label>
                                    <input 
                                        type="datetime-local" 
                                        required
                                        value={appointmentDate}
                                        onChange={(e) => setAppointmentDate(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition shadow-sm bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Symptoms / Notes (Optional)</label>
                                    <textarea 
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition shadow-sm h-28 resize-none"
                                        placeholder="Briefly describe the reason for your visit..."
                                    ></textarea>
                                </div>
                                <div className="pt-2 flex justify-end space-x-3">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsModalOpen(false)} 
                                        className="px-5 py-2.5 text-slate-700 font-medium hover:bg-slate-100 rounded-lg transition"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={bookingProcessing}
                                        className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition shadow-md flex items-center justify-center"
                                    >
                                        {bookingProcessing ? 'Booking...' : 'Confirm Booking'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Explore;
