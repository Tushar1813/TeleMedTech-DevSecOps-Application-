import React, { useEffect, useState } from 'react';
import useAuthStore from '../store/useAuthStore';
import api from '../api/axiosConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CheckCircle, Clock, FileText, XCircle, Star, Users } from 'lucide-react';

const DoctorDashboard = () => {
    const { user } = useAuthStore();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAptId, setSelectedAptId] = useState(null);
    const [doctorNotes, setDoctorNotes] = useState('');
    const [prescription, setPrescription] = useState('');

    const fetchSchedule = async () => {
        setLoading(true);
        try {
            const response = await api.get('/appointments/my-appointments');
            setAppointments(response.data);
            setError('');
        } catch (err) {
            console.error('Error fetching schedule:', err);
            setError('Failed to load your schedule.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedule();
    }, []);

    const handleStatusUpdate = async (appointmentId, newStatus) => {
        try {
            await api.patch(`/appointments/update-status/${appointmentId}`, { status: newStatus });
            // Optimistically update the UI to trigger AnimatePresence exit animations smoothly
            setAppointments(prev => prev.map(apt => apt._id === appointmentId ? { ...apt, status: newStatus } : apt));
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Failed to update appointment status.');
            fetchSchedule(); // Revert on failure
        }
    };

    const openNotesModal = (apt) => {
        setSelectedAptId(apt._id);
        setDoctorNotes(apt.doctorNotes || '');
        setPrescription(apt.prescription || '');
        setIsModalOpen(true);
    };

    const handleSaveNotes = async (e) => {
        e.preventDefault();
        try {
            await api.patch(`/appointments/${selectedAptId}/notes`, {
                doctorNotes,
                prescription
            });
            setIsModalOpen(false);
            fetchSchedule();
        } catch (err) {
            console.error('Error saving notes:', err);
            alert('Failed to save medical notes.');
        }
    };

    // Derived Statistics
    const pendingCount = appointments.filter(a => a.status === 'Pending').length;
    const confirmedCount = appointments.filter(a => a.status === 'Confirmed').length;
    const completedCount = appointments.filter(a => a.status === 'Completed').length;

    // Framer Motion Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="space-y-8 relative max-w-6xl mx-auto"
        >
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Doctor Dashboard</h2>
                <p className="text-slate-600 text-lg">
                    Welcome back, <span className="font-semibold text-slate-800">Dr. {user?.name || 'Provider'}</span>. Here is your practice overview.
                </p>
            </div>

            {/* Quick Stats Grid */}
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
            >
                {/* Pending Stat */}
                <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-5 hover:shadow-md transition-shadow">
                    <div className="p-4 bg-amber-100 text-amber-600 rounded-xl">
                        <Clock className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Pending Requests</p>
                        <p className="text-3xl font-black text-slate-800 mt-1">{pendingCount}</p>
                    </div>
                </motion.div>

                {/* Confirmed Stat */}
                <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-5 hover:shadow-md transition-shadow">
                    <div className="p-4 bg-sky-100 text-sky-600 rounded-xl">
                        <Calendar className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Confirmed Today</p>
                        <p className="text-3xl font-black text-slate-800 mt-1">{confirmedCount}</p>
                    </div>
                </motion.div>

                {/* Completed Stat */}
                <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-5 hover:shadow-md transition-shadow">
                    <div className="p-4 bg-emerald-100 text-emerald-600 rounded-xl">
                        <CheckCircle className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Completed</p>
                        <p className="text-3xl font-black text-slate-800 mt-1">{completedCount}</p>
                    </div>
                </motion.div>

                {/* Practice Analytics - Patients Seen */}
                <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-5 hover:shadow-md transition-shadow">
                    <div className="p-4 bg-purple-100 text-purple-600 rounded-xl">
                        <Users className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Monthly Patients</p>
                        <p className="text-3xl font-black text-slate-800 mt-1">42</p>
                    </div>
                </motion.div>

                {/* Practice Analytics - Average Rating */}
                <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-5 hover:shadow-md transition-shadow">
                    <div className="p-4 bg-yellow-100 text-yellow-500 rounded-xl">
                        <Star className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Average Rating</p>
                        <p className="text-3xl font-black text-slate-800 mt-1">4.8</p>
                    </div>
                </motion.div>
            </motion.div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-slate-500" />
                    Appointment Roster
                </h3>
                
                {error && <p className="text-red-500 mb-4 bg-red-50 p-4 rounded-xl border border-red-200">{error}</p>}
                
                {loading ? (
                    <div className="animate-pulse space-y-4">
                        {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-100 rounded-xl border border-slate-200"></div>)}
                    </div>
                ) : appointments.length === 0 ? (
                    <div className="p-16 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                        <div className="inline-flex p-4 bg-slate-50 rounded-full mb-4">
                            <Calendar className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-lg text-slate-500 font-medium">Your schedule is entirely clear.</p>
                    </div>
                ) : (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="space-y-6 relative border-l-2 border-slate-200 ml-4 pl-6"
                    >
                        <AnimatePresence mode="popLayout">
                            {appointments.map((apt) => (
                                <motion.div 
                                    key={apt._id}
                                    layout
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="show"
                                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                    className="relative bg-slate-50 border border-slate-200 p-5 rounded-2xl hover:shadow-md transition-shadow flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 group"
                                >
                                    {/* Timeline Dot */}
                                    <div className="absolute w-4 h-4 bg-sky-500 rounded-full -left-[31px] top-6 border-4 border-white shadow-sm"></div>

                                    {/* Patient Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-sm font-bold text-sky-600 bg-sky-100 px-2 py-0.5 rounded-md">
                                                {new Date(apt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                                            {apt.patientId?.name || 'Unknown Patient'} 
                                            <span className="text-slate-500 text-sm font-normal">(Age: 35)</span>
                                        </h4>
                                        <p className="text-sm text-slate-700 font-medium mb-1 mt-1">
                                            <span className="font-bold text-slate-800">Chief Complaint:</span> Frequent headaches
                                        </p>
                                        <p className="text-sm text-slate-500 font-medium mb-2">{apt.patientId?.email}</p>
                                        <div className="flex flex-wrap items-center gap-3 text-sm">
                                            <span className="bg-white border border-slate-200 px-3 py-1 rounded-full text-slate-600 font-medium flex items-center gap-1.5 shadow-sm">
                                                <Clock className="w-4 h-4 text-sky-500" />
                                                {new Date(apt.appointmentDate).toLocaleString()}
                                            </span>
                                            {apt.notes && (
                                                <span className="bg-white border border-slate-200 px-3 py-1 rounded-full text-slate-500 italic shadow-sm max-w-xs truncate" title={apt.notes}>
                                                    "{apt.notes}"
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Status & Actions */}
                                    <div className="flex flex-col items-end gap-3 w-full lg:w-auto">
                                        <span className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm border
                                            ${apt.status === 'Pending' ? 'bg-amber-100 text-amber-700 border-amber-200' : 
                                              apt.status === 'Confirmed' ? 'bg-sky-100 text-sky-700 border-sky-200' : 
                                              apt.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                                              'bg-slate-200 text-slate-700 border-slate-300'}`}>
                                            {apt.status}
                                        </span>
                                        
                                        <div className="flex items-center gap-2">
                                            {apt.status === 'Pending' && (
                                                <>
                                                    <motion.button 
                                                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleStatusUpdate(apt._id, 'Confirmed')}
                                                        className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                                                    >
                                                        <CheckCircle className="w-4 h-4" /> Confirm
                                                    </motion.button>
                                                    <motion.button 
                                                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleStatusUpdate(apt._id, 'Cancelled')}
                                                        className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 text-sm font-semibold rounded-lg border border-red-200 shadow-sm transition-colors flex items-center gap-1.5"
                                                    >
                                                        <XCircle className="w-4 h-4" /> Decline
                                                    </motion.button>
                                                </>
                                            )}
                                            {apt.status === 'Confirmed' && (
                                                <motion.button 
                                                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleStatusUpdate(apt._id, 'Completed')}
                                                    className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                                                >
                                                    <CheckCircle className="w-4 h-4" /> Mark Completed
                                                </motion.button>
                                            )}
                                            {apt.status === 'Completed' && (
                                                <motion.button 
                                                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                                    onClick={() => openNotesModal(apt)}
                                                    className={`px-5 py-2 text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 border
                                                        ${(apt.prescription || apt.doctorNotes) 
                                                            ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100' 
                                                            : 'bg-slate-800 text-white border-transparent hover:bg-slate-900'}`}
                                                >
                                                    <FileText className="w-4 h-4" />
                                                    {(apt.prescription || apt.doctorNotes) ? 'Edit Record' : 'Add Medical Notes'}
                                                </motion.button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>

            {/* Medical Notes Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200"
                        >
                            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-purple-600" /> Post-Consultation Record
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 transition">
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>
                            <form onSubmit={handleSaveNotes} className="p-6 space-y-6 bg-white">
                                {/* Mini-Profile Section */}
                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-wrap gap-4 text-sm mb-4">
                                    <div className="flex-1 min-w-[120px]">
                                        <p className="text-slate-500 font-semibold mb-1 uppercase tracking-wider text-xs">Total Previous Visits</p>
                                        <p className="font-bold text-slate-800">2</p>
                                    </div>
                                    <div className="flex-1 min-w-[120px]">
                                        <p className="text-slate-500 font-semibold mb-1 uppercase tracking-wider text-xs">Last Visit Date</p>
                                        <p className="font-bold text-slate-800">Jan 14, 2026</p>
                                    </div>
                                    <div className="flex-1 min-w-[120px]">
                                        <p className="text-slate-500 font-semibold mb-1 uppercase tracking-wider text-xs">Ongoing Medications</p>
                                        <p className="font-bold text-red-600">None</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Clinical Notes</label>
                                    <textarea 
                                        value={doctorNotes}
                                        onChange={(e) => setDoctorNotes(e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none h-28 shadow-sm resize-none bg-slate-50 focus:bg-white transition-colors"
                                        placeholder="Patient presented with..."
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-purple-800 mb-2 uppercase tracking-wide">Prescription (Rx)</label>
                                    <textarea 
                                        value={prescription}
                                        onChange={(e) => setPrescription(e.target.value)}
                                        className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none h-28 shadow-sm resize-none bg-purple-50/50 focus:bg-white transition-colors text-purple-900 font-medium"
                                        placeholder="Rx: Amoxicillin 500mg BID x 7 days"
                                    ></textarea>
                                </div>
                                <div className="pt-2 flex justify-end space-x-3">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-lg transition">Cancel</button>
                                    <motion.button 
                                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                        type="submit" 
                                        className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition shadow-md flex items-center gap-2"
                                    >
                                        <CheckCircle className="w-4 h-4" /> Save Record
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default DoctorDashboard;
