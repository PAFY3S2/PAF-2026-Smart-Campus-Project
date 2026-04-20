import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Box, Info, XCircle, RefreshCw, AlertTriangle, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import api from '../../services/api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = () => {
    setLoading(true);
    api.get('/bookings/me')
      .then(res => {
        setBookings(res.data);
        setError(null);
      })
      .catch(err => {
        setError("Failed to synchronize with central node.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to revoke this reservation?")) return;
    try {
      await api.put(`/bookings/${id}`, { status: 'CANCELLED' });
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Revocation failed.");
    }
  };

  const getStatusStyles = (status) => {
    switch(status) {
      case 'APPROVED': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'PENDING': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'REJECTED': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'CANCELLED': return 'bg-slate-800 text-slate-500 border-slate-700/50';
      default: return 'bg-slate-800 text-slate-500 border-slate-700/50';
    }
  };

  return (
    <div className="space-y-8 pb-12 relative">
      {/* ACADEMIC COVER BANNER */}
      <div 
        className="absolute top-0 left-0 w-full h-[350px] -mt-8 -ml-8 -mr-8 md:-ml-12 md:-mr-12 w-[calc(100%+4rem)] md:w-[calc(100%+6rem)] bg-cover bg-center bg-no-repeat rounded-b-[4rem] z-0 opacity-80"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop")', maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)' }}
      >
         <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent mix-blend-multiply" />
      </div>

      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10 pt-16"
      >
        <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-primary/5">
          <span className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase mb-2 block drop-shadow-md">PERSONAL ARCHIVE</span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-xl">My Reservations</h1>
        </div>
        <button 
          onClick={fetchBookings}
          className="flex items-center space-x-2 px-6 py-3 bg-white text-slate-900 hover:bg-slate-100 shadow-xl transform hover:-translate-y-0.5 duration-200 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase border border-white/20 backdrop-blur-md"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>SYNC STATUS</span>
        </button>
      </motion.div>

      {!loading && bookings.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-xl dark:shadow-2xl relative overflow-hidden z-10 mt-6"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -mr-32 -mt-32 rounded-full pointer-events-none" />
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase mb-1 block">ANALYTICS ENGINE</span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center">
                <PieChartIcon className="w-6 h-6 mr-3 text-primary" />
                Booking Demographics
              </h3>
            </div>
          </div>
          
          <div className="h-64 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'APPROVED', value: bookings.filter(b => b.status === 'APPROVED').length, color: '#10b981' },
                    { name: 'PENDING', value: bookings.filter(b => b.status === 'PENDING').length, color: '#f59e0b' },
                    { name: 'REVOKED/REJECTED', value: bookings.filter(b => ['REJECTED', 'CANCELLED'].includes(b.status)).length, color: '#f43f5e' }
                  ].filter(d => d.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {[
                    { name: 'APPROVED', value: bookings.filter(b => b.status === 'APPROVED').length, color: '#10b981' },
                    { name: 'PENDING', value: bookings.filter(b => b.status === 'PENDING').length, color: '#f59e0b' },
                    { name: 'REVOKED/REJECTED', value: bookings.filter(b => ['REJECTED', 'CANCELLED'].includes(b.status)).length, color: '#f43f5e' }
                  ].filter(d => d.value > 0).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', fontSize: '12px' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', fontFamily: 'Inter' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center space-x-3 text-xs font-bold uppercase tracking-widest"
          >
            <AlertTriangle className="w-5 h-5" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10">
        {loading ? (
          <div className="col-span-full py-20 text-center text-slate-500 font-bold tracking-widest animate-pulse uppercase">ACCESSING PERSONAL DATA NODE...</div>
        ) : bookings.length === 0 ? (
          <div className="col-span-full py-20 px-8 text-center bg-slate-900 border border-slate-800 rounded-3xl border-dashed">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
               <Calendar className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-slate-400 font-bold tracking-widest uppercase text-sm">No active reservations detected</p>
          </div>
        ) : (
          bookings.map((booking, i) => (
            <motion.div 
              key={booking._id || booking.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ delay: i * 0.05, duration: 0.2 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] shadow-lg dark:shadow-xl hover:shadow-2xl dark:hover:shadow-2xl hover:border-primary/20 dark:hover:border-primary/20 group overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-16 -mt-16" />
              
              <div className="flex justify-between items-start mb-6">
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-[.2em] uppercase border shadow-sm ${getStatusStyles(booking.status)}`}>
                  {booking.status}
                </div>
                <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                  ID: {booking._id?.toString().slice(-6) || booking.id?.toString().slice(-6) || 'N/A'}
                </div>
              </div>

              <div className="space-y-6 relative z-10">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center text-primary border border-slate-200 dark:border-slate-800">
                    <Box className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">{booking.resourceId?.name || 'Loading...'}</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{booking.resourceId?.type || 'Node Type'}</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800/50 space-y-3">
                  <div className="flex items-center space-x-3 text-slate-300 text-xs font-bold uppercase tracking-widest">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{booking.date}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-500 text-[10px] font-black uppercase tracking-widest pl-7">
                    <Clock className="w-4 h-4 text-slate-700" />
                    <span>{booking.startTime} - {booking.endTime}</span>
                  </div>
                </div>

                <div className="space-y-2">
                   <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">PURPOSE</p>
                   <p className="text-sm text-slate-400 leading-relaxed italic">"{booking.purpose}"</p>
                </div>

                {booking.adminReason && (
                   <div className="mt-4 p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl flex items-start space-x-3">
                      <Info className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-1">ADMIN FEEDBACK</p>
                        <p className="text-xs text-slate-300 leading-relaxed italic">"{booking.adminReason}"</p>
                      </div>
                   </div>
                )}

                {/* CANCELLATION ACTION (SLIIT MODULE B REQUIREMENT) */}
                {(booking.status === 'APPROVED' || booking.status === 'PENDING') && (
                  <button 
                    onClick={() => handleCancel(booking._id || booking.id)}
                    className="w-full mt-6 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:border-rose-200 dark:hover:border-rose-500/30 text-[10px] font-black tracking-[0.3em] text-slate-500 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 rounded-2xl transition-all uppercase flex items-center justify-center space-x-2 group-actions"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>REVOKE RESERVATION</span>
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyBookings;
