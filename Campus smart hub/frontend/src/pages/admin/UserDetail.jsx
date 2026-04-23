import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Shield, 
  Mail, 
  Building2, 
  Users, 
  Hash, 
  Phone,
  ClipboardList,
  AlertTriangle,
  ChevronRight,
  Box,
  GraduationCap,
  Wrench,
  CheckCircle,
  XCircle,
  Timer,
  Activity,
  CalendarDays,
  Layers
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import technicianDefault from '../../assets/technician_default.png';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, bookingsRes] = await Promise.all([
          api.get(`/auth/users/${id}`),
          api.get(`/bookings/user/${id}`)
        ]);
        setUserData(userRes.data);
        setBookings(bookingsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const roleBadge = (role) => {
    const map = {
      ADMIN: { bg: 'bg-rose-500/10', text: 'text-rose-400', ring: 'ring-1 ring-rose-500/30', icon: Shield, label: 'Admin', dot: 'bg-rose-400' },
      TECHNICIAN: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', ring: 'ring-1 ring-emerald-500/30', icon: Wrench, label: 'Technician', dot: 'bg-emerald-400' },
      USER: { bg: 'bg-blue-500/10', text: 'text-blue-400', ring: 'ring-1 ring-blue-500/30', icon: GraduationCap, label: 'Student', dot: 'bg-blue-400' },
    };
    return map[role] || map.USER;
  };

  const statusBadge = (status) => {
    const map = {
      APPROVED: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', ring: 'ring-1 ring-emerald-500/30', icon: CheckCircle },
      PENDING: { bg: 'bg-amber-500/10', text: 'text-amber-400', ring: 'ring-1 ring-amber-500/30', icon: Timer },
      REJECTED: { bg: 'bg-rose-500/10', text: 'text-rose-400', ring: 'ring-1 ring-rose-500/30', icon: XCircle },
      CANCELLED: { bg: 'bg-slate-800', text: 'text-slate-500', ring: 'ring-1 ring-slate-700', icon: XCircle },
    };
    return map[status] || map.CANCELLED;
  };

  // Booking stats
  const bookingStats = {
    total: bookings.length,
    approved: bookings.filter(b => b.status === 'APPROVED').length,
    pending: bookings.filter(b => b.status === 'PENDING').length,
    rejected: bookings.filter(b => b.status === 'REJECTED').length,
  };

  if (loading) return (
    <div className="p-20 text-center text-slate-500 font-bold tracking-widest uppercase animate-pulse">
      Loading User Profile...
    </div>
  );

  if (!userData) return (
    <div className="p-20 text-center flex flex-col items-center">
      <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-rose-400" />
      </div>
      <p className="text-rose-400 font-bold tracking-widest uppercase">User Not Found</p>
      <button 
        onClick={() => navigate('/admin/users')}
        className="mt-4 px-6 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
      >
        ← Back to Directory
      </button>
    </div>
  );

  const badge = roleBadge(userData.role);

  return (
    <div className="space-y-8 pb-20">
      {/* HEADER */}
      <div className="flex items-center space-x-5">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/admin/users')}
          className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 hover:text-primary hover:border-primary/50 transition-all group"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
        </motion.button>
        <div>
          <span className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase mb-1 block">
            USER PROFILE :: {(userData._id || '').slice(-8).toUpperCase()}
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {userData.name}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:items-start">
        {/* ═══════ LEFT COLUMN ═══════ */}
        <div className="lg:col-span-1 space-y-6">

          {/* Profile Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl relative overflow-hidden"
          >
            {/* Gradient accent */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-violet-500 to-primary rounded-t-3xl" />

            <div className="flex flex-col items-center text-center pt-2">
              {/* Avatar */}
              <div className="relative mb-5">
                <img 
                  src={userData.avatar && !userData.avatar.includes('ui-avatars.com') ? userData.avatar : (userData.role === 'TECHNICIAN' ? technicianDefault : userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&bg=334155&color=fff&size=128`)} 
                  className="w-28 h-28 rounded-2xl border-2 border-slate-200 dark:border-slate-700 object-cover shadow-lg" 
                  alt={userData.name} 
                  onError={(e) => {
                    if (userData.role === 'TECHNICIAN') e.target.src = technicianDefault;
                    else e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&bg=334155&color=fff&size=128`;
                  }}
                />
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-lg ${badge.bg} ${badge.ring} flex items-center justify-center`}>
                  <badge.icon className={`w-3.5 h-3.5 ${badge.text}`} />
                </div>
              </div>

              {/* Name & Role */}
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-1">{userData.name}</h2>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${badge.bg} ${badge.text} ${badge.ring} mb-4`}>
                <badge.icon className="w-3 h-3 mr-1.5" />
                {badge.label}
              </span>

              {/* Quick email */}
              <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 dark:bg-slate-800/50 px-4 py-2 rounded-xl w-full justify-center">
                <Mail className="w-3.5 h-3.5 text-primary" />
                <span className="truncate">{userData.email}</span>
              </div>
            </div>
          </motion.div>

          {/* Details Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl"
          >
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-5 flex items-center">
              <Activity className="w-3.5 h-3.5 mr-2 text-primary" />
              Profile Details
            </h3>

            <div className="space-y-4">
              {[
                { label: 'Student ID', value: userData.studentId, icon: Hash, color: 'text-blue-400' },
                { label: 'Faculty', value: userData.faculty, icon: Building2, color: 'text-violet-400' },
                { label: 'Batch', value: userData.batch, icon: Users, color: 'text-amber-400' },
                { label: 'Contact', value: userData.contactNumber, icon: Phone, color: 'text-emerald-400' },
                { label: 'Joined', value: userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : null, icon: CalendarDays, color: 'text-primary' },
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800/50">
                  <div className={`w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center ${item.color} shrink-0`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                    {item.value ? (
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{item.value}</p>
                    ) : (
                      <p className="text-sm text-slate-400 italic">Not configured</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Booking Stats Mini */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl"
          >
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-5 flex items-center">
              <Layers className="w-3.5 h-3.5 mr-2 text-primary" />
              Booking Summary
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Total', val: bookingStats.total, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                { label: 'Approved', val: bookingStats.approved, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
                { label: 'Pending', val: bookingStats.pending, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
                { label: 'Rejected', val: bookingStats.rejected, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
              ].map((s, i) => (
                <div key={i} className={`${s.bg} border ${s.border} rounded-xl p-3 text-center`}>
                  <p className={`text-xl font-black ${s.color}`}>{s.val}</p>
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ═══════ RIGHT COLUMN: BOOKING HISTORY ═══════ */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <ClipboardList className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Booking History</h3>
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                {bookings.length} Records
              </span>
            </div>

            {/* Content */}
            <div className="p-4">
              {bookings.length === 0 ? (
                <div className="py-16 text-center flex flex-col items-center">
                  <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <ClipboardList className="w-7 h-7 text-slate-400 dark:text-slate-600" />
                  </div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">No bookings found for this user</p>
                  <p className="text-xs text-slate-400 mt-1">Booking history will appear here once the user makes a reservation.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.map((booking, i) => {
                    const sBadge = statusBadge(booking.status);
                    return (
                      <motion.div 
                        key={booking._id} 
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50 p-5 rounded-2xl hover:border-slate-200 dark:hover:border-slate-700 transition-all group"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          {/* Left: Resource info */}
                          <div className="flex items-center space-x-4 flex-1 min-w-0">
                            <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-primary border border-slate-200 dark:border-slate-700 shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                              <Box className="w-5 h-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              {/* Resource type */}
                              {booking.resourceId?.type && (
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                                  {booking.resourceId.type}
                                </p>
                              )}
                              {/* Resource name */}
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                {booking.resourceId?.name || 'Unknown Resource'}
                              </h4>
                              {/* Schedule */}
                              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                                <span className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                                  <Calendar className="w-3 h-3 text-primary" />
                                  {booking.date}
                                </span>
                                <span className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  {booking.startTime} – {booking.endTime}
                                </span>
                              </div>
                              {/* Purpose */}
                              {booking.purpose && (
                                <p className="text-xs text-slate-500 mt-1.5 truncate max-w-[300px]" title={booking.purpose}>
                                  "{booking.purpose}"
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Right: Status */}
                          <div className="flex items-center gap-3 shrink-0">
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest ${sBadge.bg} ${sBadge.text} ${sBadge.ring}`}>
                              <sBadge.icon className="w-3 h-3 mr-1.5" />
                              {booking.status}
                            </span>
                          </div>
                        </div>

                        {/* Admin reason if present */}
                        {booking.adminReason && (
                          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/50">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Admin Feedback</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 italic">"{booking.adminReason}"</p>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
