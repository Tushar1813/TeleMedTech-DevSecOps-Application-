import React, { useEffect, useState } from 'react';
import useAuthStore from '../store/useAuthStore';
import api from '../api/axiosConfig';

const PatientDashboard = () => {
    const { user } = useAuthStore();
    
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Modal State for Viewing Records
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const response = await api.get('/appointments/my-appointments');
            setAppointments(response.data);
            setError('');
        } catch (err) {
            console.error('Error fetching appointments:', err);
            setError('Failed to load your appointments.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const viewRecord = (apt) => {
        setSelectedRecord(apt);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8 relative max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-3xl font-bold text-slate-800 mb-4">Patient Dashboard</h2>
                <p className="text-slate-600">
                    Welcome back, {user?.name || 'Patient'}. Here are your upcoming appointments.
                </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 mb-6">My Schedule</h3>
                
                {error && <p className="text-red-500 mb-4">{error}</p>}
                
                {loading ? (
                    <p className="text-slate-500">Loading appointments...</p>
                ) : appointments.length === 0 ? (
                    <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-xl">
                        <p className="text-slate-500 font-medium">You have no upcoming appointments.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {appointments.map((apt) => (
                            <div key={apt._id} className="p-5 border border-slate-200 rounded-xl hover:shadow-md transition bg-slate-50">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                    <div>
                                        <h4 className="font-bold text-sky-700 text-lg">Dr. {apt.doctorId?.name || 'Unknown Provider'}</h4>
                                        <p className="text-sm text-slate-600 font-medium">{apt.doctorId?.specialization || 'General'}</p>
                                    </div>
                                    <div className="mt-4 sm:mt-0 flex flex-col items-end space-y-3">
                                        <span className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full 
                                            ${apt.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                                              apt.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 
                                              apt.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                                              'bg-slate-200 text-slate-700'}`}>
                                            {apt.status}
                                        </span>
                                        {apt.status === 'Completed' && (apt.doctorNotes || apt.prescription) && (
                                            <button 
                                                onClick={() => viewRecord(apt)}
                                                className="px-4 py-1.5 text-xs font-bold bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-full transition-colors"
                                            >
                                                View Medical Record
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-5 pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between text-sm text-slate-700 bg-white p-3 rounded-lg border border-slate-100">
                                    <span className="font-semibold flex items-center">
                                        <span className="mr-2 text-lg">📅</span> {new Date(apt.appointmentDate).toLocaleString()}
                                    </span>
                                    {apt.notes && <span className="mt-3 sm:mt-0 italic truncate max-w-sm text-slate-500">"{apt.notes}"</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* View Medical Record Modal */}
            {isModalOpen && selectedRecord && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                            <h3 className="text-xl font-bold text-slate-800">Medical Record</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition text-2xl font-bold leading-none">
                                &times;
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex flex-wrap items-center gap-3 text-slate-600 text-sm border-b border-slate-100 pb-4">
                                <div className="flex items-center gap-1">
                                    <span className="font-semibold text-slate-800">Provider:</span>
                                    <span>Dr. {selectedRecord.doctorId?.name}</span>
                                </div>
                                <span className="text-slate-300">|</span>
                                <div className="flex items-center gap-1">
                                    <span className="font-semibold text-slate-800">Date:</span>
                                    <span>{new Date(selectedRecord.appointmentDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                            
                            {selectedRecord.doctorNotes && (
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800 mb-2 uppercase tracking-wider">Clinical Notes</h4>
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 text-sm whitespace-pre-wrap leading-relaxed">
                                        {selectedRecord.doctorNotes}
                                    </div>
                                </div>
                            )}

                            {selectedRecord.prescription && (
                                <div>
                                    <h4 className="text-sm font-bold text-purple-800 mb-2 uppercase tracking-wider flex items-center gap-2">
                                        Prescription (Rx)
                                    </h4>
                                    <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 text-purple-900 text-sm whitespace-pre-wrap font-medium leading-relaxed">
                                        {selectedRecord.prescription}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-5 border-t border-slate-200 flex justify-end bg-slate-50">
                            <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg transition shadow-sm">
                                Close Record
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientDashboard;
