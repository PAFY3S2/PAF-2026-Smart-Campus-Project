import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { CheckCircle, XCircle, Filter, Search, Calendar, User, MessageSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Rejection Modal State
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchBookings = () => {
    api.get('/bookings').then(res => {
      const data = res.data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
      setBookings(data);
      setFilteredBookings(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    let result = bookings;
    if (filterStatus !== 'ALL') {
      result = result.filter(b => b.status === filterStatus);
    }
    if (searchTerm) {
      result = result.filter(b => 
        b.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.purpose?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.resourceId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredBookings(result);
  }, [filterStatus, searchTerm, bookings]);

  const handleUpdateStatus = async (id, newStatus, reason = '') => {
    try {
      await api.put(`/bookings/${id}`, { status: newStatus, adminReason: reason });
      fetchBookings();
      setShowRejectModal(false);
      setRejectionReason('');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  const openRejectModal = (booking) => {
    setSelectedBooking(booking);
    setShowRejectModal(true);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* HEADER & FILTERS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase mb-2 block">MODULE B: BOOKING CONTROL</span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Manage Requests</h1>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
             <input 
              type="text" 
              placeholder="Search User or Resource..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary outline-none text-slate-300 w-64 transition-all"
             />
          </div>
          
          <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(status => (
              <motion.button
                key={status}
                whileTap={{ scale: 0.9 }}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold tracking-widest transition-all ${filterStatus === status ? 'bg-blue-900 dark:bg-white text-white dark:text-blue-900 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {status}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* BOOKINGS TABLE */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-slate-500 font-bold tracking-widest animate-pulse">SYNCHRONIZING TELEMETRY...</div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center">
             <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
               <Filter className="w-8 h-8 text-slate-600" />
             </div>
             <p className="text-slate-500 font-bold tracking-widest text-sm uppercase">No matching bookings found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50 border-b border-slate-800">
                  <th className="px-8 py-5 font-bold text-[10px] text-slate-500 uppercase tracking-[.2em]">User Context</th>
                  <th className="px-6 py-5 font-bold text-[10px] text-slate-500 uppercase tracking-[.2em]">Resource</th>
                  <th className="px-6 py-5 font-bold text-[10px] text-slate-500 uppercase tracking-[.2em]">Schedule</th>
                  <th className="px-6 py-5 font-bold text-[10px] text-slate-500 uppercase tracking-[.2em]">Purpose</th>
                  <th className="px-6 py-5 font-bold text-[10px] text-slate-500 uppercase tracking-[.2em]">Status</th>
                  <th className="px-8 py-5 font-bold text-[10px] text-slate-500 uppercase tracking-[.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredBookings.map((booking) => (
                  <motion.tr 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    key={booking.id} 
                    className="hover:bg-slate-800/30 transition-all group"
                  >
                    <td className="px-8 py-6">
                       <div className="flex items-center space-x-3">
                         <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-primary font-bold">
                           <User className="w-4 h-4" />
                         </div>
                         <div>
                           <p className="font-bold text-slate-200">{booking.userId?.name || 'User #' + booking.userId}</p>
                           <p className="text-[10px] text-slate-500 uppercase tracking-widest">{booking.userId?.email}</p>
                         </div>
                       </div>
                    </td>
                    <td className="px-6 py-6 text-slate-400 font-medium">
                      <div className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                        <span>{booking.resourceId?.name || 'Res #' + booking.resourceId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center space-x-2 text-slate-300 font-bold mb-1 uppercase text-xs">
                         <Calendar className="w-3.5 h-3.5 text-primary" />
                         <span>{booking.date}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 tracking-widest font-black pl-5">
                        {booking.startTime} - {booking.endTime}
                      </div>
                    </td>
                    <td className="px-6 py-6 font-medium">
                       <p className="text-slate-400 max-w-[180px] truncate" title={booking.purpose}>{booking.purpose}</p>
                       <p className="text-[10px] text-slate-600 mt-1 uppercase font-bold tracking-widest">{booking.attendees} ATTENDEES</p>
                    </td>
                    <td className="px-6 py-6">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black tracking-widest shadow-sm
                        ${booking.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30' : 
                          booking.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/40' : 
                          booking.status === 'REJECTED' ? 'bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/40' : 
                          'bg-slate-800 text-slate-500'}`}
                      >
                        {booking.status}
                      </div>
                      {booking.adminReason && (
                        <div className="mt-2 text-[10px] text-slate-500 italic max-w-[150px] truncate" title={booking.adminReason}>
                           "{booking.adminReason}"
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {booking.status === 'PENDING' && (
                          <>
                            <button 
                              onClick={() => handleUpdateStatus(booking.id, 'APPROVED')}
                              className="p-2.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-xl transition-all shadow-lg shadow-emerald-500/5 border border-emerald-500/20"
                              title="Confirm Approval"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => openRejectModal(booking)}
                              className="p-2.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl transition-all shadow-lg shadow-rose-500/5 border border-rose-500/20"
                              title="Deny Request"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {booking.status === 'APPROVED' && (
                          <button 
                            onClick={() => handleUpdateStatus(booking.id, 'CANCELLED')}
                            className="px-4 py-2 border border-slate-800 text-slate-500 hover:text-rose-400 hover:border-rose-400/30 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase"
                          >
                            REVOKE
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* REJECTION MODAL (SLIIT MODULE B REQUIREMENT) */}
      <AnimatePresence>
        {showRejectModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowRejectModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] shadow-2xl max-w-md w-full relative z-10"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-black text-white mb-1">Reject Request</h3>
                  <p className="text-xs text-slate-500 font-bold tracking-widest uppercase">BOOKING ID: {selectedBooking?.id}</p>
                </div>
                <button onClick={() => setShowRejectModal(false)} className="text-slate-500 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6">
                 <label className="block text-[10px] font-black tracking-widest text-slate-500 uppercase mb-3">REJECTION REASON (REQUIRED)</label>
                 <textarea 
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Resource under maintenance, Time slot conflict..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-slate-300 text-sm focus:ring-1 focus:ring-rose-500 outline-none h-32 resize-none transition-all"
                 />
              </div>

              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-black tracking-[.2em] rounded-2xl transition"
                >
                  CANCEL
                </button>
                <button 
                  disabled={!rejectionReason.trim()}
                  onClick={() => handleUpdateStatus(selectedBooking.id, 'REJECTED', rejectionReason)}
                  className="flex-1 py-4 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-black tracking-[.2em] rounded-2xl transition disabled:opacity-30 flex items-center justify-center space-x-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>CONFIRM</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminBookings;
