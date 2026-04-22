import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  CheckCircle, XCircle, Filter, Search, Calendar, User,
  MessageSquare, X, Clock, MapPin, Users, Eye, FileText,
  TrendingUp, AlertTriangle, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Review Modal State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [adminReason, setAdminReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBookings = () => {
    setLoading(true);
    api.get('/bookings')
      .then(res => {
        const data = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setBookings(data);
        setFilteredBookings(data);
      })
      .catch(err => {
        console.error(err);
        toast.error('Failed to load bookings');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  useEffect(() => {
    let result = bookings;
    if (filterStatus !== 'ALL') result = result.filter(b => b.status === filterStatus);
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(b =>
        b.userId?.name?.toLowerCase().includes(q) ||
        b.purpose?.toLowerCase().includes(q) ||
        b.resourceId?.name?.toLowerCase().includes(q)
      );
    }
    setFilteredBookings(result);
  }, [filterStatus, searchTerm, bookings]);

  // Stats
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'PENDING').length,
    approved: bookings.filter(b => b.status === 'APPROVED').length,
    rejected: bookings.filter(b => b.status === 'REJECTED').length,
  };

  const openReview = (booking) => {
    setSelectedBooking(booking);
    setAdminReason('');
    setShowReviewModal(true);
  };

  const handleAction = async (action) => {
    if (!selectedBooking) return;
    if (action === 'REJECTED' && !adminReason.trim()) {
      toast.error('Rejection reason is required');
      return;
    }
    setActionLoading(true);
    try {
      const id = selectedBooking._id || selectedBooking.id;
      await api.put(`/bookings/${id}`, {
        status: action,
        adminReason: adminReason.trim() || undefined,
      });
      toast.success(action === 'APPROVED' ? 'Booking approved!' : 'Booking rejected.');
      setShowReviewModal(false);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleQuickApprove = async (booking) => {
    try {
      const id = booking._id || booking.id;
      await api.put(`/bookings/${id}`, { status: 'APPROVED' });
      toast.success('Booking approved!');
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Approve failed');
    }
  };

  const handleRevoke = async (booking) => {
    try {
      const id = booking._id || booking.id;
      await api.put(`/bookings/${id}`, { status: 'CANCELLED' });
      toast.success('Booking revoked.');
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Revoke failed');
    }
  };

  const statusBadge = (status) => {
    const map = {
      APPROVED: 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30',
      PENDING:  'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/40',
      REJECTED: 'bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/40',
      CANCELLED:'bg-slate-800 text-slate-500 ring-1 ring-slate-700',
    };
    return map[status] || map.CANCELLED;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* HEADER */}
      <div>
        <span className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase mb-2 block">
          MODULE B: BOOKING CONTROL
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Manage Booking Requests
        </h1>
        <p className="text-slate-500 text-sm mt-1">Review, approve, or reject student booking requests with feedback.</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Requests', val: stats.total, icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
          { label: 'Pending Review', val: stats.pending, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
          { label: 'Approved', val: stats.approved, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
          { label: 'Rejected', val: stats.rejected, icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`${s.bg} border ${s.border} rounded-2xl p-5 flex items-center justify-between`}
          >
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">{s.label}</p>
              <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
            </div>
            <s.icon className={`w-8 h-8 ${s.color} opacity-40`} />
          </motion.div>
        ))}
      </div>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search user, resource, purpose..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary outline-none text-slate-900 dark:text-slate-300 w-72 transition-all"
          />
        </div>
        <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(status => (
            <motion.button
              key={status}
              whileTap={{ scale: 0.9 }}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold tracking-widest transition-all ${
                filterStatus === status
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {status}
              {status === 'PENDING' && stats.pending > 0 && (
                <span className="ml-1.5 bg-amber-500 text-white text-[8px] font-black rounded-full w-4 h-4 inline-flex items-center justify-center">
                  {stats.pending}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-slate-500 font-bold tracking-widest animate-pulse">LOADING BOOKINGS...</div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <Filter className="w-8 h-8 text-slate-400 dark:text-slate-600" />
            </div>
            <p className="text-slate-500 font-bold tracking-widest text-sm uppercase">No matching bookings found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
                  <th className="px-8 py-5 font-bold text-[10px] text-slate-500 uppercase tracking-[.2em]">User</th>
                  <th className="px-6 py-5 font-bold text-[10px] text-slate-500 uppercase tracking-[.2em]">Resource</th>
                  <th className="px-6 py-5 font-bold text-[10px] text-slate-500 uppercase tracking-[.2em]">Schedule</th>
                  <th className="px-6 py-5 font-bold text-[10px] text-slate-500 uppercase tracking-[.2em]">Purpose</th>
                  <th className="px-6 py-5 font-bold text-[10px] text-slate-500 uppercase tracking-[.2em]">Status</th>
                  <th className="px-8 py-5 font-bold text-[10px] text-slate-500 uppercase tracking-[.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {filteredBookings.map(booking => (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={booking._id || booking.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary font-bold">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-200">{booking.userId?.name || 'Unknown'}</p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest">{booking.userId?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-slate-600 dark:text-slate-400 font-medium">
                      <div className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                        <span>{booking.resourceId?.name || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 font-bold mb-1 text-xs">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 tracking-widest font-black pl-5">
                        {booking.startTime} – {booking.endTime}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-slate-600 dark:text-slate-400 max-w-[180px] truncate" title={booking.purpose}>{booking.purpose}</p>
                      <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-widest">{booking.attendees} attendees</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${statusBadge(booking.status)}`}>
                        {booking.status}
                      </span>
                      {booking.adminReason && (
                        <div className="mt-2 text-[10px] text-slate-500 italic max-w-[150px] truncate" title={booking.adminReason}>
                          "{booking.adminReason}"
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {/* Review button — always visible for PENDING */}
                        {booking.status === 'PENDING' && (
                          <>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => openReview(booking)}
                              className="p-2.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-xl transition-all border border-blue-500/20"
                              title="Review Details"
                            >
                              <Eye className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleQuickApprove(booking)}
                              className="p-2.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-xl transition-all border border-emerald-500/20"
                              title="Quick Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => openReview(booking)}
                              className="p-2.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl transition-all border border-rose-500/20"
                              title="Reject (requires reason)"
                            >
                              <XCircle className="w-4 h-4" />
                            </motion.button>
                          </>
                        )}
                        {booking.status === 'APPROVED' && (
                          <button
                            onClick={() => handleRevoke(booking)}
                            className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-rose-400 hover:border-rose-400/30 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase"
                          >
                            REVOKE
                          </button>
                        )}
                        {(booking.status === 'REJECTED' || booking.status === 'CANCELLED') && (
                          <span className="text-[10px] text-slate-600 font-bold tracking-widest uppercase">Closed</span>
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

      {/* ══════ REVIEW MODAL ══════ */}
      <AnimatePresence>
        {showReviewModal && selectedBooking && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !actionLoading && setShowReviewModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] shadow-2xl max-w-lg w-full relative z-10 max-h-[90vh] overflow-y-auto"
            >
              {/* Accent bar */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-400 rounded-t-[2rem]" />

              {/* Header */}
              <div className="flex justify-between items-start mb-6 mt-1">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">Review Booking</h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                    ID: {(selectedBooking._id || selectedBooking.id)?.slice(-8)}
                  </p>
                </div>
                <button onClick={() => setShowReviewModal(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Booking details */}
              <div className="space-y-4 mb-6">
                {[
                  { label: 'Student', value: selectedBooking.userId?.name || 'Unknown', sub: selectedBooking.userId?.email, icon: User, color: 'text-blue-400' },
                  { label: 'Resource', value: selectedBooking.resourceId?.name || 'N/A', sub: selectedBooking.resourceId?.type, icon: MapPin, color: 'text-violet-400' },
                  { label: 'Date', value: selectedBooking.date, sub: `${selectedBooking.startTime} – ${selectedBooking.endTime}`, icon: Calendar, color: 'text-emerald-400' },
                  { label: 'Attendees', value: `${selectedBooking.attendees} people`, icon: Users, color: 'text-amber-400' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className={`w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center ${item.color}`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{item.value}</p>
                      {item.sub && <p className="text-[10px] text-slate-500">{item.sub}</p>}
                    </div>
                  </div>
                ))}

                {/* Purpose */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Purpose / Reason</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{selectedBooking.purpose}</p>
                </div>
              </div>

              {/* Admin reason textarea */}
              <div className="mb-6">
                <label className="block text-[10px] font-black tracking-widest text-slate-500 uppercase mb-2">
                  Admin Feedback / Reason <span className="text-rose-400">(required for rejection)</span>
                </label>
                <textarea
                  value={adminReason}
                  onChange={e => setAdminReason(e.target.value)}
                  placeholder="e.g. Resource under maintenance, Time conflict, Approved for special use..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-slate-700 dark:text-slate-300 text-sm focus:ring-1 focus:ring-primary outline-none h-24 resize-none transition-all"
                />
              </div>

              {/* Action buttons */}
              <div className="flex space-x-3">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  disabled={actionLoading}
                  onClick={() => handleAction('APPROVED')}
                  className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black tracking-[.2em] rounded-2xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50 shadow-lg shadow-emerald-500/20"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>APPROVE</span>
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  disabled={actionLoading || !adminReason.trim()}
                  onClick={() => handleAction('REJECTED')}
                  className="flex-1 py-4 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-black tracking-[.2em] rounded-2xl transition-all flex items-center justify-center space-x-2 disabled:opacity-30 shadow-lg shadow-rose-500/20"
                >
                  <XCircle className="w-4 h-4" />
                  <span>REJECT</span>
                </motion.button>
              </div>
              {!adminReason.trim() && (
                <p className="text-[9px] text-amber-500 font-bold tracking-widest uppercase mt-3 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> A reason is required to reject. Optional for approval.
                </p>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminBookings;
